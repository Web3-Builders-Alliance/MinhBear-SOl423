import wallet from '../wba-wallet.json'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { createGenericFile, createSignerFromKeypair, signerIdentity } from '@metaplex-foundation/umi'
import { createBundlrUploader } from '@metaplex-foundation/umi-uploader-bundlr'

// create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');
const bundlrUploader = createBundlrUploader(umi);

const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair)

umi.use(signerIdentity(signer));

(async () => {
  try {
    // Follow this JSON structure
		// https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure
    const image = 'https://arweave.net/ivqXeCOzbRubs4PRpTyIwWDioDgRpa6Lb3A6RlhAsko'
    const metadata = {
      name: "Generug #3",
      symbol: "RUG",
      description: "Minhbear's NFT",
      image,
      attributes: [
        {
          trait_type: "Background",
          value: "Pink",
        },
        {
          trait_type: "Rarity",
          value: "Low",
        },
      ],
      properties: {
        files: [
          {
            type: "image/png",
            uri: image
          }
        ]
      }
    }

    const myUri = await bundlrUploader.uploadJson(metadata);
    // My image URI:  https://arweave.net/NHR2bxiahR6-Djkp-TJQEm4DTr5x2lG64YLN7oaG-pk
    console.log("My image URI: ", myUri)
  } catch (error) {
    console.log('Oops.. Something went wrong', error);
  }
})()