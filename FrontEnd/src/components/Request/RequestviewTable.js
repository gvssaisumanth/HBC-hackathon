import React, { Component } from "react";
import { Button, Icon, Label, Menu, Segment, Table } from "semantic-ui-react";
import ModalView from "../Modal/Modal";

class RequestviewTable extends Component {
  constructor(props) {
    super(props);

    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
  }
  state = {
    modalOpen: false,
  };

  componentDidMount() {}

  handleRowClick = () => {
    this.setState({ modalOpen: true });
  };

  handleCloseModal = () => {
    this.setState({ modalOpen: false });
  };

  cancelRequest() {
    console.log("Canceling...");
  }

  approveRequest() {
    console.log("Canceling...");
  }

  rejectRequest() {
    console.log("Rejecting");
  }

  render() {
    console.log("Props in Table...", this.props.data);

    return (
      <Segment>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Type of Transaction</Table.HeaderCell>
              <Table.HeaderCell>Amount</Table.HeaderCell>
              <Table.HeaderCell>Asset</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          {this.props.data.length > 0 &&
            this.props.data.map((e, i) => {
              console.log("e", e.amount);
              return (
                <Table.Body>
                  <Table.Row id="tableRow" onClick={this.handleRowClick}>
                    <Table.Cell>
                      {this.props.type === "sent" ? (
                        <Label ribbon color={"red"}>
                          Send
                        </Label>
                      ) : (
                        <Label ribbon color={"green"}>
                          Received
                        </Label>
                      )}
                    </Table.Cell>
                    <Table.Cell>{e.amount}</Table.Cell>
                    <Table.Cell>{}</Table.Cell>
                    {this.props.type == "sent" ? (
                      <Table.Cell>
                        <Button onClick={this.cancelRequest}>Cancel</Button>
                      </Table.Cell>
                    ) : this.props.type == "received" ? (
                      <Table.Cell>
                        <span>
                          <Button>Approve</Button>
                          <Button>Reject</Button>
                        </span>
                      </Table.Cell>
                    ) : (
                      <Table.Cell>Coming Soon</Table.Cell>
                    )}
                  </Table.Row>
                  <ModalView
                    open={this.state.modalOpen}
                    onClose={this.handleCloseModal}
                    type={this.props.type}
                    data={e}
                  ></ModalView>
                </Table.Body>
              );
            })}

          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan="3">
                <Menu floated="right" pagination>
                  <Menu.Item as="a" icon>
                    <Icon name="chevron left" />
                  </Menu.Item>
                  <Menu.Item as="a">1</Menu.Item>
                  <Menu.Item as="a">2</Menu.Item>
                  <Menu.Item as="a">3</Menu.Item>
                  <Menu.Item as="a">4</Menu.Item>
                  <Menu.Item as="a" icon>
                    <Icon name="chevron right" />
                  </Menu.Item>
                </Menu>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </Segment>
    );
  }
}
export default RequestviewTable;
