const { expect } = require("chai");
const hre = require("hardhat");
const ethers = hre.ethers;

describe("USDTgTokenTRC20", function () {
  let Token, token, owner, user1, user2, feeWallet, usdt, usdc, router, priceFeed, multisig, timelock;

  beforeEach(async function () {
    [owner, user1, user2, feeWallet, usdt, usdc, router, priceFeed, multisig, timelock] = await ethers.getSigners();
    Token = await ethers.getContractFactory("contracts/USDTgTokenTRC20.sol:USDTgTokenTRC20");
    token = await Token.deploy(
      "TetherGround USD",
      "USDTg",
      feeWallet.address,
      usdt.address,
      usdc.address,
      router.address,
      priceFeed.address,
      multisig.address
    );
    // ADMIN_ROLE'un owner'da olup olmadığını kontrol et
    const ADMIN_ROLE = await token.ADMIN_ROLE();
    const hasRole = await token.hasRole(ADMIN_ROLE, owner.address);
    expect(hasRole).to.equal(true);
    // Whitelist işlemini owner ile yap
    await token.connect(owner).addToWhitelist(user1.address);
  });

  it("should mint tokens to whitelisted address", async function () {
    await network.provider.send("evm_increaseTime", [3600]); // 1 saat ileri
    await network.provider.send("evm_mine"); // yeni blok üret

    const amount = 1000;

    await token.connect(owner).mint(user1.address, amount);
    const balance = await token.balanceOf(user1.address);
    const expectedBalance = amount * (10 ** 6);
    expect(balance).to.equal(expectedBalance);
  });

  it("should transfer with fee", async function () {
    await token.connect(owner).mint(user1.address, 1000);
    await token.connect(owner).addToWhitelist(user2.address);
    await token.connect(user1).transfer(user2.address, 1000000);
    const fee = 1000000 / 100;
    expect(await token.balanceOf(user2.address)).to.equal(1000000 - fee);
    expect(await token.balanceOf(await token.feeWallet())).to.equal(fee);
  });

  it("should pause and unpause transfers", async function () {
    await token.connect(owner).pause();
    await expect(token.connect(owner).mint(user1.address, 1000)).to.be.reverted;
    await token.connect(owner).unpause();
    await token.connect(owner).mint(user1.address, 1000);
    expect(await token.pause({ from: owner.address }));
  });

  it("should not mint above max supply", async function () {
    await token.connect(owner).setMaxSupply(1000000);
    await expect(token.connect(owner).mint(user1.address, 1000001)).to.be.reverted;
  });

  // Basit fuzzing örneği
  it("should not mint negative or zero", async function () {
    await expect(token.connect(owner).mint(user1.address, 0)).to.be.reverted;
  });
  // Fuzz Testing: Random Minting (Stress Test)
  it("fuzz: should not mint random large amounts above maxSupply", async function () {
    for (let i = 0; i < 10; i++) {
      const randomAmount = Math.floor(Math.random() * 1_000_000); // up to 1M random
      await network.provider.send("evm_increaseTime", [3600]);
      await network.provider.send("evm_mine");

      const totalSupply = await token.totalSupply();
      const maxSupply = await token.maxSupply();
      const scaledAmount = BigInt(randomAmount) * BigInt(10 ** 6);

      if (totalSupply + scaledAmount <= maxSupply) {
        await token.connect(owner).mint(user1.address, randomAmount);
        const balance = await token.balanceOf(user1.address);
        expect(balance).to.be.gte(0);
      } else {
        await expect(token.connect(owner).mint(user1.address, randomAmount)).to.be.reverted;
      }
    }
  });

  // Property Test: totalSupply must always be <= maxSupply
  it("property: total supply should never exceed max supply", async function () {
    await network.provider.send("evm_increaseTime", [3600]);
    await network.provider.send("evm_mine");

    const amount = 1000;
    await token.connect(owner).mint(user1.address, amount);

    const totalSupply = await token.totalSupply();
    const maxSupply = await token.maxSupply();

    expect(totalSupply).to.be.lte(maxSupply);
  });

  // Property Test: Blacklisted address cannot transfer
  it("property: blacklisted address cannot transfer", async function () {
    await token.connect(owner).addToBlacklist(user1.address);
    await expect(token.connect(user1).transfer(user2.address, 1000)).to.be.reverted;
  });

  // Property Test: Whitelist requirement for mint
  it("property: should not mint to non-whitelisted address", async function () {
    await network.provider.send("evm_increaseTime", [3600]);
    await network.provider.send("evm_mine");

    await expect(token.connect(owner).mint(user2.address, 1000)).to.be.reverted;
  });
});
