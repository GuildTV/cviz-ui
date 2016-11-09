/*
* External Dependancies
*/

import React from 'react';

import { Grid, Row, Col } from 'react-bootstrap';

/*
* Internal Dependancies
*/
import SceneList from './SceneList';
import Scene from './Scene';

/*
* React
*/
export default class EditScenes extends React.Component {
  LoadData(e){
    const data = JSON.parse(e.target.getAttribute('data'));

    console.log("Editing:", data.id);
    
    this.editElm.LoadForm(data);
  }

  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12}>
              <SceneList onEdit={e => this.LoadData(e)} />
              <Scene ref={e => this.editElm = e} />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
