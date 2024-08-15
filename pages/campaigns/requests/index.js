import React, { Component } from "react";
import { Button, Table } from "semantic-ui-react";
import Layout from "../../../components/Layout";
import getCampaignInstance from "../../../ethereum/campaign";
import { Link } from "../../../routes";
import RequestRow from "../../../components/RequestRow";
class RequestIndex extends Component {
  static async getInitialProps(props) {
    const { address } = props.query;

    console.log("ADDRES  SSS ", address);

    const campaign = await getCampaignInstance(props.query.address);
    let requestCount = await campaign.methods.getRequestsCount().call();
    let approversCount = await campaign.methods.approversCount().call();
    let manager = await campaign.methods.manager().call();
    let minContribution = await campaign.methods.minContribution().call();
    let numRequests = await campaign.methods.numRequests().call();
    let summary = await campaign.methods.getSummary().call();
    requestCount = Number(requestCount);
    approversCount = Number(approversCount);
    const requests = await Promise.all(
      Array(requestCount)
        .fill()
        .map((ele, index) => {
          return campaign.methods.requests(index).call();
        })
    );
    if (campaign.events) {
      //e.g to show how to listen to event RequestCreated
      campaign.events.RequestCreated().on("data", (event) => {
        console.log("RequestCreated event received:", event.returnValues);
        // Optionally, you can update the state to add the new request
        //setRequests((prevRequests) => [...prevRequests, event.returnValues]);
      });
    }
    console.log(
      "manager : ",
      manager,
      " minContribution ",
      minContribution,
      " no of requests ",
      numRequests
    );
    return { address, requests, requestCount, approversCount };
  }
  renderRows() {
    // if (this.props.requests.length > 0) {
    return this.props.requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          request={request}
          address={this.props.address}
          approversCount={this.props.approversCount}
        />
      );
    });
  }
  render() {
    const { Header, Row, HeaderCell, Body } = Table;
    return (
      <Layout>
        <h3>Rquest list </h3>
        <Link route={`/campaigns/${this.props.address}/requests/new`}>
          <Button primary floated="right" style={{ marginBottom: 10 }}>
            Add Request
          </Button>
        </Link>
        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Amount</HeaderCell>
              <HeaderCell>Recipient</HeaderCell>
              <HeaderCell>Approval Count</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
              <HeaderCell>Finalize</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRows()}</Body>
        </Table>
        <div style={{ fontWeight: "bold" }}>
          Found {this.props.requestCount} requests
        </div>
      </Layout>
    );
  }
}
export default RequestIndex;
