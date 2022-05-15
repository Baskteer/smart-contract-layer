## prerequisite

### Alchemy 

1- sign up on Alchemy https://dashboard.alchemyapi.io/
2- Create key for Ropsten
3- Save it in `ETH_NODE_URI_ROPSTEN`

### Private Key

1- Extract private key from Metamask or Wallet Connect and save it in `PRIVATE_KEY`


### Deployed Contract

1- Current deployed contract is valid for Ropsten with address `0x7144476083c8dAf668e4163f063cCa86a87E387B`

### Features

`buy(XXX)` buy 33% of `BAT`, 33% of `UNI` and 33% of `DAI` from `WETH`. The assets are assigned to the smart contract while the smart contract gives as much of our `BSKTR` token to the user. `BSKTR` is minted in this operation. The smart contract keeps a 1% fee

Tx example of a buy: https://ropsten.etherscan.io/tx/0xff1d49c0fb66f18b0a32577344e6d8f272b0fc1adee552950da5d2ba9d90057e

`sell(XXX)` sell reserves of `BAT`, `UNI` and `DAI` if the user has enough `BSKTR`. The smart contract sells these 3 tokens for `WETH` which are then transfered to the user. `BSKTR` is burnt in this operation and removed from the User's wallet. Selling doesn't generate an additional fee (while buying does).

Tx example of a sell: https://ropsten.etherscan.io/tx/0xb222c06215aa1514100283e0c1bc94248b21ed760d36d95fc979c69a6d1b52b5

`balanceOf`, `totalSupply` are implicitly implemented as the smart contract inherits ERC20 functionality.

`BSKTR` token is here https://ropsten.etherscan.io/token/0x3c8c241ec8e4b0c0f35a60372ee2743480bf2177 showing the buy / sell transactions


// TODO: missing Uniswap pools for BAT, DAI, etc. on polygon mumbai (testnet)


