import { ethers } from "hardhat";
import { BigNumberish, Contract, ContractFactory } from "ethers";
import { PERMIT_TYPEHASH, getPermitDigest, getDomainSeparator, sign } from './signatures';
import { OpenzeppelinPermit__factory} from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

async function main(): Promise<void> {
  let permitContract: Contract;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  [owner, user1, user2] = await ethers.getSigners();
  console.log("Using addresses", owner.address, user1.address, user2.address);
  const supply = ethers.BigNumber.from('1000000000000000000000000'); // 1000000 Tokens
  const toMint = ethers.BigNumber.from('1000000000000000000000'); // 1000 Tokens
  
  const Permit: ContractFactory = await ethers.getContractFactory("OpenzeppelinPermit");
  permitContract = await Permit.deploy(supply);
  await permitContract.deployed();
  console.log("PermitContract deployed to:", permitContract.address);

  console.log('Minting some coins');
  await mint();

  console.log("Generate user signature");
  await signature();

  console.log('Sending using permit');
  await sendWithPermit();

  async function mint() {

    await permitContract.mint(user1.address, toMint);
    await permitContract.mint(user2.address, toMint);
    console.log('Mint done');

    const userBalance1 = await permitContract.balanceOf(user1.address);
    console.log("User1 balance", ethers.utils.formatEther(userBalance1));
    const userBalance2 = await permitContract.balanceOf(user2.address);
    console.log("User2 balance", ethers.utils.formatEther(userBalance2));
  }

  async function signature() {

    // Generate signature for user1 (privateKey without 0x prefix)

    const permitValue = ethers.BigNumber.from('900000000000000000000'); // 900 Tokens out of 1000 minted

    const approve = {
      owner: user1.address,
      spender: user2.address,
      value: permitValue,
    }

    const name = await permitContract.name();
    const nonce = await user1.getTransactionCount()
    console.log('Nonce', nonce);
    const chainId = 31337;
    const deadline = 100000000000000;
    
    // Using first account from getSigners()
    // Depends on .env mnemonic you set. Remember to remove 0x from private key.
    const ownerPrivateKey = Buffer.from('cd35f7d97cfbe2df7873baa697e9388afaf6d79da259ce6b8caff105753d8a2d', 'hex');

    const digest = getPermitDigest(
      name, 
      permitContract.address, 
      chainId, 
      approve, 
      nonce, 
      deadline
      )
    
    // require that signer is not 0 and signer is owner
    const { v, r, s } = sign(digest, ownerPrivateKey)

    await permitContract.permit(
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
      const allowanceReadable = allowance.toString();
      console.log('Allowance amount:', allowanceReadable);
  } 

  async function sendWithPermit() {

    // Send tokens using permit from user1 to user2

    const permitValue = ethers.BigNumber.from('900000000000000000000');

    const UserPermitContract = permitContract.connect(user2);
    // function transferFrom(address sender, address recipient, uint256 amount)
    // where, user2 pays gas (assumption to test)
    await UserPermitContract.transferFrom(user1.address, user2.address, permitValue, {from: user2.address});

    // No free lunch. This works only with transferFrom between user accounts, not with contract calls
    // Contract calls need relayer implementation (like OpenGSN).
    // await UserPermitContract.transferFrom(user1.address, relayer.address, permitValue, {from: relayer.address});
    console.log('Transfered!');

    const userBalance1 = await permitContract.balanceOf(user1.address);
    console.log("User1 balance", ethers.utils.formatEther(userBalance1));
    const userBalance2 = await permitContract.balanceOf(user2.address);
    console.log("User2 balance", ethers.utils.formatEther(userBalance2));
  }
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
