import { Address, AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import {
  Commitment,
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";
import wallet from "../wba-wallet.json";
import { IDL, WbaVault } from "../programs/wba_vault";

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// Commitment
const commitment: Commitment = "confirmed";

// Create a devnet connection
const connection = new Connection("https://api.devnet.solana.com");

// Create our anchor provider
const provider = new AnchorProvider(connection, new Wallet(keypair), {
  commitment,
});

// Create our program
const program = new Program<WbaVault>(
  IDL,
  "D51uEDHLbWAxNfodfQDv7qkp8WZtxrhi3uganGbNos7o" as Address,
  provider
);

// Create a random keypair
const vaultState = new PublicKey(
  "8vbecWfBZD4382NpXZFUe3cCCcVQdA37fu4E3Eku5VgK"
);

// Create the PDA for our enrollment account
// Seeds are "auth", vaultState
const vaultAuthKeys = [Buffer.from("auth"), vaultState.toBuffer()];
const [vaultAuth, _bump] = PublicKey.findProgramAddressSync(
  vaultAuthKeys,
  program.programId
);

// Create the vault key
// Seeds are "vault", vaultAuth
const vaultKeys = [Buffer.from("vault"), vaultAuth.toBuffer()];
const [_vault, _bump2] = PublicKey.findProgramAddressSync(
  vaultKeys,
  program.programId
);

// Mint address
const mint = new PublicKey("F6DVui92yz4F8tTxiMRGtxjh66Ez4R9dEjRnaiyNVkdQ");

// Execute our deposit transaction
(async () => {
  try {
    const metadataProgram = new PublicKey(
      "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
    );
    const metadataAccount = PublicKey.findProgramAddressSync(
      [Buffer.from("metadata"), metadataProgram.toBuffer(), mint.toBuffer()],
      metadataProgram
    )[0];
    const masterEdition = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        metadataProgram.toBuffer(),
        mint.toBuffer(),
        Buffer.from("edition"),
      ],
      metadataProgram
    )[0];

    // b"metadata", MetadataProgramID.key.as_ref(), mint.key.as_ref() "master"
		// Get the token account of the fromWallet address, and if it does not exist, create it
		const ownerAta = await getOrCreateAssociatedTokenAccount(
			connection,
			keypair,
			mint,
			keypair.publicKey
		);

    // // Get the token account of the fromWallet address, and if it does not exist, create it
		const vaultAta = await getOrCreateAssociatedTokenAccount(
			connection,
			keypair,
			mint,
			vaultAuth,
			true,
			commitment
		);

    const signature = await program.methods
			.depositNft()
			.accounts({
				owner: keypair.publicKey,
				vaultState,
				vaultAuth,
				ownerAta: ownerAta.address,
				vaultAta: vaultAta.address,
				tokenMint: mint,
				metadataProgram,
				nftMetadata: metadataAccount,
				nftMasterEdition: masterEdition,
				tokenProgram: TOKEN_PROGRAM_ID,
				associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
				systemProgram: SystemProgram.programId,
			})
			.signers([keypair])
			.rpc();

		console.log(
			`Deposit success! Check out your TX here:\n\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`
		);
    // https://explorer.solana.com/tx/1YJVKq8RK4U1DbgcXpdF4BMkUHdSehevGJu4zzH7FTfvuRyAN8sjU9uut7JzjTuBbS7zmTQt5DfKRpVxHhhEXty?cluster=devnet
  } catch (error) {
    console.error(`Oops, something went wrong: ${error}`);
  }
})();
