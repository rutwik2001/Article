// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./DAOToken.sol";


contract Article is ERC721URIStorage {
    uint256 private _nextTokenId;
    DAOTokenv2 public DAOTokenIntance;
    mapping(uint256 => Comment) public commentsAddress;  // tokenID => contract address
    mapping(uint256 => uint256) public votingCount;      // tokenId => numberOfPeople
    mapping(address => bool) public isVoter;            // voter => true
    uint256 public noOfVoters;                          // total number Of Voters
    mapping(uint256 => bool) public isApproved;         // tokenId => approved
    mapping(uint256 => mapping(address => bool)) public isVoted;//tokenId => voter => true/false
    mapping(uint256 => mapping(address => bool)) public yourVote;//tokenId => coter => truefalse
    event ArticleMinted(uint256 tokenId, address writer, string tokenURI);
    event VoteCasted(uint256 articleId, address voter);

    constructor(address contractAddress) ERC721("Article", "ART") {
        DAOTokenIntance = DAOTokenv2(contractAddress);
    }

    function createVoter() public {
        DAOTokenIntance.mintTokens(msg.sender, 10);
        isVoter[msg.sender] = true;
        noOfVoters++;
    }

    function mintArticle(string memory tokenURI) public  returns (uint256) {
        require(DAOTokenIntance.transferFrom(msg.sender, address(this), 2), "Transfer Failed");
        uint256 tokenId = _nextTokenId++;
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        Comment newComment = new Comment(tokenId);
        commentsAddress[tokenId] = newComment;

        emit ArticleMinted(tokenId, msg.sender, tokenURI);
        return tokenId;
    }

    function vote(uint256 _articleId, bool _yourVote, string memory commentURI) public  {
        require(isVoter[msg.sender], "You are not eligible to vote");
        require(!isVoted[_articleId][msg.sender], "You have already voted");
        require(DAOTokenIntance.transferFrom(msg.sender, address(this), 1), "Transfer Failed");
        if(_yourVote){
            votingCount[_articleId]++;
        } 
        yourVote[_articleId][msg.sender] = _yourVote;
        isVoted[_articleId][msg.sender] = true;
        if(bytes(commentURI).length != 0){
        Comment cmtAddress = commentsAddress[_articleId];
        Comment CommentInstance = Comment(cmtAddress);
        CommentInstance.mintComment(msg.sender, commentURI);
      }
        emit VoteCasted(_articleId, msg.sender);

        if ((votingCount[_articleId] * 100 / noOfVoters) >= 44) {
            isApproved[_articleId] = true;
        }
    }

    function totalSupply() public view returns (uint256) {
        return _nextTokenId;
    }

    function getYourVote(uint256 _articleId, address _voter) public view returns(bool){
        return yourVote[_articleId][_voter];
    }

    function getCommentsAddress(uint256 _tokenId) public view returns (Comment) {
        return commentsAddress[_tokenId];
    }
}

contract Comment is ERC721URIStorage {
    
    uint256 private _nextTokenId;
    uint256 public articleId;

    constructor(uint256 _articleId) ERC721("Comment", "CMT") {
        articleId = _articleId;
    }
    

    function mintComment(address writer, string memory tokenURI) public returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _mint(writer, tokenId);
        _setTokenURI(tokenId, tokenURI);

        return tokenId;
    }

    function totalSupply() public view returns (uint256) {
        return _nextTokenId;
    }
}
