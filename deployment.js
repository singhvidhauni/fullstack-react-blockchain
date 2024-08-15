require("dotenv").config();
const fs = require("fs-extra");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");

const compiledCamFund = fs.readFileSync(
  "./ethereum/build/CampaignFund.json",
  "utf8"
);
let compiledCamFundFactory = JSON.parse(
  fs.readFileSync("./ethereum/build/CampaignFundFactory.json", "utf8")
);

// Load environment variables
const { MNEMONIC, MNEMONIC_GANACHE, SEPOLIA_END_POINT, PROJECT_ID } =
  process.env;

const sepoliaEndPoint = `${SEPOLIA_END_POINT}${PROJECT_ID}`;
// correct code to Set up provider for Ganache
const provider = new HDWalletProvider({
  mnemonic: MNEMONIC_GANACHE,
  providerOrUrl: process.env.NEXT_PUBLIC_GANACHE_UI_RPC_END_POINT,
});

// configuring provider for sepolia testnet
/* const provider = new HDWalletProvider({
   mnemonic: MNEMONIC,
   providerOrUrl: sepoliaEndPoint,
 });*/

//The below code is to used in case of compiling the code using compile.js file using solc compiler
/* const campaignFundFactABI = JSON.parse(compiledCamFundFactory)[
   "CampaignFund.sol"
 ].CampaignFundFactory.abi;*/

/* const campaignFundFactByteCode = JSON.parse(compiledCamFundFactory)[
   "CampaignFund.sol"
 ].CampaignFundFactory.evm.bytecode.object;*/

//following code is used in case the truffle is used to compile smartcode
// const campaignFundFactABI = JSON.parse(compiledCamFundFactory)[
//   "CampaignFund.sol"
// ].CampaignFundFactory.abi;
// const campaignFundFactByteCode = JSON.parse(compiledCamFundFactory)[
//   "CampaignFund.sol"
// ].CampaignFundFactory.bytecode;
// compiledCamFundFactory =
//   compiledCamFundFactory["CampaignFund.sol"].CampaignFundFactory;

const { abi: campaignFundFactABI, bytecode: campaignFundFactByteCode } =
  compiledCamFundFactory;

// console.log(" abi-> ", campaignFundFactABI);
// console.log(" bytecode ->", campaignFundFactByteCode);
const web3 = new Web3.default(provider);
let accounts;
let factory;
const deployment = async () => {
  const providerUrl = web3.currentProvider.host;
  try {
    accounts = await web3.eth.getAccounts();
    console.log(" first account for creating campaign ", accounts[0]);
    factory = await new web3.eth.Contract(campaignFundFactABI)
      .deploy({ data: campaignFundFactByteCode })
      .send({
        from: accounts[0],
        gas: "6000000",
        gasPrice: web3.utils.toWei("20", "gwei"),
      });
    console.log("Contract deployed to:", factory.options.address);
  } catch (err) {
    console.log(err);
  }
  process.exit(1);
};
deployment();
