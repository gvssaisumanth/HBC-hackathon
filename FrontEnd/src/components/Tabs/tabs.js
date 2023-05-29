import { Tab, Segment, Dimmer, Loader } from "semantic-ui-react";
import { TransacTable } from "../TransactionTable/transacTable";
import { React, Component } from "react";
import axios from "axios";
import { connect } from "react-redux";

export class Tabs extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      sendTransactions: [],
      receivedTransactions: [],
    };
  }

  componentDidUpdate(prevProps) {
    console.log("prevProps", this.props, prevProps);
    if (prevProps.signer !== this.props.signer) {
      console.log("Signer updated in ClassComponent:", this.props.signer);
    }
  }

  async receivedTransactions() {
    let transaction = await axios.get(
      "http://localhost:3000/api/transactions/0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
    );

    if (transaction.length !== 0) {
      this.setState({
        receivedTransactions: transaction.data.receivedTransactions,
      });
    }
  }

  async sentTransactions() {
    let transaction = await axios.get(
      "http://localhost:3000/api/transactions/0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    );

    this.setState({
      sendTransactions: transaction.data.sentTransactions,
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
    console.log("received Transactions", this.state.sendTransactions);
    console.log("Redux signer....", this.props.signer);

    const panes = [
      {
        menuItem: "Sent",
        render: () => (
          <Tab.Pane>
            {this.state.sendTransactions.length == 0 ? (
              <span style={{ color: "black" }}>No Transactions Here</span>
            ) : (
              <TransacTable data={this.state.sendTransactions} type="sent" />
            )}
          </Tab.Pane>
        ),
      },
      {
        menuItem: "Received",
        render: () => (
          <Tab.Pane>
            {this.state.receivedTransactions.length == 0 ? (
              <span style={{ color: "black" }}>No Transactions Here</span>
            ) : (
              <TransacTable
                data={this.state.receivedTransactions}
                type="received"
              />
            )}
          </Tab.Pane>
        ),
      },
    ];
    if (!this.state.isLoading && this.state.sendTransactions.length == 0) {
      return (
        <Dimmer inverted active>
          <Loader>Loading your Data..please wait</Loader>
        </Dimmer>
      );
    } else {
      return (
        <div className="p-5">
          <Segment>
            <div className="display-6 mb-2 text-dark text-center">
              {" "}
              Transaction History
            </div>
            <Tab className="mt-5" panes={panes} />
          </Segment>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    signer: state.signer,
  };
};

export default connect(mapStateToProps)(Tabs);
