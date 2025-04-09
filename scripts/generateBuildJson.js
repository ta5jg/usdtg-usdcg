import fs from "fs";

const abi = JSON.parse(fs.readFileSync("build/contracts_FlashTetherTRC20_sol_FlashTetherTRC20.abi", "utf8"));
const bytecodeRaw = fs.readFileSync("build/contracts_FlashTetherTRC20_sol_FlashTetherTRC20.bin", "utf8");
const bytecode = "0x" + bytecodeRaw.trim();

const output = {
  abi,
  bytecode,
};

fs.writeFileSync("build/FlashTetherTRC20.json", JSON.stringify(output, null, 2));
console.log("✅ FlashTetherTRC20.json created in build/");