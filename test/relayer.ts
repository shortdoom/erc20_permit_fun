import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { Contract } from "ethers";

import chai from "chai";
import { solidity } from "ethereum-waffle";

describe("Relayer", function() {
    it("Should return the new greeting once it's changed", async function() {
      const Greeter = await ethers.getContractFactory("Greeter");
      const greeter = await Greeter.deploy("Hello, world!");
      
      await greeter.deployed();
      expect(await greeter.greet()).to.equal("Hello, world!");
  
      await greeter.setGreeting("Hola, mundo!");
      expect(await greeter.greet()).to.equal("Hola, mundo!");
    });
  });