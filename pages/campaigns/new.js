import React, { Component } from "react";
import { Form, FormField, Button, Input, Message } from "semantic-ui-react";
import Layout from "../../components/Layout";
import { getFactoryInstance } from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { Router } from "../../routes";
class CampaignsNew extends Component {
  state = {
    minContribution: "",
    errorMessage: "",
    loading: false,
  };
  onSubmit = async (event) => {
    event.preventDefault();

    const factory = await getFactoryInstance();
    this.setState({ loading: true, errorMessage: "" });
    try {
      const accounts = await web3.eth.getAccounts();
      console.log(accounts);
      await factory.methods.createCampaign(this.state.minContribution).send({
        from: accounts[0],
      });
      this.setState({ loading: false });
      Router.pushRoute("/");
    } catch (err) {
      this.setState({ loading: false });
      this.setState({ errorMessage: err.message, minContribution: "" });
    }
  };
  render() {
    return (
      <Layout>
        <h3>Create a campaign</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <FormField>
            <label>Minimum contribution (wei)</label>
            <Input
              label={{ basic: true, content: "wei" }}
              labelposition="right"
              placeholder="min contribution"
              value={this.state.minContribution}
              onChange={(event) =>
                this.setState({
                  minContribution: event.target.value,
                  errorMessage: "",
                })
              }
            />
          </FormField>
          <Message
            error
            header="Something went wrong"
            content={this.state.errorMessage}
          />
          <Button type="submit" loading={this.state.loading} primary>
            Create
          </Button>
        </Form>
      </Layout>
    );
  }
}
export default CampaignsNew;
