import React, { Component } from "react";
import web3 from "../../ethereum/web3";
import Layout from "../../components/Layout";
import Campaign from "../../ethereum/campaign";
import { CardGroup } from "semantic-ui-react";
import { Grid, GridRow, GridColumn, Button } from "semantic-ui-react";
import { Link, Router } from "../../routes";
import ContributeForm from "../../components/ContributeForm";
class CampaignShow extends Component {
  static async getInitialProps(props) {
    console.log(" address*** ", props.query.address);
    const campaign = await Campaign(props.query.address);
    console.log("campaign ", campaign, " address ", props.query.address);
    const summary = await campaign.methods.getSummary().call();
    return {
      minContribution: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      approversCount: summary[3],
      manager: summary[4],
      campAddress: props.query.address,
    };
  }
  state = {
    campAddress: this.props.campAddress,
  };
  renderCards() {
    const {
      balance,
      manager,
      minContribution,
      requestsCount,
      approversCount,
      campAddress,
    } = this.props;
    console.log("balance ===== ", balance);
    console.log(" balance ", Number(web3.utils.fromWei(balance, "ether")));
    console.log("manager ", manager);
    console.log("minContribution ", minContribution);
    console.log("requestsCount ", requestsCount);
    console.log("approversCount ", approversCount);
    console.log("Campaign address  ", campAddress);

    const items = [
      {
        header: manager,
        meta: "Address of the Manager",
        description: "The manager created this campaign & ",
        style: { overflowWrap: "break-word", lineHeight: "150%" },
      },
      {
        header: web3.utils.fromWei(minContribution, "ether"),
        meta: "minimum contribution(ethers)",
        description:
          "You must contribute at least this much wei to become an approver.",
      },
      {
        header: Number(requestsCount),
        meta: "number of requests.",
        description:
          "A request tries to withdraw money from the Contract. Requests must be approved by approvers.",
      },
      {
        header: Number(
          web3.utils.fromWei(balance, "ether").replace(/\.0+$/, "")
        ),
        meta: "Campaign balance(Ethers)",
        description:
          "A request tries to withdraw money from the Contract. Requests must be approved by approvers.",
      },
      {
        header: Number(approversCount),
        meta: "Numbers of approvers.",
        description:
          "The total numbers of approvers who approved the requests.",
      },
    ];
    return <CardGroup items={items} />;
  }
  render() {
    return (
      <Layout>
        <Grid>
          <GridRow>
            <GridColumn>
              <h3>
                Welcome to the Campaign{" "}
                <span
                  style={{
                    color: "orange",
                    backgroundColor: "black",
                    padding: "5px 3px",
                    margin: "0 5px",
                  }}
                >
                  {this.state.campAddress}
                </span>
              </h3>
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn width={10}>{this.renderCards()}</GridColumn>

            <GridColumn width={6}>
              <ContributeForm address={this.state.campAddress} />
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn>
              <Link route={`/campaigns/${this.state.campAddress}/requests`}>
                <Button primary>View Requests</Button>
              </Link>
            </GridColumn>
          </GridRow>
        </Grid>
      </Layout>
    );
  }
}
export default CampaignShow;
