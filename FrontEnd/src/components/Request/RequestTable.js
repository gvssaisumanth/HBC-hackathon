import React, { Component } from "react";
import { Segment, Tab } from "semantic-ui-react";
import axios from "axios";
import RequestviewTable from "./RequestviewTable";

export class RequestTable extends Component {
  constructor() {
    super();
  }

  state = {
    receivedTransactions: [],
    sendTransactions: [],
    sendEscrowTransactions: [],
    receiveEscrowTransactions: [],
  };
  async receivedTransactions() {
    let transaction = await axios.get(
      "https://8304-2600-1000-b05b-78ae-856c-e12d-2aa7-bc05.ngrok.io/api/requests/0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    );

    if (transaction.length !== 0) {
      this.setState({
        receivedTransactions: transaction.data.receivedTransactions,
      });
    }
  }

  async sentTransactions() {
    let transaction = await axios.get(
      "https://8304-2600-1000-b05b-78ae-856c-e12d-2aa7-bc05.ngrok.io/api/requests/0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
    );

    this.setState({
      sendTransactions: transaction.data.sentTransactions,
    });
  }

  async sentEscrow() {
    let transaction = await axios.get(
      "https://8304-2600-1000-b05b-78ae-856c-e12d-2aa7-bc05.ngrok.io /api/escrow?addr=0x90F79bf6EB2c4f870365E785982E1f101E93b906"
    );

    this.setState({
      sendEscrowTransactions: transaction.data.sentTransactions,
    });
  }

  async recieveEscrow() {
    let transaction = await axios.get(
      "https://8304-2600-1000-b05b-78ae-856c-e12d-2aa7-bc05.ngrok.io/api/escrow?hash=0x74ed1d1bcc7f2e4a49cdfef876d2c4052c95c8246549e63e319b5aacfec537f8"
    );

    this.setState({
      receiveEscrowTransactions: transaction.data.sentTransactions,
    });
  }

  componentDidMount() {
    this.sentTransactions();
    this.receivedTransactions();
    setTimeout(() => {
      this.setState({ isLoading: true });
    }, 3000);
  }
  render() {
    const panes = [
      {
        menuItem: "Sent",
        render: () => (
          <Tab.Pane>
            {" "}
            <RequestviewTable type="sent" data={this.state.sendTransactions} />
          </Tab.Pane>
        ),
      },
      {
        menuItem: "Received",
        render: () => (
          <Tab.Pane>
            {" "}
            <RequestviewTable
              type="received"
              data={this.state.receivedTransactions}
            />
          </Tab.Pane>
        ),
      },
      {
        menuItem: "Escrow",
        render: () => (
          <Tab.Pane>
            {" "}
            <RequestviewTable
              type="escrow"
              data={this.state.sendEscrowTransactions}
              dataReceive={this.state.receiveEscrowTransactions}
            />
          </Tab.Pane>
        ),
      },
    ];
    return (
      <div className="p-5">
        <Segment>
          <div className="display-6 mb-2 text-dark text-center">
            {" "}
            PAYMENT REQUEST
          </div>
          <Tab className="mt-5" panes={panes} />
        </Segment>
      </div>
    );
  }
}

export default RequestTable;
