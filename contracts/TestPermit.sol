// SPDX-License-Identifier: MIT
pragma solidity 0.7.5;

import "hardhat/console.sol";
import "./ERC20Permit.sol";

contract TestERC20 is ERC20Permit {
    
    constructor (uint256 supply) ERC20Permit("Test", "TKN") {
        _mint(msg.sender, supply);
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) public {
        _burn(from, amount);
    }
}