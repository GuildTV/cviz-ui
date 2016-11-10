/*
* External Dependancies
*/

import React from 'react';
import {
  Grid, Row, Col,
  Table, Button
} from 'react-bootstrap';
import axios from 'axios';

/*
* React
*/
export class EditSceneList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scenes: []
    };
  }

  componentDidMount() {
    this.updateData();
  }

  componentWillUnmount(){
    this.setState({ scenes: [] });
  }

  updateData(){
    axios.get('/api/scenes')
    .then(res => {
      this.setState({ scenes: res.data || [] });
      console.log("Loaded " + res.data.length + " scenes");
    })
    .catch(err => {
      this.setState({ scenes: [] });
      alert("Get scenes error:", err);
    });
  }

  render() {
    const rows = this.state.scenes.map((scene) => {
      return (
        <tr key={ JSON.stringify(scene) }>
          <td>{ scene.name }</td>
          <td>{ scene.template }</td>
          <td>{ (scene.SceneData || []).length }</td>
          <td>{ scene.order }</td>
          <td>
            <a className="btn btn-primary" href={`#/scenes/edit/${scene.id}`}>Edit</a>&nbsp;
            <a className="btn btn-warning" href={`#/scenes/clone/${scene.id}`}>Clone</a>
          </td>
        </tr>
      );
    });

    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12}>
              <h2>
                Scenes&nbsp;&nbsp;
                <a className="btn btn-primary" href="#/scenes/create">Create</a>&nbsp;
                <Button bsStyle="success" onClick={() => this.updateData()}>Refresh</Button>
              </h2>
              <Table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Template</th>
                    <th>Datasets</th>
                    <th>Order</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                { rows }
                </tbody>
              </Table>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
