import React, { Component } from "react";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";
import "./paymentpage.css";
import { Link } from "react-router-dom";
import {Button} from 'semantic-ui-react'
export class Paymentpage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  paymentForm = () => {
    return (
      <Link to={{pathname:"/paymentForm/sent",state:"sent"}}>
        <Button
          style={{ height: "57px", butt: "#213259" }}
          type="primary"
          onClick={() => this.paymentForm()}
        >
          Send Coins
        </Button>
      </Link>
    );
  };
  render() {
    return (
      <div className="page-container">
        <div className="container-wrapper">
          <div className="neumorphic-container" style={{ textAlign: "center" }}>
            {this.paymentForm()}
          </div>

          <div
            className="neumorphic-container"
            style={{ textAlign: "center", marginTop: "50px" }}
          >
            <Link to={{pathname:"/paymentForm/received"}}>
              <AwesomeButton
                style={{ height: "57px", butt: "#213259" }}
                type="primary"
                className="blue-button"
              >
                Request Coins
              </AwesomeButton>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Paymentpage;