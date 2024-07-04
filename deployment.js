require("dotenv").config();
const fs = require("fs-extra");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");

const compiledCamFund = fs.readFileSync(
  "./ethereum/build/CampaignFund.json",
  "utf8"
);
const compiledCamFundFactory = fs.readFileSync(
  "./ethereum/build/CampaignFundFactory.json",
  "utf8"
);

// Load environment variables
const { MNEMONIC, MNEMONIC_GANACHE, SEPOLIA_END_POINT, PROJECT_ID } =
  process.env;

// correct code to Set up provider for Ganache
const provider = new HDWalletProvider({
  mnemonic: MNEMONIC_GANACHE,
  providerOrUrl: "http://localhost:8545",
});
const sepoliaEndPoint = `${SEPOLIA_END_POINT}${PROJECT_ID}`;
// configuring provider for sepolia testnet
// const provider = new HDWalletProvider({
//   mnemonic: MNEMONIC,
//   providerOrUrl: sepoliaEndPoint,
// });

const campaignFundFactABI = JSON.parse(compiledCamFundFactory)[
  "CampaignFund.sol"
].CampaignFundFactory.abi;
const campaignFundFactByteCode = JSON.parse(compiledCamFundFactory)[
  "CampaignFund.sol"
].CampaignFundFactory.evm.bytecode.object;

const web3 = new Web3.default(provider);
let accounts;
let factory;
const deployment = async () => {
  const providerUrl = web3.currentProvider.host;
  try {
    accounts = await web3.eth.getAccounts();
  } catch (err) {
    console.log(err);
  }
  try {
    factory = await new web3.eth.Contract(campaignFundFactABI)
      .deploy({ data: "0x" + campaignFundFactByteCode })
      .send({ from: accounts[1], gas: "2000000" });
  } catch (err) {
    console.log(err);
  }
  process.exit(1);
};
deployment();
