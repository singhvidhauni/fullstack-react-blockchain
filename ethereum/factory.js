import web3 from "./web3";
let instance = null;
let loading = false;

const loadContract = async () => {
  try {
    if (instance || loading) {
      return instance;
    }
    loading = true;
    // Determine base URL for server-side fetching
    const isServer = typeof window === "undefined";
    const baseUrl = isServer
      ? `http://${process.env.HOST || "localhost"}:${process.env.PORT || 3000}`
      : "";

    const response = await fetch(`${baseUrl}/build/CampaignFundFactory.json`);
    if (!response.ok) {
      throw new Error("Failed to fetch the contract JSON file");
    }
    const data = await response.json();
    const abi = data["CampaignFund.sol"].CampaignFundFactory.abi;
    if (!abi) {
      throw new Error("ABI not found in the contract JSON file");
    }
    instance = new web3.eth.Contract(
      abi,
      process.env.NEXT_PUBLIC_ADDRESS_CAMPAIGN_FACTORY
    );
    loading = false;
    return instance;
  } catch (error) {
    console.log("Error Loading contract", error);
    loading = false;
    return null;
  }
};
export const getFactoryInstance = async () => {
  if (!loading && !instance) {
    await loadContract();
  }
  return instance;
};
export default instance;
