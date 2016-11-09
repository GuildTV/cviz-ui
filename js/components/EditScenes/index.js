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
  LoadData(e, clone){
    const data = JSON.parse(e.target.getAttribute('data'));
    
    if (clone)
      data.id = undefined;

    console.log("Editing:", data.id);
    
    this.editElm.LoadForm(data);
  }

  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12}>
              <SceneList onEdit={(e, c) => this.LoadData(e, c)} />
              <Scene ref={e => this.editElm = e} />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
