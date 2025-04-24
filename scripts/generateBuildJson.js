import fs from "fs";

const abi = JSON.parse(fs.readFileSync("build/contracts_TetherGround USD_sol_TetherGround USD.abi", "utf8"));
const bytecodeRaw = fs.readFileSync("build/contracts_TetherGround USD_sol_TetherGround USD.bin", "utf8");
const bytecode = "0x" + bytecodeRaw.trim();

const output = {
  abi,
  bytecode,
};

fs.writeFileSync("build/TetherGround USD.json", JSON.stringify(output, null, 2));
console.log("✅ TetherGround USD.json created in build/");