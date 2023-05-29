import React, { Component } from "react";
import './neumorphic.css'
export class NeumorphicContainer extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="page-container">
        <div className="container-wrapper">
          <div className="neumorphic-container" style={{ textAlign: "center" }}>
            {this.props.element}
          </div>
        </div>
      </div>
    );
  }
}

export default NeumorphicContainer;
