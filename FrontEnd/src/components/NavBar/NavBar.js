import React, { Component } from "react";
import {
  Navbar,
  Container,
  Form,
  Nav,
  NavDropdown,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import "./header.css";

export class header extends Component {
  constructor() {
    super();
    this.state = {
      isUser: true,
    };
  }
  render() {
    if (this.state.isUser) {
      return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Container>
            <Navbar.Brand href="/">
              Mobile<span className="siteName">Pay</span>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Link to="/transactioninfo" className="my-link">
                  Transactions
                </Link>
                <Link to="/payment" className="my-link">
                  Pay
                </Link>
                <Link to="/request" className="my-link">
                  Requested
                </Link>
                <Link to="/userProfile" className="my-link">
                  Settings
                </Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      );
    } else {
      return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Container>
            <Navbar.Brand href="/">
              Mobile<span className="siteName">Pay</span>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Link to="/register" className="my-link">
                  Register here
                </Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      );
    }
  }
}

export default header;
