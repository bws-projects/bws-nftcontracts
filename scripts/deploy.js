require("dotenv").config();
const hre = require("hardhat");

// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
// const hre = require("hardhat");

async function main() {
  // const contract = await hre.ethers.deployContract("BWSErc721");
  const name = "BWSERC721";
  const symbol = "BWSNFT";
  const baseURI = "ipfs://";
  const admin = process.env.MUMBAI_CONTRACT_OWNER;
  const minter = process.env.MUMBAI_CONTRACT_OWNER;

  console.log(admin);

  const contract = await hre.ethers.deployContract(
    "BWSErc721",
    [name, symbol, baseURI, admin, minter],
    {
      name: name,
      symbol: symbol,
      baseURI: baseURI,
      admin: admin,
      minter: minter,
    }
  );

  await contract.waitForDeployment();

  console.log(`Contract was successfully deployed to ${contract.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
