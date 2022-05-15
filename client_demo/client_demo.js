const fs = require('fs');
const ethers = require('ethers');
require('dotenv').config();

// const provider = new ethers.providers.JsonRpcProvider(process.env.ETH_NODE_URI_POLYGON_TEST)
const provider = new ethers.providers.JsonRpcProvider(process.env.ETH_NODE_URI_ROPSTEN)
const contractAddress  = process.env.DEPLOYED_CONTRACT_ADDRESS;
const abi = JSON.parse(fs.readFileSync("./artifacts/contracts/TokenBasket.sol/TokenBasket.json").toString()).abi;
const privateKey = process.env.PRIVATE_KEY;

const wallet = new ethers.Wallet(privateKey, provider);

const WETH = "0xc778417E063141139Fce010982780140Aa0cD5Ab";

const erc20abi = [
  // "function balanceOf(address owner) view returns (uint256)",
  "function approve(address _spender, uint256 _value) public returns (bool success)",
  // "function allowance(address _owner, address _spender) public view returns (uint256 remaining)"
];

const buy = async () => {
  try {
    const TOTAL_AMOUNT = 2000;
    console.log('buy ', TOTAL_AMOUNT);
    const FROM = WETH;

    // must approve first
    const tokenFromContract = new ethers.Contract(FROM, erc20abi, wallet);
    const approveResult = await tokenFromContract.approve(contractAddress, parseInt(TOTAL_AMOUNT*1.02));
    let res = await approveResult.wait();
    console.log('approval result: ', res)
  
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    const swapResult = await contract.buy(TOTAL_AMOUNT);
    res = await swapResult.wait();

    console.log('swap buy result => ', res);


    const supply = await contract.totalSupply();
    // res = await supply.wait();

    console.log('total supply => ', supply);

  } catch (e) {
    console.error('something went wrong', e);
  }
}

const sell = async () => {
  try {
    const TOTAL_AMOUNT = 2000;
    console.log('sell ', TOTAL_AMOUNT);

    // const TOS = [BAT, DAI, UNI];
    
    // TOS.forEach(TO => {
    //   const tokenFromContract = new ethers.Contract(TO, erc20abi, wallet);
    //   const approveResult = await tokenFromContract.approve(contractAddress, parseInt(TOTAL_AMOUNT*1.02));
    //   let res = await approveResult.wait();
    //   console.log(`approval result: ${to}:  ${res}`)
    // })

    const contract = new ethers.Contract(contractAddress, abi, wallet);

    const swapResult = await contract.sell(TOTAL_AMOUNT);
    res = await swapResult.wait();

    console.log('swap sell result => ', res);


    const supply = await contract.totalSupply();
    // res = await supply.wait();

    console.log('total supply => ', supply);

  } catch (e) {
    console.error('something went wrong', e);
  }
}

(async function() {
  // TOGGLE buy / sell 

  // await buy();
  await sell();

  console.log('done');
})();

