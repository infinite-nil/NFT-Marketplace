// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFTMarketplace is ReentrancyGuard {
    using Counters for Counters.Counter;

    Counters.Counter private itemIDS;
    Counters.Counter private itemsSold;

    address payable owner;
    uint256 listingPrice = 0.025 ether;

    constructor() {
        owner = payable(msg.sender);
    }

    struct MarketplaceItem {
        uint256 itemID;
        uint256 tokenID;
        address NFTContract;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    event MarketplaceItemCreated(
        uint256 itemID,
        uint256 tokenID,
        address NFTContract,
        address payable seller,
        address payable owner,
        uint256 price,
        bool sold
    );

    mapping(uint256 => MarketplaceItem) private IDMarketeplaceItem;

    function getItemsPrice() public view returns (uint256) {
        return listingPrice;
    }

    function createMarketplaceItem(
        address NFTContract,
        uint256 tokenID,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0, "Price should be at least 1");
        require(
            msg.value == listingPrice,
            "Price should be equal to listing price"
        );

        itemIDS.increment();
        uint256 itemID = itemIDS.current();

        IDMarketeplaceItem[itemID] = MarketplaceItem(
            itemID,
            tokenID,
            NFTContract,
            payable(msg.sender),
            payable(address(0)),
            price,
            false
        );

        IERC721(NFTContract).transferFrom(msg.sender, address(this), tokenID);

        emit MarketplaceItemCreated(
            itemID,
            tokenID,
            NFTContract,
            payable(msg.sender),
            payable(address(0)),
            price,
            true
        );
    }

    function createMarketplaceSale(address NFTContract, uint256 itemID)
        public
        payable
        nonReentrant
    {
        uint256 price = IDMarketeplaceItem[itemID].price;
        uint256 tokenID = IDMarketeplaceItem[itemID].tokenID;

        require(msg.value == price, "The value sent should be equal to price");

        IDMarketeplaceItem[itemID].seller.transfer(msg.value);

        IERC721(NFTContract).transferFrom(address(this), msg.sender, tokenID);

        IDMarketeplaceItem[itemID].owner = payable(msg.sender);
        IDMarketeplaceItem[itemID].sold = true;

        itemsSold.increment();
        payable(owner).transfer(listingPrice);
    }

    function fetchMarketplaceUnsoldItems()
        public
        view
        returns (MarketplaceItem[] memory)
    {
        uint itemsCount = itemIDS.current();
        uint unsoldItemsCount = itemIDS.current() - itemsSold.current();
        uint currentIndex = 0;

        MarketplaceItem[] memory items = new MarketplaceItem[](unsoldItemsCount);

        for (uint i = 0; i < itemsCount; i++) {
            if (IDMarketeplaceItem[i + 1].owner == address(0)) {
                uint currentID = IDMarketeplaceItem[i + 1].itemID;
                MarketplaceItem storage currentItem = IDMarketeplaceItem[currentID];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items
    }
}
