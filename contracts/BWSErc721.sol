// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BWSErc721 is
    ERC721,
    ERC721URIStorage,
    ERC721Burnable,
    AccessControl,
    IERC2981
{
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    string private _baseUri;
    // Mapping from token ID to royalty receiver
    mapping(uint256 => address) public _royaltyReceivers;

    // Mapping from token ID to royalty percentage
    mapping(uint256 => uint256) public _royaltyPercentages;

    //Add tokenID
    // using Counters for Counters.Counter;
    // Counters.Counter private _tokenIds;

    uint256 private _tokenIdCounter = 1;

    //event to mint on minting
    event TokenMinted(uint256 tokenId);

    constructor(
        string memory name,
        string memory symbol,
        string memory baseURI,
        address admin,
        address minter
    ) ERC721(name, symbol) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
        if (admin != minter) {
            _grantRole(MINTER_ROLE, minter);
        }
        _baseUri = baseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseUri;
    }

    function safeMint(
        address to,
        string memory uri
    ) public onlyRole(MINTER_ROLE) returns (uint256) {
        //Always mint with the current value of the _tokenIdCounter.
        uint256 tokenId = _tokenIdCounter;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        emit TokenMinted(tokenId); // Emitting the event

        // Increment the counter after each mint
        _tokenIdCounter += 1;
        return tokenId;
    }

    function mintWithTokenURIAndRoyalty(
        address to,
        string memory uri,
        uint256 royaltyPercentage
    ) public onlyRole(MINTER_ROLE) {
        uint256 tokenId = safeMint(to, uri);
        _setRoyalty(tokenId, to, royaltyPercentage);
    }

    function _setRoyalty(
        uint256 tokenId,
        address royaltyReceiver,
        uint256 royaltyPercentage
    ) internal {
        _royaltyPercentages[tokenId] = royaltyPercentage;
        _royaltyReceivers[tokenId] = royaltyReceiver;
    }

    function safeMintBatch(
        address[] memory to,
        string[] memory uri
    ) public onlyRole(MINTER_ROLE) {
        for (uint256 i = 0; i < to.length; i++) {
            uint256 tokenId = _tokenIdCounter;
            _safeMint(to[i], tokenId);
            _setTokenURI(tokenId, uri[i]);
            emit TokenMinted(tokenId); // Emitting the event for each token in the batch

            _tokenIdCounter += 1; // Increment the counter after each mint
        }
    }

    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721, AccessControl, ERC721URIStorage, IERC165)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function royaltyInfo(
        uint256 tokenId,
        uint256 salePrice
    ) external view override returns (address receiver, uint256 royaltyAmount) {
        receiver = _royaltyReceivers[tokenId];
        royaltyAmount = (salePrice * _royaltyPercentages[tokenId]) / 10000; // Assuming the royalty percentage is stored in basis points (1/100 of a percent)
    }
}
