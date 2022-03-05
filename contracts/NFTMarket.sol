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
}
