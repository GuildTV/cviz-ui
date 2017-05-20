/*
* External Dependancies
*/

import React from 'react';
import {
  Col,
  Button
} from 'react-bootstrap';

/*
* React
*/

export default class SceneEntry extends React.Component {
  runTemplate(){
    const { data } = this.props;
    console.log("Running template:", data.template);

    this.props.runTemplate({
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

  static sortScenes(a, b){
    if (a.order < b.order)
      return -1;
    if (a.order > b.order)
      return 1;

    if (a.name < b.name)
      return -1;
    if (a.name > b.name)
      return 1;

    return 0;
  }
}