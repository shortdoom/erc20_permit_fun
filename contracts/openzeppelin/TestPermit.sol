// SPDX-License-Identifier: MIT
pragma solidity 0.7.5;

import "hardhat/console.sol";
import "./ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

contract OpenzeppelinPermit is ERC20Permit {
    using SafeERC20 for IERC20;
    
    /**
    Contract TestERC20 inherits from ERC20Permit, which inherits from ERC20.
    TestERC20 has it's own constructor, ERC20Permit has it's own constructor and ERC20 too. 
    All constructors must be used, otherwise some functions will not be implemented and contract marked as abstract.
     */
    constructor (uint256 supply) ERC20Permit("TestOZ") ERC20("TestOZ", "TKNoz") {
        _mint(msg.sender, supply);
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) public {
        _burn(from, amount);
    }

}