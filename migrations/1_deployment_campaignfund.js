const campaignfunds = artifacts.require("CampaignFund");
module.exports = (deployer) => {
    const minContribution = 0;
    deployer.deploy(campaignfunds, minContribution);
}