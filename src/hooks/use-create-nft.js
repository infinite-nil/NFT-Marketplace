import { useState } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import Modal from "web3modal";

import { ipfsClient, IPFS_BASE_URL } from "@/services/ipfs";

import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";
import Marketplace from "../../artifacts/contracts/NFTMarket.sol/NFTMarketplace.json";
import { NFT_ADDRESS, NFT_MARKETPLACE_ADDRESS } from "../config";

const useCreateNFT = () => {
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
      const URL = `${IPFS_BASE_URL}/${added.path}`;

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
      const URL = `${IPFS_BASE_URL}/${added.path}`;

      createMarketplaceSale(URL);
    } catch {}
  }

  async function createMarketplaceSale(url) {
    const modal = new Modal();
    const connection = await modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const nftContract = new ethers.Contract(NFT_ADDRESS, NFT.abi, signer);
    const nftTransaction = await nftContract.createToken(url);

    const transactionResponse = await nftTransaction.wait();
    const event = transactionResponse.events[0];
    const value = event.args[2];
    const tokenId = value.toNumber();

    const price = ethers.utils.parseUnits(formState.price, "ether");

    const marketplaceContract = new ethers.Contract(
      NFT_MARKETPLACE_ADDRESS,
      Marketplace.abi,
      signer
    );
    let listingPrice = (await marketplaceContract.getItemsPrice()).toString();

    const transaction = await marketplaceContract.createMarketplaceItem(
      NFT_ADDRESS,
      tokenId,
      price,
      { value: listingPrice }
    );

    await transaction.wait();

    router.push("/");
  }

  return {
    fileURL,
    handleFieldChange,
    handleFileChange,
    createMarketplaceItem,
  };
};

export { useCreateNFT };
