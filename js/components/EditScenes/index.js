/*
* External Dependancies
*/

import React from 'react';

import { Grid, Row, Col } from 'react-bootstrap';

/*
* Internal Dependancies
*/
import SceneList from './SceneList'
import Scene from './Scene'

/*
* Variables
*/

/*
* React
*/
export default class EditScenes extends React.Component {
  LoadData(e){
    var data = e.target.getAttribute('data');
    data = JSON.parse(data);

    console.log("Editing:", data.id);
    
    this.refs.edit.LoadForm(data);
  }

  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12}>
              <SceneList onEdit={this.LoadData.bind(this)} ref="list" />
              <Scene ref="edit" />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
