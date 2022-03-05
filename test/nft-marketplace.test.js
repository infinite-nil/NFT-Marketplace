describe("NFTMarketplace", function () {
  it("should create and sale item", async function () {
    const Marketplace = await ethers.getContractFactory("NFTMarketplace");
    const marketplace = await Marketplace.deploy();
    await marketplace.deployed();

    const address = marketplace.address;
    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(address);
    await nft.deployed();

    const nftContractAddress = nft.address;
    const listingPrice = (await marketplace.getItemsPrice()).toString();
    const auctionPrice = ethers.utils.parseUnits("100", "ether");

    await nft.createToken("https://mytokenone.com");
    await nft.createToken("https://mytokentwo.com");
    await marketplace.createMarketplaceItem(
      nftContractAddress,
      1,
      auctionPrice,
      {
        value: listingPrice,
      }
    );
    await marketplace.createMarketplaceItem(
      nftContractAddress,
      2,
      auctionPrice,
      {
        value: listingPrice,
      }
    );

    const [_, buyerAddress] = await ethers.getSigners();

    await marketplace
      .connect(buyerAddress)
      .createMarketplaceSale(nftContractAddress, 1, { value: auctionPrice });

    let items = await marketplace.fetchMarketplaceUnsoldItems();
    items = await Promise.all(
      items.map(async (item) => {
        const tokenURI = await nft.tokenURI(item.tokenID);

        return {
          price: item.price.toString(),
          tokenId: item.tokenID.toString(),
          seller: item.seller,
          owner: item.owner,
          tokenUri: tokenURI,
        };
      })
    );

    console.log("ITEMS", items);
  });
});
