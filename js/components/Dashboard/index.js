/*
* External Dependancies
*/

import React from 'react';
import {
  Grid, Row, Col
} from 'react-bootstrap';

import SceneList from './SceneList';
import Footer from './Footer';

/*
* Variables
*/
const bodyStyle = {
  overflowY: "scroll",
  height: "calc(100vh - 72px - 200px)"
};

/*
* React
*/
export default class Dashboard extends React.Component {
  render() {
    return (
      <div>
        <div style={bodyStyle}>
          <Grid>
            <Row>
              <Col xs={12}>
                <SceneList />
              </Col>
            </Row>
          </Grid>
        </div>
        <Footer />
      </div>
    );
  }
}
