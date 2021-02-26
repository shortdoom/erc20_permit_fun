import { ethers } from "hardhat";
import { Contract, ContractFactory } from "ethers";
import { PERMIT_TYPEHASH, getPermitDigest, getDomainSeparator, sign } from './signatures';
import { TestERC20__factory} from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

async function main(): Promise<void> {
  let permitContract: Contract;
  let name: string;
  let chainId: number;
  let address: string;

  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  [owner, user1, user2] = await ethers.getSigners();
  console.log(owner.address, user1.address, user2.address);
  const supply = ethers.BigNumber.from('1000000000000000000000000'); // 1000000 Tokens
  const toMint = ethers.BigNumber.from('1000000000000000000000'); // 1000 Tokens
  
  // One way of doing that without typechain import
  const Permit: ContractFactory = await ethers.getContractFactory("TestERC20");
  permitContract = await Permit.deploy(supply);
  await permitContract.deployed();
  console.log("Permit deployed to: ", permitContract.address);

  // Second way of doing that with typechain import
  // const TestERC20Factory = new TestERC20__factory(user1);
  // permitContract = await TestERC20Factory.deploy(supply);
  // console.log("Permit deployed to: ", permitContract.address);
  // console.log("Using address:", user1.address);

  console.log('Minting to user1');
  await mint();
  console.log("Generate user signature");
  await signature();
  console.log('Sending using permit');
  await sendWithPermit();

  async function mint() {
    await permitContract.mint(user1.address, toMint);
    await permitContract.mint(user2.address, toMint);
    console.log('Mint done');
    const userBalance = await permitContract.balanceOf(user1.address);
    console.log("User1 balance", ethers.utils.formatEther(userBalance));
  }

  async function signature() {
    const approve = {
      owner: user1.address,
      spender: user2.address,
      value: 1000,
    }

    const name = await permitContract.name();
    const nonce = await user1.getTransactionCount()
    console.log('Nonce', nonce);
    const chainId = 31337;
    const deadline = 100000000000000;
    const ownerPrivateKey = Buffer.from('7eb6d980caf48ba450b2eda81e10511609d80984bd9b734c207a8748699f87be', 'hex');

    const digest = getPermitDigest(
      name, 
      permitContract.address, 
      chainId, 
      approve, 
      nonce, 
      deadline
      )

    await permitContract.PERMIT_TYPEHASH();
    console.log('Permit hash');
    await permitContract.DOMAIN_SEPARATOR();
    console.log('Domain Separator');
    
    // require that signer is not 0 and signer is owner
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
    
      console.log('Succesfull Permit! Checking allowance');
      const allowance = await permitContract.allowance(user1.address, user2.address);
      console.log('Allowance amount:', allowance);
  } 

  async function sendWithPermit() {
    // Send tokens using permit from user1 to user2

    const UserPermitContract = permitContract.connect(user2);
    await UserPermitContract.transferFrom(user1.address, user2.address, 1, {from: user2.address});
    console.log('Transfered!');
    const userBalance1 = await permitContract.balanceOf(user1.address);
    console.log("User1 balance", ethers.utils.formatEther(userBalance1));
    const userBalance2 = await permitContract.balanceOf(user2.address);
    console.log("User1 balance", ethers.utils.formatEther(userBalance2));
  }

}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
