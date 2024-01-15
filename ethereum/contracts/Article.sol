// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract Article is ERC721URIStorage {
    uint256 private _nextTokenId;
    mapping(uint256 => Comment) public commentsAddress;

    constructor() ERC721("Article", "ART") {}

    function mintArticle(address writer, string memory tokenURI)
        public
        returns (uint256)
    {
        uint256 tokenId = _nextTokenId++;
        _mint(writer, tokenId);
        _setTokenURI(tokenId, tokenURI);
        Comment newComment = new Comment(tokenId);
        commentsAddress[tokenId] = newComment;
        return tokenId;
    }
    function totalSupply() public view returns (uint256) {
      return _nextTokenId;
    }
    function getCommentsAddress(uint256 _tokenId) public view returns (Comment){
        return commentsAddress[_tokenId];
    }
}

contract Comment is ERC721URIStorage {
    uint256 private _nextTokenId;
    uint256 public articleId;

    constructor(uint256 _articleId) ERC721("Comment", "CMT") {
        articleId = _articleId;
    }

    function mintComment(address writer, string memory tokenURI)
        public
        returns (uint256)
    {
        uint256 tokenId = _nextTokenId++;
        _mint(writer, tokenId);
        _setTokenURI(tokenId, tokenURI);

        return tokenId;
    }
    function totalSupply() public view returns (uint256) {
      return _nextTokenId;
    }
}