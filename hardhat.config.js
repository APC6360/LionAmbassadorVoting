// hardhat.config.js
require("dotenv").config({ path: ".env.local" });
module.exports = {
  solidity: "0.8.19",
  networks: {
    testbnb: {
      url: process.env.NEXT_PUBLIC_RPC_URL,
      accounts: [process.env.ADMIN_PRIVATE_KEY]
    }
  }
};