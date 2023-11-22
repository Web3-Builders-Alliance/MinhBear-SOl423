import { Keypair, PublicKey, Connection, Commitment } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import wallet from "../wba-wallet.json";

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const token_decimals = 1_000_000n;

// Mint address
const mint = new PublicKey("62gQP7qp1W9Jve9dyhWHn3V9eR2dsozmWEFZWJnHpuUt");

(async () => {
  try {
    // Create an ATA
    const ata = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      keypair.publicKey,
      true,
      "finalized"
    );
    console.log(`Your ata is: ${ata.address.toBase58()}`);

    // Mint to ATA
    const mintTx = await mintTo(
      connection,
      keypair,
      mint,
      new PublicKey(ata.address),
      keypair.publicKey,
      token_decimals
    );
    console.log(`Your mint txid: ${mintTx}`);

    // Your ata is: DEeF3YKxpoMEgDJUgydfCyU3M3Epcamp4SqJBx2WhZsv
    // Your mint txid: 3Xd1XbRYD2n8C2BXRVHwN7A9fCWVPS1FG5NKSiMjjzCNzT8vVCgkcKhJUtdfW2VhyqM3jM9sEDawCz6FpX84d8yr
  } catch (error) {
    console.log(`Oops, something went wrong: ${error}`);
  }
})();
