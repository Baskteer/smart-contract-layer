import { expect } from "chai";
import { ethers } from "hardhat";

describe("TokenBasket", function () {
  let account: string;

  before(async () => {
    account = (await ethers.provider.listAccounts())[0] as string;
  });

  it("should deploy the contract", async function () {
    const SampleToken = await ethers.getContractFactory("SampleToken");
    const token1 = await SampleToken.deploy();
    const token2 = await SampleToken.deploy();

    const tokens = [token1.address, token2.address];

    const TokenBasket = await ethers.getContractFactory("TokenBasket");
    const tokenBasket = await TokenBasket.deploy(tokens);

    expect(await tokenBasket.getTokens()).to.eql(tokens);
  });

  it("should sell", async function () {
    const TokenBasket = await ethers.getContractFactory("TokenBasket");
    const basket = await TokenBasket.deploy([]);

    await basket.buy(10);

    expect(await basket.getBalance(account)).to.equal(10);

    expect((await basket.sell(5)).value).to.equal(5);
  });
});
