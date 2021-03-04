# ERC20Permit with Ethers, TypeScript and Hardhat

This repository uses Solidity Hardhat Template

# Motivation

ERC20Permit is one of interesting ways to implement gasless transactions. This repository is educational. It gathers available resources on ERC20Permit and implements found soultions using Typescript in Hardhat. Version 3.4 of Openzeppelin contracts introduced ERC20Permit in drafts, this repository implements Openzeppelin contracts for showcase.

# Resources

[Alberto Cuesta Canada repository. Original implementation](https://github.com/albertocuestacanada/ERC20Permit)
[How to code gasless tokens on ethereum](https://hackernoon.com/how-to-code-gas-less-tokens-on-ethereum-43u3ew4)
[Banteg repository with very good explanations available](https://github.com/banteg/permit-deposit)
[Dai implementation was first](https://docs.makerdao.com/smart-contract-modules/dai-module/dai-detailed-documentation)
[Good overview of what are meta transactions on stackexchange](https://ethereum.stackexchange.com/a/78653)
[AAVE Token with example permit script in web3.js](https://docs.aave.com/developers/the-core-protocol/aave-token#permit)

# Repository

This contract executes example permit using `deploy.ts` and `deployOz.ts` scripts. Currently there is no tests.

First, visit **Usage** section to install all dependencies and compile contracts. There is some random mnemonic set in `.env.example` to get you started, supply your own Infura key or comment out this section from `hardhat.config.ts`, 

Run with

`npx hardhat run scripts/deploy.ts` for `albertocuestacanada` repository

or 

`npx hardhat run scripts/deployOz.ts` for `openzeppelin` repository


## Usage

### Pre Requisites

Before running any command, make sure to install dependencies:

```sh
$ yarn install
```

### Compile

Compile the smart contracts with Hardhat:

```sh
$ yarn compile
```

### TypeChain

Compile the smart contracts and generate TypeChain artifacts:

```sh
$ yarn typechain
```

### Lint Solidity

Lint the Solidity code:

```sh
$ yarn lint:sol
```

### Lint TypeScript

Lint the TypeScript code:

```sh
$ yarn lint:ts
```

### Test

Run the Mocha tests:

```sh
$ yarn test
```

### Coverage

Generate the code coverage report:

```sh
$ yarn coverage
```

### Clean

Delete the smart contract artifacts, the coverage reports and the Hardhat cache:

```sh
$ yarn clean
```
