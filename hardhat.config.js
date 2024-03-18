require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  defaultNetwork: "hardhat",
  hardhat: {
    mining: {
      auto: true,
    },
  },
  mocha: {
    timeout: 500000,
  },
  networks: {
    mumbai: {
      url: process.env.MUMBAI_HTTP_ENDPOINT,
      accounts: [process.env.MUMBAI_WALLET_KEY],
    },
  },
};
