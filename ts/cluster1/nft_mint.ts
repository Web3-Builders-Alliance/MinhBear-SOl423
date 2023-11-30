import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createSignerFromKeypair,
  signerIdentity,
  generateSigner,
  percentAmount,
} from "@metaplex-foundation/umi";
import {
  createNft,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";

import wallet from "../wba-wallet.json";
import base58 from "bs58";

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata());

const mint = generateSigner(umi);

(async () => {
  const tx = createNft(umi, {
    mint,
    name: "Generug #3",
    uri: "https://arweave.net/NHR2bxiahR6-Djkp-TJQEm4DTr5x2lG64YLN7oaG-pk",
    sellerFeeBasisPoints: percentAmount(69),
    symbol: "RUG",
  });

  const result = await tx.sendAndConfirm(umi);
  const signature = base58.encode(result.signature);

  console.log(`Successfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`)

	console.log('Mint Address: ', mint.publicKey);

  // Successfully Minted! Check out your TX here:
  // https://explorer.solana.com/tx/3Wdf8yajYABCXyLp93RMtzHDkRoANtzadR8aV2aHst7PH4BqSThyFBuesqk5HqNp7Xtnx2Ysn1unNfAYggNVpZA8?cluster=devnet
  // Mint Address:  F6DVui92yz4F8tTxiMRGtxjh66Ez4R9dEjRnaiyNVkdQ
})();
