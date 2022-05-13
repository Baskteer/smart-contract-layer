//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';

contract TokenBasket is Ownable {

    ISwapRouter public immutable swapRouter;

    constructor(ISwapRouter _swapRouter) {
        swapRouter = _swapRouter;
    }

    function swapExactInputSingle(uint24 poolFee, address tokenIn, address[] calldata tokensOut, uint256[] calldata amountsIn, uint256 totalAmount) external {

        // Transfer the specified amount of tokenIn to this contract.
        TransferHelper.safeTransferFrom(tokenIn, msg.sender, address(this), totalAmount);

        // Approve the router to spend tokenIn.
        TransferHelper.safeApprove(tokenIn, address(swapRouter), totalAmount);

        for (uint i = 0; i < tokensOut.length; i++) {
            ISwapRouter.ExactInputSingleParams memory params =
                ISwapRouter.ExactInputSingleParams({
                    tokenIn: tokenIn,
                    tokenOut: tokensOut[i],
                    fee: poolFee,
                    recipient: msg.sender,
                    deadline: block.timestamp + 15,
                    amountIn: amountsIn[i],
                    amountOutMinimum: 1,
                    sqrtPriceLimitX96: 0
                });

            // The call to `exactInputSingle` executes the swap.
            swapRouter.exactInputSingle(params);
        }
    }
}
