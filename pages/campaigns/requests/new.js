import React, { Component } from "react";
import { Form, Input, Button, Message, Label } from "semantic-ui-react";
import getCampaignInstance from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";
import Layout from "../../../components/Layout";
import { Link, Router } from "../../../routes";

class RequestNew extends Component {
  state = {
    value: "",
    description: "",
    recipient: "",
    errorMessage: "",
    loading: false,
  };
  static async getInitialProps(props) {
    const { address } = props.query;
    return { address };
  }
  onSubmit = async (event) => {
    event.preventDefault();
    if (this.state.loading) {
      // Prevent multiple submissions
      return;
    }
    this.setState({ loading: true, errorMessage: "" });

    const campaign = await getCampaignInstance(this.props.address);
    const { description, value, recipient } = this.state;
    console.log(
      "description ",
      description,
      " value ",
      web3.utils.toWei(value, "ether"),
      " recipient ",
      recipient,
      " address ",
      this.props.address
    );
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
        .send({
          from: accounts[0],
          gas: 200000,
        });
      Router.pushRoute(`/campaigns/${this.props.address}/requests`);
    } catch (err) {
      console.log(err);
      this.setState({ errorMessage: err.message });
    }
    this.setState({
      loading: false,
    });
  };
  render() {
    return (
      <Layout>
        <h2>Create a Request</h2>
        <Form
          onSubmit={this.onSubmit}
          error={!!this.state.errorMessage}
          disabled={this.state.loading}
        >
          <Form.Field>
            <Label>Description</Label>
            <Input
              label="description"
              labelPosition="right"
              value={this.state.description}
              onChange={(event) =>
                this.setState({
                  description: event.target.value,
                  errorMessage: "",
                })
              }
            />
          </Form.Field>
          <Form.Field>
            <Label>Amount in Ether</Label>
            <Input
              label="ether"
              labelPosition="right"
              value={this.state.value}
              onChange={(event) =>
                this.setState({ value: event.target.value, errorMessage: "" })
              }
            />
          </Form.Field>
          <Form.Field>
            <Label>Recipient</Label>
            <Input
              label="recipient address"
              labelPosition="right"
              value={this.state.recipient}
              onChange={(event) =>
                this.setState({
                  recipient: event.target.value,
                  errorMessage: "",
                })
              }
            />
          </Form.Field>
          <Message
            error
            header="Oops!!"
            content={this.state.errorMessage}
            style={{ overflowWrap: "break-word" }}
          ></Message>
          <Button primary loading={this.state.loading}>
            Create!
          </Button>
        </Form>
      </Layout>
    );
  }
}
export default RequestNew;
