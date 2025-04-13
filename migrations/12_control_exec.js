const USDTgToken = artifacts.require("USDTgToken");

module.exports = async function (deployer, network, accounts) {
  try {
    const instance = await USDTgToken.at(process.env.CONTRACT_USDTg);
    const name = await instance.name;
    const symbol = await instance.symbol();
    const totalSupply = await instance.totalSupply();
    const decimals = await instance.decimals();

    const total = BigInt(totalSupply.toString());
    const decimalsBN = BigInt(10) ** BigInt(decimals);
    const formattedTotal = Number(total / decimalsBN);
    console.log("✅ Token Name:", name);
    console.log("✅ Symbol:", symbol);
    console.log("✅ Total Supply:", formattedTotal.toLocaleString(), symbol);
  } catch (error) {
    console.error("❌ Hata:", error);
  }
};