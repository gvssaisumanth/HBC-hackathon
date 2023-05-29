import React from "react";
import { Modal, Table } from "react-bootstrap";
import "./modal.css";

const ModalView = ({ open, onClose, type, data }) => {
  console.log("data", type);

  return (
    <Modal className="fade" show={open} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        {" "}
        <Modal.Title>Transaction Details </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table responsive>
          <thead>
            <tr>
              <th>Transaction Type</th>
              <th>Trnx No.</th>
              <th>Amount</th>
              <th>Asset</th>
              <th>Sender</th>
              <th>Receiver</th>
              <th>Token</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{type}</td>
              <td>{"number"}</td>
              <td>{data.amount}</td>
              <td>{"ETH"}</td>
              <td>{data.sender}</td>
              <td>{data.receiver}</td>
              <td>{data.token}</td>
              <td>{data.date}</td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
      {/* <Modal.Header>Delete Your Account</Modal.Header>
      <Modal.Content>
        <Table basic="very">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                <Label>{"Type"}</Label>: {"Hello boss"}
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Label>Asset</Label>: {"Etherium"}
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Label>Amount</Label>: {"Amount"}
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Label>Date</Label>: {"24/5/99"}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
        </Table>
      </Modal.Content>
      <Modal.Actions>
        <Button negative>No</Button>
        <Button positive>Yes</Button>
      </Modal.Actions> */}
    </Modal>
  );
};

export default ModalView;
