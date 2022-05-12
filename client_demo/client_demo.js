const fs = require('fs');
const ethers = require('ethers');
require('dotenv').config();

const provider = ethers.providers.getDefaultProvider('ropsten');
const contractAddress  = process.env.DEPLOYED_CONTRACT_ADDRESS;
const abi = JSON.parse(fs.readFileSync("./artifacts/contracts/TokenBasket.sol/TokenBasket.json").toString()).abi;
const privateKey = process.env.PRIVATE_KEY;

const wallet = new ethers.Wallet(privateKey, provider);

// smart contract addresses
const DAI = "0xad6d458402f60fd3bd25163575031acdce07538d";
const WETH = "0xc778417E063141139Fce010982780140Aa0cD5Ab";

const erc20abi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function approve(address _spender, uint256 _value) public returns (bool success)",
  "function allowance(address _owner, address _spender) public view returns (uint256 remaining)"
];

const exec = async () => {
  console.log('start');
  const AMOUNT = 5550000;
  const FROM = DAI;
  const TO = WETH;

  // must approve first
  try {
    const tokenFromContract = new ethers.Contract(FROM, erc20abi, wallet);;
    const approveResult = await tokenFromContract.approve(contractAddress, AMOUNT);
    console.log('approval result: ', approveResult)
  
    const contract = new ethers.Contract(contractAddress, abi, wallet);
    const swapResult = await contract.swapExactInputSingle(3000, AMOUNT, FROM, TO);
    console.log('swap result => ', swapResult);

  } catch (e) {
    console.error('something went wrong', e);
  }
  
}

exec().then(function() {
  console.log('done');
})
