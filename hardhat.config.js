require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 50 // Düşük bir değer test için yeterli, prod için 200+ önerilir
      }
    }
  }
};