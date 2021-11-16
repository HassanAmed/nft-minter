import { removeMinted, isExists } from "../utils.js";
import fs from "fs";
import path from "path";
import pinataSDK from "@pinata/sdk";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pinata = pinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_API_SECRET
);

async function uploadPNG(id) {
  const readableStreamForFile = fs.createReadStream(
    path.resolve(__dirname, `../private/images/${id}.png`)
  );
  let result = await pinata
    .pinFileToIPFS(readableStreamForFile)
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
  return result;
}

export async function uploadJSON(req, res) {
  console.log("Received", req.body);
  try {
    if (!req.body || !req.body.id || !req.body.name || !req.body.description) {
      res.status(400).send({
        success: false,
        error: "Incomplete request body passed",
      });
      return;
    }
    const id = req.body.id;
    const name = req.body.name;
    const desc = req.body.description;
    if (!isExists(id)) {
      res.status(400).send({
        success: false,
        error: "Image for this id already minted or does not exists",
      });
      return;
    }
    let imgData = await uploadPNG(id);
    if (!imgData || !imgData.IpfsHash || imgData.IpfsHash == "") {
      res.status(500).send({
        success: false,
        error: "IPFS image uploading unsuccessful",
      });
      return;
    }
    const file = fs.readFileSync(
      path.resolve(__dirname, `../private/json/${id}.json`)
    );
    const content = JSON.parse(file);
    content.image = `https://gateway.pinata.cloud/ipfs/${imgData.IpfsHash}`;
    content.name = name;
    content.description = desc;
    const options = {
      pinataMetadata: {
        name: `${id}.json`,
      },
    };
    const body = content; // json body
    const response = await pinata
      .pinJSONToIPFS(body, options)
      .then((result) => {
        console.log(result);
        return result;
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
    if (!response || !response.IpfsHash) {
      res.status(500).send({
        success: false,
        error: "IPFS JSON uploading unsuccessful",
      });
      return;
    }
    fs.writeFileSync(
      path.resolve(__dirname, `../private/mintedJSON/${id}.json`),
      JSON.stringify(content, null, 2)
    );
    removeMinted(id);
    res.status(200).send({
      success: true,
      pinataUrl: "https://gateway.pinata.cloud/ipfs/" + response.IpfsHash,
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error: "Unknown error while uploading image to IPFS",
    });
  }
}
