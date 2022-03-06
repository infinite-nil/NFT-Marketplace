import { useState } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import Modal from "web3modal";

import { CreateNFTForm } from "@/components";

import { ipfsClient } from "@/services/ipfs";

import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";
import Marketplace from "../../artifacts/contracts/NFTMarket.sol/NFTMarketplace.json";
import { NFT_ADDRESS, NFT_MARKETPLACE_ADDRESS } from "../config";

const CreateNFTs = () => {
  const router = useRouter();
  const [fileURL, setFileURL] = useState(null);
  const [formState, setFormState] = useState({
    price: "",
    name: "",
    description: "",
  });

  function handleFieldChange(event) {
    const { name } = event.target;

    setFormState((prev) => ({
      ...prev,
      [name]: event.target.value,
    }));
  }

  async function handleFileChange(event) {
    const [file] = event.target.files;

    try {
      const added = await ipfsClient.add(file);
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
      const added = await ipfsClient.add(data);
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
    <CreateNFTForm
      fileURL={fileURL}
      onFieldChange={handleFieldChange}
      onFileChange={handleFileChange}
      onClick={createMarketplaceItem}
    />
  );
};

export default CreateNFTs;
