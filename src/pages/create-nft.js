import { useState } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import { create as ipfsClient } from "ipfs-http-client";
import Modal from "web3modal";
import {
  Card,
  Text,
  Grid,
  Input,
  Button,
  Divider,
  Image,
} from "@geist-ui/react";
import Save from "@geist-ui/icons/save";

import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";
import Marketplace from "../../artifacts/contracts/NFTMarket.sol/NFTMarketplace.json";
import { NFT_ADDRESS, NFT_MARKETPLACE_ADDRESS } from "../config";

const client = ipfsClient("https://ipfs.infura.io:5001/api/v0");

const CreateNFTs = () => {
  const router = useRouter();
  const [fileURL, setFileURL] = useState(null);
  const [formState, setFormState] = useState({
    price: "",
    name: "",
    description: "",
  });

  function handleFieldChange(e) {
    const { name } = event.target;

    setFormState((prev) => ({
      ...prev,
      [name]: e.target.value,
    }));
  }

  async function handleFileChange(e) {
    const [file] = event.target.files;

    try {
      const added = await client.add(file);
      const URL = `https://ipfs.infura.io/ipfs/${added.path}`;

      setFileURL(URL);
    } catch {}
  }

  async function createMarketplaceItem() {
    const { name, price, description } = formState;

    if (!name || !price || !description) return;

    const data = JSON.stringify({
      name,
      description,
      image: fileURL,
    });

    try {
      const added = await client.add(data);
      const URL = `https:/ipfs.infura.io/ipfs/${added.path}`;

      createMarketplaceSale(URL);
    } catch {}
  }

  async function createMarketplaceSale(url) {
    const modal = new Modal();
    const connection = await modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let contract = new ethers.Contract(NFT_ADDRESS, NFT.abi, signer);
    let transaction = await contract.createToken(url);
    let tx = await transaction.wait();
    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber();

    const price = ethers.utils.parseUnits(formState.price, "ether");

    contract = new ethers.Contract(
      NFT_MARKETPLACE_ADDRESS,
      Marketplace.abi,
      signer
    );
    let listingPrice = (await contract.getItemsPrice()).toString();

    transaction = await contract.createMarketplaceItem(
      NFT_ADDRESS,
      tokenId,
      price,
      { value: listingPrice }
    );
    await transaction.wait();
    router.push("/");
  }

  return (
    <Card width="100%">
      <Grid
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px dashed #eaeaea",
        }}
      >
        {fileURL ? (
          <Image src={fileURL} alt={formState.description} />
        ) : (
          <Text>No file selected</Text>
        )}
      </Grid>
      <Divider my={4} />
      <Grid.Container wrap="wrap" gap={2}>
        <Grid xs={24}>
          <Input
            scale={1.5}
            name="file"
            id="file"
            htmlType="file"
            multiple={false}
            onChange={handleFileChange}
          />
        </Grid>
        <Grid xs={12}>
          <Input
            scale={1.5}
            name="name"
            placeholder="NFT name"
            id="name"
            onChange={handleFieldChange}
            w="100%"
          />
        </Grid>
        <Grid xs={12}>
          <Input
            scale={1.5}
            name="price"
            placeholder="Price in ether"
            id="price"
            onChange={handleFieldChange}
            w="100%"
          />
        </Grid>
        <Grid xs={24}>
          <Input
            scale={1.5}
            name="description"
            placeholder="NFT Description"
            id="description"
            onChange={handleFieldChange}
            w="100%"
          />
        </Grid>
        <Grid xs={6}>
          <Button scale={1.5} onClick={createMarketplaceItem} icon={<Save />}>
            Create
          </Button>
        </Grid>
      </Grid.Container>
    </Card>
  );
};

export default CreateNFTs;
