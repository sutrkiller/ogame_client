import {Helmet} from "react-helmet";
import * as React from "react";

export class Head extends React.Component<any, any> {
  render() {
    return (
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <link rel="shortcut icon" href=""/>
      </Helmet>
    );
  }
}
