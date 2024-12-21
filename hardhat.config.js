require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.0",
  ropsten: {
    url: "https://ropsten.infura.io/v3/YOUR_INFURA_PROJECT_ID", // Replace with your Infura/RPC URL
    accounts: ["YOUR_PRIVATE_KEY"], // Replace with your wallet private key
  },
};
