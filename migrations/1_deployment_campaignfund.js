const campaignfactory = artifacts.require("CampaignFundFactory");
module.exports = (deployer) => {
    deployer.deploy(campaignfactory);
}