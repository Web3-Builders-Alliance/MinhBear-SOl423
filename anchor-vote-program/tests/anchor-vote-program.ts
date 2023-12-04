import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorVoteProgram } from "../target/types/anchor_vote_program";
import { Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram } from '@solana/web3.js'
import { createHash } from "crypto";

describe("anchor-vote-program", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.AnchorVoteProgram as Program<AnchorVoteProgram>;

  const provider = anchor.getProvider()

  const signer = Keypair.generate();

  const site = "google.com";

  const hasher = createHash('sha256')
  hasher.update(Buffer.from(site))
  const hash = hasher.digest()

  const [vote, _bump] = PublicKey.findProgramAddressSync([hash], program.programId)

  const confirm = async (signature: string): Promise<string> => {
    const block = await provider.connection.getLatestBlockhash()
    await provider.connection.confirmTransaction({ signature, ...block })

    return signature;
  }

  const log = async (signature: string): Promise<string> => {
    console.log(`https://explorer.solana.com/transaction/${signature}?cluster=custom&customUrl=http%3A%2F%2F127.0.0.1%3A8899`)
  
    return signature;
  }

  it("Airdrop", async () => {
    await provider.connection.requestAirdrop(signer.publicKey, LAMPORTS_PER_SOL * 10).then(confirm).then(log)
  })

  it("Initialized!", async () => {
    // Add your test here.
    const tx = await program.methods
      .initialize(site)
      .accounts({
        signer: signer.publicKey,
        vote,
        systemProgram: SystemProgram.programId
      })
      .signers([signer])
      .rpc()
      .then(confirm)
      .then(log)
  });
});
