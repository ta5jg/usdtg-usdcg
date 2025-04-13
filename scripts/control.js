module.exports = async function (callback) {
    const USDTgToken = artifacts.require("USDTgToken");
  
    try {
      const instance = await USDTgToken.deployed();
      const name = await instance.name();
      const symbol = await instance.symbol();
      const totalSupply = await instance.totalSupply();
      const decimals = await instance.decimals();
  
      console.log("✅ Token Name:", name);
      console.log("✅ Symbol:", symbol);
      console.log("✅ Total Supply:", (totalSupply / 10 ** decimals).toLocaleString(), symbol);
      callback();
    } catch (error) {
      console.error("❌ Hata:", error);
      callback(error);
    }
  };