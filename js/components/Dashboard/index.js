/*
* External Dependancies
*/

import React from 'react';
import {
  Grid, Row, Col,
  Tabs, Tab 
} from 'react-bootstrap';

import PeopleList from './PeopleList';
import Boards from './Boards';

/*
* Variables
*/

/*
* React
*/
export default class Dashboard extends React.Component {
  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <Tabs animation={false}>
              <Tab eventKey={1} title="People">
                <PeopleList />
              </Tab>
              <Tab eventKey={2} title="Boards">
                <Boards />
              </Tab>
              <Tab eventKey={3} title="Tab 3" disabled>Tab 3 content</Tab>
            </Tabs>
          </Col>
        </Row>
      </Grid>
    );
  }
}