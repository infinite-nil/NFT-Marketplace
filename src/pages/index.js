import { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { Grid } from "@geist-ui/react";

import { NFTCard } from "@/components";

import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";
import Marketplace from "../../artifacts/contracts/NFTMarket.sol/NFTMarketplace.json";
import { NFT_ADDRESS, NFT_MARKETPLACE_ADDRESS } from "../config";

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchNFTs() {
      setLoading(true);

      const provider = new ethers.providers.JsonRpcProvider();
      const tokenContract = new ethers.Contract(NFT_ADDRESS, NFT.abi, provider);
      const marketContract = new ethers.Contract(
        NFT_MARKETPLACE_ADDRESS,
        Marketplace.abi,
        provider
      );
      const data = await marketContract.fetchMarketplaceUnsoldItems();
      const items = await Promise.all(
        data.map(async (item) => {
          const tokenURI = await tokenContract.tokenURI(item.tokenID);
          const meta = await axios.get(tokenURI);
          const price = ethers.utils.formatUnits(
            item.price.toString(),
            "ether"
          );

          return {
            price,
            tokenId: item.tokenID.toNumber(),
            seller: item.seller,
            owner: item.owner,
            image: meta.data.image,
            name: meta.data.name,
            description: meta.data.description,
          };
        })
      );

      setNfts(items);
      setLoading(false);
    }

    fetchNFTs();
  }, []);

  return (
    <Grid.Container justify="center" alignItems="center">
      {nfts.map(({ name, image, description, price }, i) => (
        <Grid
          key={i}
          xs={24}
          sm={12}
          md={8}
          margin="auto"
          style={{ maxWidth: "300px" }}
        >
          <NFTCard
            name={name}
            description={description}
            image={image}
            price={price}
          />
        </Grid>
      ))}
    </Grid.Container>
  );
}
