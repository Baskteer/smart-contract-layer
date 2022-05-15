// require('dotenv').config();

// const resolve = require('path');
const fs = require('fs');
const envfile = require('envfile');

const writeEnvToFile = (envVariables) => {
  const path = '.env';
  const data = fs.readFileSync(path);
  const parsedFile = envfile.parse(data);
  envVariables.forEach((envVar) => {
    if (envVar.key && envVar.value) {
      parsedFile[envVar.key] = envVar.value;
    }
  });
  fs.writeFileSync(path, envfile.stringify(parsedFile));

  console.log('Updated .env: ', parsedFile);
};

async function main() {
  try {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const TokenBasket = await ethers.getContractFactory("TokenBasket");

    console.log('Deploying ...');

    // ROPSTEN addresses
    // BAT 0x50390975d942e83d661d4bde43bf73b0ef27b426
    // DAI 0xaD6D458402F60fD3Bd25163575031ACDce07538D
    // UNI 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984
    // WETH 0xc778417E063141139Fce010982780140Aa0cD5Ab

    // RINKEBY addresses
    // DAI 0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735
    // UNI 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984
    // WETH 0xc778417E063141139Fce010982780140Aa0cD5Ab

    // MUMBAI addresses
    // WMATIC 0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889
    // WETH 0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa
    const tokenBasket = await TokenBasket.deploy(
      "0xE592427A0AEce92De3Edee1F18E0157C05861564", // ROUTER
      "0x50390975d942e83d661d4bde43bf73b0ef27b426", // BAT
      "0xaD6D458402F60fD3Bd25163575031ACDce07538D", // DAI
      "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", // UNI
      "0xc778417E063141139Fce010982780140Aa0cD5Ab"  // WETH
    );

    console.log('Awaiting deployed event');
    await tokenBasket.deployed();
    console.log("Token Basket address:", tokenBasket.address);
    writeEnvToFile([{
      key: 'DEPLOYED_CONTRACT_ADDRESS',
      value: tokenBasket.address
    }])
  } catch(e) {
    console.error('error => ', e);
  }
}
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });