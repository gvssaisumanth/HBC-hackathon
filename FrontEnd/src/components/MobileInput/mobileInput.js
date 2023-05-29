import React, { Component } from "react";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import NeumorphicContainer from "../NeumorphicContainer/neumorphicContainer";
import { Button, Segment } from "semantic-ui-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { isDisabled } from "@testing-library/user-event/dist/utils";

class MobileInput extends Component {
  constructor(props) {
    super(props);

    this.handleOnChange = this.handleOnChange.bind(this);
    this.sendOtp = this.sendOtp.bind(this);
  }

  state = {
    phoneNumber: "",
    isdiabled: true,
  };

  handleOnChange(value) {
    this.setState({ phoneNumber: value });
  }
  componentDidMount() {
    this.setState({ isDisabled: false });
  }
  sendOtp() {
    const params = {
      phNum: "+"+this.state.phoneNumber,
    };

    axios.post(
      "http://localhost:3000/send-otp?",
      params
    );
  }

  render() {
    return (
      <div>
        <Segment className="page">
          <div>
            <h3 style={{ color: "black" }}>Enter your Mobile Number</h3>
            <PhoneInput
              style={{ color: "black" }}
              country={"us"}
              value={this.state.phoneNumber}
              onChange={this.handleOnChange}
              placeholder={"Enter phone number"}
            />
            <Button
              onClick={this.sendOtp}
              style={{ marginTop: "10px" }}
              positive
            >
              Send OTP
            </Button>

            <Link to={{ pathname: `/otp/${this.state.phoneNumber}` }}>
              <Button style={{ marginTop: "10px" }} positive>
                Next
              </Button>
            </Link>
          </div>
        </Segment>
      </div>
    );
  }
}

export default MobileInput;
