async function main() {
  try {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const TokenBasket = await ethers.getContractFactory("TokenBasket");

    console.log('Deploying ...');

    // 0xE592427A0AEce92De3Edee1F18E0157C05861564 Uniswap Swap Router valid for all Networks
    const tokenBasket = await TokenBasket.deploy("0xE592427A0AEce92De3Edee1F18E0157C05861564");

    console.log('Awaiting deployed event');
    await tokenBasket.deployed();
    console.log("Token Basket address:", tokenBasket.address);
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