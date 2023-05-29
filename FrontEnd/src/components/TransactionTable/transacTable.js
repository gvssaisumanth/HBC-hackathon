import {
  Icon,
  Label,
  Menu,
  Segment,
  Table,
  Modal,
  Button,
  Loader,
  Dimmer,
} from "semantic-ui-react";

import React, { Component } from "react";
import axios from "axios";

import ModalView from "../Modal/Modal";

export class TransacTable extends Component {
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

export default TransacTable;
