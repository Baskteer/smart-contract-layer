//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenBasket is Ownable {
    /** represents tokens in the basket */
    address[] private tokens;
    /** represents the balances, per account */
    mapping(address => uint256) private _balances;

    /** instantiates a new basket using a list of tokens */
    constructor(address[] memory _tokens) {
        tokens = _tokens;
    }

    /** buys a share */
    function buy(uint256 share) public {
        require(_balances[msg.sender] <= share, "share must be > 0");
        _balances[msg.sender] += share;
    }

    /** seels a share */
    function sell(uint256 share) public returns (uint256) {
        require(_balances[msg.sender] != 0, "no balance");
        require(_balances[msg.sender] >= share, "too much");
        _balances[msg.sender] -= share;
        return _balances[msg.sender];
    }

    /** returns the balance of an address */
    function getBalance(address account) public view returns (uint256) {
        return _balances[account];
    }

    /** returns tokens in the basket */
    function getTokens() public view returns (address[] memory) {
        return tokens;
    }
}
