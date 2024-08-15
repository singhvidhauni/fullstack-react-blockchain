import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import getCampaignInstance from "./../ethereum/campaign";
class RequestRow extends Component {
  onApprove = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      const Campaign = await getCampaignInstance(this.props.address);
      await Campaign.methods.approveRequest(this.props.id).send({
        from: accounts[0],
      });
    } catch (error) {
      console.log(error);
    }
  };

  onFinalize = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      const Campaign = await getCampaignInstance(this.props.address);
      await Campaign.methods.finalizeRequest(this.props.id).send({
        from: accounts[0],
      });
    } catch (error) {
      console.log(error);
    }
  };
  render() {
    const { Row, Cell } = Table;
    const { id, request, address, approversCount } = this.props;
    console.log("ID ", id);
    console.log("description ", request.description);
    console.log("value ", parseInt(request.value));
    console.log("recipient ", request.recipient);
    console.log("address ", address);
    console.log("approversCount ", approversCount);
    console.log("approvalCount ", parseInt(request.approvalCount));
    const readyToFinalize = request.approvalCount > approversCount / 2;
    return (
      <Row
        disabled={request.complete}
        positive={readyToFinalize && !request.complete}
      >
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{parseInt(request.value)}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>
          {parseInt(request.approvalCount)}/{approversCount}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button color="green" basic onClick={this.onApprove}>
              Approve
            </Button>
          )}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button color="teal" basic onClick={this.onFinalize}>
              Finalize
            </Button>
          )}
        </Cell>
      </Row>
    );
  }
}
export default RequestRow;
