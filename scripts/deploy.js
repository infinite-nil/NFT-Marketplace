const hre = require("hardhat");

async function main() {
  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  const nftMarket = await NFTMarketplace.deploy();
  await nftMarket.deployed();
  console.log("MARKETPLACE DEPLOY:", nftMarket.address);

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(nftMarket.address);
  await nft.deployed();
  console.log("NFT DEPLOY:", nft.address);
}

main();
