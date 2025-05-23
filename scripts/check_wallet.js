const {TronWeb} = require("tronweb");
require("dotenv").config();

const tronWeb = new TronWeb({
    fullHost: "https://api.shasta.trongrid.io",
    privateKey: process.env.PRIVATE_KEY
});

async function getAddress() {
    const address = tronWeb.address.fromPrivateKey(process.env.PRIVATE_KEY);
    console.log("🚀 Cüzdan Adresiniz:", address);
}

getAddress();