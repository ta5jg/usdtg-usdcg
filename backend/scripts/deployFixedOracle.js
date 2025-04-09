import TronWeb from "tronweb";
import dotenv from "dotenv";
dotenv.config();

const tronWeb = new TronWeb({
  fullHost: "https://api.shasta.trongrid.io",
  privateKey: process.env.PRIVATE_KEY,
});

const abi = [
  {
    "inputs": [],
    "name": "latestRoundData",
    "outputs": [
      { "internalType": "uint80", "name": "", "type": "uint80" },
      { "internalType": "int256", "name": "", "type": "int256" },
      { "internalType": "uint256", "name": "", "type": "uint256" },
      { "internalType": "uint256", "name": "", "type": "uint256" },
      { "internalType": "uint80", "name": "", "type": "uint80" }
    ],
    "stateMutability": "pure",
    "type": "function"
  }
];

const bytecode = "608060405234801561001057600080fd5b506101d3806100206000396000f3fe608060405260043610601c5760003560e01c80632daaa523146021575b600080fd5b6027602c565b604051602091909120600081818185875af1925050503d8060008114605b57600080fd5b505050505056fea26469706673582212201e46a9f56f3014b81ef1ebda1057c8f8cf7a99c5666a457ab6c8814747e52c2e64736f6c634300080d0033";

async function deploy() {
  const contract = await tronWeb.contract().new({
    abi,
    bytecode
  });

  console.log("✅ Fixed Oracle deployed at:", contract.address);
}

deploy();