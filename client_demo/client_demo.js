const fs = require('fs');
const ethers = require('ethers');
require('dotenv').config();

const provider = new ethers.providers.JsonRpcProvider(process.env.ETH_NODE_URI_RINKEBY)
const contractAddress  = process.env.DEPLOYED_CONTRACT_ADDRESS;
const abi = JSON.parse(fs.readFileSync("./artifacts/contracts/TokenBasket.sol/TokenBasket.json").toString()).abi;
const privateKey = process.env.PRIVATE_KEY;

const wallet = new ethers.Wallet(privateKey, provider);

// smart contract addresses
const DAI = "0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735";
const UNI = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";
const WETH = "0xc778417E063141139Fce010982780140Aa0cD5Ab";

const erc20abi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function approve(address _spender, uint256 _value) public returns (bool success)",
  "function allowance(address _owner, address _spender) public view returns (uint256 remaining)"
];

// const limit = eth.getBlock("latest");

//console.log('limit ', limit)

const exec = async () => {
  console.log('start');
  const FROM = WETH;
  const TOS = [UNI,DAI];
  const AMOUNTS = [55500,44200];
  const POOL_FEE = 3000;

  try {
    // must approve first
    const TOTAL_AMOUNT = AMOUNTS.reduce((partialSum, a) => partialSum + a, 0);//* (1 + POOL_FEE/100000);
    console.log('amount to convert: ', TOTAL_AMOUNT);

    const tokenFromContract = new ethers.Contract(FROM, erc20abi, wallet);
    const approveResult = await tokenFromContract.approve(contractAddress, TOTAL_AMOUNT*2);
    let res = await approveResult.wait();
    console.log('approval result: ', res)
  
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    const swapResult = await contract.swapExactInputSingle(POOL_FEE, FROM, TOS, AMOUNTS, TOTAL_AMOUNT);
    res = await swapResult.wait();

    console.log('swap result => ', res);

  } catch (e) {
    console.error('something went wrong', e);
  }
}

exec().then(function() {
  console.log('done');
})
