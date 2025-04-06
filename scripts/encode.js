const { ethers } = require("ethers");

const encoded = ethers.utils.defaultAbiCoder.encode(
  ["string", "string", "address", "address", "address", "address"],
  [
    "Flash Tether TRC20",
    "USDTz",
    "0x" + "41" + "d6b3b4a1f48939ab7f1fd69a37814fe3a9e9dcf9",  // TDhq... adresi hex'e çevrildi
    "0x41a614f803b6fd780986a42c78ec9c7f77e6ded13c",
    "0x" + "41" + "eb1a2b7e1c1788a0d3bb623bc2958a9972f1de26cc",  // TEkx... hex
    "0x" + "41" + "9584243647267998ccfa478493ed40b0ea15a3f1"     // TPbm... hex
  ]
);

console.log(encoded);