import React, { Component } from "react";
import getCampaignInstance from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import { Router } from "../routes";
import { Button, Form, Label, Input, Message } from "semantic-ui-react";
class ContributeForm extends Component {
  state = {
    value: "",
    loading: false,
    errorMessage: "",
  };
  onSubmit = async (event) => {
    event.preventDefault();
    const campaign = await getCampaignInstance(this.props.address);
    this.setState({ loading: true });
    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, "ether"),
      });
      Router.replaceRoute(`/campaigns/${this.props.address}`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
      console.log(err);
    }
    this.setState({ loading: false, value: "" });
  };
  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <Label>Amount to Contribute</Label>
          <Input
            label="ether"
            labelPosition="right"
            value={this.state.value}
            onChange={(event) =>
              this.setState({ value: event.target.value, errorMessage: "" })
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
          Contribute!
        </Button>
      </Form>
    );
  }
}
export default ContributeForm;
