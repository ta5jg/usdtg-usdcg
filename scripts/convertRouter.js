const {TronWeb} = require("tronweb");

const base58 = "TJCnKsPa7y5okkXvQAidZBzqx3QyQ6sxMW";
const hex = TronWeb.address.toHex(base58);

console.log("Router Base58:", base58);
console.log("Router Hex   :", hex);