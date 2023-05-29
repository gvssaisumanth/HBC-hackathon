import React, { Component } from "react";
import { Segment, Divider } from "semantic-ui-react";

export class UserProfile extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Segment>
        <Divider vertical>Or</Divider>
      </Segment>
    );
  }
}

export default UserProfile;
