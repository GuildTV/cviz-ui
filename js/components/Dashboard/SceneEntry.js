/*
* External Dependancies
*/

import React from 'react';
import {
  Col,
  Input, Button,
  Popover, OverlayTrigger
} from 'react-bootstrap';

/*
* Variables
*/
const RunTemplateKey = "runTemplate";

/*
* React
*/

const overlayCss = {
  marginTop: "72px",
  textAlign: "center"
}

export default class SceneEntry extends React.Component {
  runTemplate(e){
    console.log("Running template:", this.props.data.template);

    this.props.refs.sock.socket.emit(RunTemplateKey, {
      template: this.props.data.template,
      data: this.props.data,
      dataId: this.props.data.name
    });
  }

  render() {
    return (
      <Col md={4} sm={6} xs={12} style={{ textAlign: "center" }}>
        <p>
          <Button onClick={this.runTemplate.bind(this)}>
            { this.props.data.name } ({ this.props.data.template })
          </Button>
        </p>
      </Col>
    );
  }
}