import React, { Component } from "react";
import "react-phone-input-2/lib/style.css";
import "./Otp.css";
import NeumorphicContainer from "../NeumorphicContainer/neumorphicContainer";
import { Input, Button } from "semantic-ui-react";
import { AwesomeButton } from "react-awesome-button";
import axios from "axios";

class Otp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      otp1: "",
      otp2: "",
      otp3: "",
      otp4: "",
      otp5: "",
      otp6: "",
    };
    this.handleOnChangeOtp1 = this.handleOnChangeOtp1.bind(this);
    this.handleOnChangeOtp2 = this.handleOnChangeOtp2.bind(this);
    this.handleOnChangeOtp3 = this.handleOnChangeOtp3.bind(this);
    this.handleOnChangeOtp4 = this.handleOnChangeOtp4.bind(this);
    this.handleOnChangeOtp5 = this.handleOnChangeOtp5.bind(this);
    this.handleOnChangeOtp6 = this.handleOnChangeOtp6.bind(this);
  }
  onSubmit = () => {
    let finalOtp =
      this.state.otp1 +
      this.state.otp2 +
      this.state.otp3 +
      this.state.otp4 +
      this.state.otp5 +
      this.state.otp6;

    const phoneNumber = new URL(window.location.href).pathname.split("/").pop();
    const params = {
      phNum: phoneNumber,
      otpCode: Number(finalOtp),
    };
    axios.post(
      "https://8304-2600-1000-b05b-78ae-856c-e12d-2aa7-bc05.ngrok/verify-otp?",
      params
    );
  };
  handleOnChangeOtp1(value) {
    this.setState({ otp1: value.target.value });
  }
  handleOnChangeOtp2(value) {
    this.setState({ otp2: value.target.value });
  }
  handleOnChangeOtp3(value) {
    this.setState({ otp3: value.target.value });
  }
  handleOnChangeOtp4(value) {
    this.setState({ otp4: value.target.value });
  }
  handleOnChangeOtp5(value) {
    this.setState({ otp5: value.target.value });
  }
  handleOnChangeOtp6(value) {
    this.setState({ otp6: value.target.value });
  }

  render() {
    console.log("props", this.props);
    return (
      <NeumorphicContainer
        element={
          <div>
            <h3 style={{ color: "black" }}>Verify your OTP</h3>
            <div className="row">
              <div className="col-2">
                <Input
                  className="otpInput"
                  onChange={this.handleOnChangeOtp1}
                  maxLength={1}
                />
              </div>
              <div className="col-2">
                <Input
                  className="otpInput"
                  onChange={this.handleOnChangeOtp2}
                  maxLength={1}
                />
              </div>
              <div className="col-2">
                <Input
                  className="otpInput"
                  onChange={this.handleOnChangeOtp3}
                  maxLength={1}
                />
              </div>
              <div className="col-2">
                <Input
                  className="otpInput"
                  onChange={this.handleOnChangeOtp4}
                  maxLength={1}
                />
              </div>
              <div className="col-2">
                <Input
                  className="otpInput"
                  onChange={this.handleOnChangeOtp5}
                  maxLength={1}
                />
              </div>
              <div className="col-2">
                <Input
                  className="otpInput"
                  onChange={this.handleOnChangeOtp6}
                  maxLength={1}
                />
              </div>
            </div>
            <Button style={{ marginTop: "10px" }} positive>
              Verify
            </Button>
          </div>
        }
      ></NeumorphicContainer>
    );
  }
}

export default Otp;
