import { Keypair, Connection, Commitment } from "@solana/web3.js";
import { createMint } from "@solana/spl-token";
import wallet from "../wba-wallet.json";
import { airdrop } from "../utils";

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

(async () => {
  try {
    // airdrop
    // airdrop(connection, keypair);

    // Start here
    const mint = await createMint(connection, keypair, keypair.publicKey, null, 6);
    // mint token: 62gQP7qp1W9Jve9dyhWHn3V9eR2dsozmWEFZWJnHpuUt
    console.log('mint token: ', mint.toBase58())

  } catch (error) {
    console.log(`Oops, something went wrong: ${error}`);
  }
})();
