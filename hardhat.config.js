require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

// Go to https://www.alchemyapi.io, sign up, create
// a new App in its dashboard, and replace "KEY" with its key
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Replace this private key with your Ropsten account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Be aware of NEVER putting real Ether into testing accounts
const NODE_RINKEBY = process.env.ETH_NODE_URI_RINKEBY
const NODE_ROPSTEN = process.env.ETH_NODE_URI_ROPSTEN

module.exports = {
  solidity: {
    version: "0.8.0",
  },
  networks: {
    ropsten: {
      url: NODE_ROPSTEN,
      accounts: [PRIVATE_KEY]
    },
    rinkeby: {
      url: NODE_RINKEBY,
      accounts: [PRIVATE_KEY]
    },
    hardhat: {
      forking: {
        url: NODE_RINKEBY,
      }
    }
  },
  namedAccounts: {
    deployer: 0,
    tokenOwner: 1,
  },
};