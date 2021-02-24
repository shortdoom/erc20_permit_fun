import { ethers } from "hardhat";
import { Contract, ContractFactory } from "ethers";
import { PERMIT_TYPEHASH, getPermitDigest, getDomainSeparator, sign } from './signatures';
import { TestERC20__factory} from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

// This can be deployed on local node fine

async function main(): Promise<void> {
  let permitContract: Contract;
  let owner: SignerWithAddress; // Ethers Signer object wrapped, nice
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  [owner, user1, user2] = await ethers.getSigners();
  console.log(owner.address, user1.address, user2.address);
  const supply = ethers.BigNumber.from('1000000000000000000000000'); // 1000000 Tokens
  const toMint = ethers.BigNumber.from('100000000000000000000'); // 100 Tokens
  
  // One way of doing that without typechain import
  const Permit: ContractFactory = await ethers.getContractFactory("TestERC20");
  permitContract = await Permit.deploy(supply);
  await permitContract.deployed();
  console.log("Permit deployed to: ", permitContract.address);

  // Second way of doing that with typechain import
  const TestERC20Factory = new TestERC20__factory(user1);
  permitContract = await TestERC20Factory.deploy(supply);
  console.log("Permit deployed to: ", permitContract.address);
  console.log("Using address:", user1.address);

  console.log('Minting to user1');
  await mint();
  console.log("Generate user signature");
  await signature();

  async function mint() {
    // Mint some ERC20Permit tokens to user1
    // Log balance (you already have permitContract with balanceOf method)
    permitContract.connect(owner);
    await permitContract.mint(user1.address, toMint);
    console.log('Mint done');
    const userBalance = await permitContract.balanceOf(user1.address);
    console.log("User1 balance", ethers.utils.formatEther(userBalance));
  }

  async function signature() {
    // Generate signature for users here using helper functions from signatures.ts
    const approve = {
      owner: user1.address,
      spender: user2.address,
      value: 100,
    }

    const name = permitContract.name();
    const nonce = 1;
    const chainId = 1337;
    const deadline = 1000000000;
    const privateKey = user1.privateKey;

    const digest = getPermitDigest(
      name, 
      permitContract.address, 
      chainId, 
      approve, 
      nonce, 
      deadline
      )
    
    const { v, r, s } = sign(digest, ownerPrivateKey)

    const receipt = await permitContract.permit(
      approve.owner, 
      approve.spender, 
      approve.value, 
      deadline, 
      v, 
      r, 
      s
      );
  } 

  async function sendSignature() {
    // Send tokens using permit from user1 to user2
  }

}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
