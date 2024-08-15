import web3 from "./web3";

const getCampaignInstance = async (address) => {
  let instance;
  try {
    const isServer = typeof window === "undefined";
    const baseUrl = isServer
      ? `http://${process.env.HOST || "localhost"}:${process.env.PORT || 3000}`
      : "";
    //console.log("baseUrl: ", baseUrl);
    const response = await fetch(`${baseUrl}/build/CampaignFund.json`);
    //console.log(response);
    if (!response.ok) {
      throw new Error("Failed to fetch the contract JSON file");
    }
    const data = await response.json();
    const abi = data["CampaignFund.sol"].CampaignFund.abi;

    if (!abi) {
      throw new Error("ABI not found in the contract JSON file");
    }

    console.log("ABI : ", abi);
    // Check if the contract address has code (indicating deployment)
    const code = await web3.eth.getCode(address);
    if (code === "0x") {
      throw new Error(`Contract is not deployed at address: ${address}`);
    }
    instance = new web3.eth.Contract(abi, address);
  } catch (err) {
    console.log("Error Loading contract", err);
    return null;
  }
  return instance;
};
export default getCampaignInstance;
