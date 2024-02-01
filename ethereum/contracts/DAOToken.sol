// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Article.sol";

contract DAOTokenv2 is ERC20{
  constructor() ERC20("Power", "POR") {
    }
    function mintTokens(address user, uint256 numTokens) public{
      _mint(user, numTokens);
    }
}
      