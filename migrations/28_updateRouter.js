// migrations/28_updateRouter.js
const USDTgToken = artifacts.require("USDTgToken");

module.exports = function(deployer) {
    deployer.then(async () => {
        try {
            const TOKEN_ADDRESS = "TEpGiLGNB7W9W26LbvtU9wdukrLgLZwFgr";
            
            // JustMoney V2 Router address
            const ROUTER_ADDRESS = "TKzxdSv2FZKQrEqkKVgp5DcwEXBEKMg2Ax";
            
            console.log('Updating router configuration...');
            const token = await USDTgToken.at(TOKEN_ADDRESS);
            
            // Önce mevcut router'ı kontrol edelim
            const currentRouter = await token.justMoneyRouter();
            console.log('Current router:', currentRouter);
            
            // Yeni router'ı ayarlayalım (eğer kontratınızda böyle bir fonksiyon varsa)
            // await token.setJustMoneyRouter(ROUTER_ADDRESS);
            
            console.log('Router update completed');
            
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    });
};