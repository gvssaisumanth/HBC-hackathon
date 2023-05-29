import React from "react";
import { Dimmer, Loader, Image, Segment } from "semantic-ui-react";

const LoadingScreen = () => (
  <div>
    <Segment>
      <Dimmer active>
        <Loader size="massive">Loading</Loader>
      </Dimmer>
    </Segment>
  </div>
);

export default LoadingScreen;
