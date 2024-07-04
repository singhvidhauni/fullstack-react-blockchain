import React, { Component } from "react";
import { Card, Button } from "semantic-ui-react";
import Layout from "../components/Layout";
import { getFactoryInstance } from "../ethereum/factory";
import { Link } from "../routes";
class CampaignFundIndex extends Component {
  // to be executed during the server side rendering
  static async getInitialProps() {
    const factory = await getFactoryInstance();
    if (!factory) {
      console.log("Failed to load factory instance");
      return { campaigns: [] };
    }
    try {
      const campaigns = await factory.methods.getDeployedCampaigns().call();
      return { campaigns };
    } catch (error) {
      console.error("Error fetching deployed campaigns:", error);
      return { campaigns: [] };
    }
    // campaigns will be accessible by this.props.campaigns)
  }
  // no need to implement it as we have no use of this function.
  async componentDidMount() {}
  renderCampaigns() {
    console.log("render campaigns called..");
    const items = this.props.campaigns.map((address) => {
      console.log(address);
      return {
        header: address,
        description: <Link route={`/campaigns/${address}`}>View Campaign</Link>,
        fluid: true,
      };
    });
    return <Card.Group items={items} />;
  }
  render() {
    const { campaigns } = this.props;
    if (campaigns.length === 0) {
      return <div>No campaigns found.</div>;
    }
    return (
      <Layout>
        <h3>Open Campaign</h3>
        <Link route="/campaigns/new">
          <Button
            content="Create Campaign"
            floated="right"
            icon="plus"
            labelPosition="right"
            primary
          ></Button>
        </Link>
        {this.renderCampaigns()}
      </Layout>
    );
  }
}
export default CampaignFundIndex;
