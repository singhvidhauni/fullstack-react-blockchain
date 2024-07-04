const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");

const buildPath = path.resolve(__dirname, "ethereum/build");
const deployCampaignFactPath = path.resolve(__dirname, "public/build");
fs.removeSync(buildPath);
fs.removeSync(deployCampaignFactPath);

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
    outputSelection: {
      "*": {
        "*": ["*"],
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

fs.ensureDirSync(buildPath);
for (let contracts in output["contracts"]["CampaignFund.sol"]) {
  fs.outputJsonSync(
    path.resolve(buildPath, contracts + ".json"),
    output["contracts"]
  );
  fs.outputJsonSync(
    path.resolve(deployCampaignFactPath, contracts + ".json"),
    output["contracts"]
  );
}
