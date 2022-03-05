// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private tokenIDS;
    address contractAddress;

    constructor(address marketplaceAddress)
        ERC721("Marketplace tokens", "MKTP")
    {
        contractAddress = marketplaceAddress;
    }

    function createToken(string memory tokenURI) public returns (uint256) {
        tokenIDS.increment();
        uint256 id = tokenIDS.current();

        _mint(msg.sender, id);
        _setTokenURI(id, tokenURI);
        setApprovalForAll(contractAddress, true);

        return id;
    }
}
