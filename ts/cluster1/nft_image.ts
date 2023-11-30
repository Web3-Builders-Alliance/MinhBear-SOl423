import wallet from "../wba-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createGenericFile,
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { createBundlrUploader } from "@metaplex-foundation/umi-uploader-bundlr";
import { readFile } from "fs/promises";

// create a devnet connection
const umi = createUmi("https://api.devnet.solana.com");
const bundlrUploader = createBundlrUploader(umi);

const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(signerIdentity(signer));

(async () => {
  try {
    const file = await readFile("generug-3.png");
    const image = createGenericFile(file, "Generug", {
      contentType: "image/png",
    });
    const [myUri] = await bundlrUploader.upload([image]);
    // My image uri:  https://arweave.net/ivqXeCOzbRubs4PRpTyIwWDioDgRpa6Lb3A6RlhAsko
    console.log("My image uri: ", myUri);
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();
