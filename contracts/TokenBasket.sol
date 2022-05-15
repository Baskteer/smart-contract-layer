//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// import "hardhat/console.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';

contract TokenBasket is ERC20 {

    address public immutable BAT;
    address public immutable DAI;
    address public immutable UNI;
    address public immutable WETH;

    ISwapRouter public immutable swapRouter;

    mapping(address => uint) public balanceBasket;

    constructor(
        ISwapRouter _swapRouter,
        address _BAT,
        address _DAI,
        address _UNI,
        address _WETH
    ) ERC20("Baskteer", "BSKTR") {
        swapRouter = _swapRouter;
        BAT = _BAT;
        DAI = _DAI;
        UNI = _UNI;
        WETH = _WETH;
    }

    function buy(uint256 amount) external {
        require (amount > 0, "Not enough balance");

        address tokenIn = WETH;
        address[3] memory tokensOut = [BAT, DAI, UNI];
        uint256 fee = amount / 100;
        uint256 totalPaid = amount + fee;
        uint256 amountIn = totalPaid / 3;

        require (amountIn > 0, "Not enough balance");

        // Transfer the specified amount of tokenIn to this contract.
        TransferHelper.safeTransferFrom(tokenIn, msg.sender, address(this), totalPaid);

        // Approve the router to spend tokenIn.
        TransferHelper.safeApprove(tokenIn, address(swapRouter), totalPaid);

        for (uint i = 0; i < tokensOut.length; i++) {
            ISwapRouter.ExactInputSingleParams memory params =
                ISwapRouter.ExactInputSingleParams({
                    tokenIn: tokenIn,
                    tokenOut: tokensOut[i],
                    fee: 3000,
                    recipient: address(this),
                    deadline: block.timestamp + 15,
                    amountIn: amountIn,
                    amountOutMinimum: 1,
                    sqrtPriceLimitX96: 0
                });

            // The call to `exactInputSingle` executes the swap.
            balanceBasket[tokensOut[i]] += swapRouter.exactInputSingle(params);
        }

        _mint(msg.sender, amount);
    }

    function sell(uint256 amount) external {
        require (amount > 0, "Nothing to sell");
        require (balanceOf(msg.sender) >= amount, "Not enough balance available");

        uint256 supply = totalSupply();
        address[3] memory tokensIn = [BAT, DAI, UNI];
        address tokenOut = WETH;

        // Transfer the specified amount of tokenIn to this contract.
        // TransferHelper.safeTransferFrom(tokenIn, msg.sender, address(this));

        // Approve the router to spend tokenIn.

        for (uint i = 0; i < tokensIn.length; i++) {
            uint256 balanceTokenIn = balanceBasket[tokensIn[i]];

            uint256 amountIn = amount / supply * balanceTokenIn;
            require (amountIn <= balanceTokenIn, "Error calculating amount in");

            TransferHelper.safeApprove(tokensIn[i], address(swapRouter), amountIn);

            ISwapRouter.ExactInputSingleParams memory params =
                ISwapRouter.ExactInputSingleParams({
                    tokenIn: tokensIn[i],
                    tokenOut: tokenOut,
                    fee: 3000,
                    recipient: msg.sender,
                    deadline: block.timestamp + 15,
                    amountIn: amountIn,
                    amountOutMinimum: 1,
                    sqrtPriceLimitX96: 0
                });

            // The call to `exactInputSingle` executes the swap.
            swapRouter.exactInputSingle(params);

            balanceBasket[tokensIn[i]] -= amountIn;
        }

        _burn(msg.sender, amount);
    }

}
