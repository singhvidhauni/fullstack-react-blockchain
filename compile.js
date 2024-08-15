const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");

const buildPath = path.resolve(__dirname, "ethereum/build");
const deployCampaignFactPath = path.resolve(__dirname, "public/build");
fs.removeSync(buildPath);
fs.ensureDirSync(buildPath);
fs.removeSync(deployCampaignFactPath);
fs.ensureDirSync(deployCampaignFactPath);

const campaignPath = path.resolve(__dirname, "contracts", "CampaignFund.sol");

const source = fs.readFileSync(campaignPath, "utf8");
const input = {
  language: "Solidity",
  sources: {
    [path.basename(campaignPath)]: {
      content: source,
    },
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode.object"],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
if (output.errors && output.errors.length > 0) {
  console.error("Error during compilation:", output.errors);
} else {
  console.log("Compiled successfully!");
}

for (let contractFileName in output["contracts"]["CampaignFund.sol"]) {
  const contractName = contractFileName.replace(".sol", "");
  const contract = output.contracts["CampaignFund.sol"][contractFileName];
  fs.outputJsonSync(
    path.resolve(buildPath, contractName + ".json"),
    output["contracts"]
  );
  fs.outputJsonSync(
    path.resolve(deployCampaignFactPath, contractName + ".json"),
    output["contracts"]
  );
}
