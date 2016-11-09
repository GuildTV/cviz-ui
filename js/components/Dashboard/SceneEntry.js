/*
* External Dependancies
*/

import React from 'react';
import Socket from 'react-socket';
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
    const { data } = this.props;
    console.log("Running template:", data.template);

    this.sock.socket.emit(RunTemplateKey, {
      template: data.template,
      data: data,
      dataId: data.name
    });
  }

  render() {
    const { name, template, colour } = this.props.data;
    const style = { backgroundColor: colour };

    return (
      <Col md={4} sm={6} xs={12} style={{ textAlign: "center" }}>
        <Socket.Event name={ RunTemplateKey } callback={() => {}} ref={e => this.sock = e} />
        <p>
          <Button onClick={e => this.runTemplate(e)} style={style}>
            <span style={{mixBlendMode: "difference", color: "white", fontWeight: "bold"}}>
              { name } ({ template })
            </span>
          </Button>
        </p>
      </Col>
    );
  }
}