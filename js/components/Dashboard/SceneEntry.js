/*
* External Dependancies
*/

import React from 'react';
import {
  Col,
  Button
} from 'react-bootstrap';

/*
* Variables
*/
const RunTemplateKey = "runTemplate";

/*
* React
*/

export default class SceneEntry extends React.Component {
  runTemplate(){
    console.log("Running template:", this.props.data.template);

    this.props.sock.socket.emit(RunTemplateKey, {
      template: this.props.data.template,
      data: this.props.data,
      dataId: this.props.data.name
    });
  }

  render() {
    return (
      <Col md={4} sm={6} xs={12} style={{ textAlign: "center" }}>
        <p>
          <Button onClick={e => this.runTemplate(e)}>
            { this.props.data.name } ({ this.props.data.template })
          </Button>
        </p>
      </Col>
    );
  }
}