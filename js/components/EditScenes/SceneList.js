/*
* External Dependancies
*/

import React from 'react';
import Socket from 'react-socket';
import base64 from 'base-64';
import {
  Grid, Row, Col,
  Table
} from 'react-bootstrap';

/*
* Variables
*/

const GetSceneKey = "getScenes";
const UpdateSceneKey = "updateScene";
const DeleteSceneKey = "deleteScene";

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

  handelInitialData(scenes) {
    this.setState({ scenes });
  }

  handleStateChange(newData) {
    console.log("SCENES", newData);

    const scenes = this.state.scenes;
    newData.map(scene => {
      const index = scenes.findIndex(s => s.id == scene.id);
      if(index >= 0)
        scenes[index] = scene;
      else  
        scenes.push(scene);
    });

    this.setState({scenes});
  }

  handleDelete(id){
    const scenes = this.state.scenes.filter(s => s.id != id);
    this.setState({ scenes });
  }

  componentDidMount() {
    this.sock.socket.emit(GetSceneKey);
  }

  render() {
    const rows = this.state.scenes.map((scene) => {
      console.log(scene);
      const editData = base64.encode(JSON.stringify(scene));
      const cloneRaw = Object.assign({}, scene);
      delete cloneRaw.id;
      const cloneData = base64.encode(JSON.stringify(cloneRaw));

      return (
        <tr key={ scene.name }>
          <td>{ scene.name }</td>
          <td>{ scene.template }</td>
          <td>{ (scene.SceneData || []).length }</td>
          <td>{ scene.order }</td>
          <td>
            <a className="btn btn-primary" href={`#/scenes/edit/${editData}`}>Edit</a>&nbsp;
            <a className="btn btn-warning" href={`#/scenes/edit/${cloneData}`}>Clone</a>
          </td>
        </tr>
      );
    });

    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12}>
              <Socket.Event name={ GetSceneKey } callback={e => this.handelInitialData(e)} ref={e => this.sock = e} />
              <Socket.Event name={ UpdateSceneKey } callback={e => this.handleStateChange(e)} />
              <Socket.Event name={ DeleteSceneKey } callback={e => this.handleDelete(e)} />
              <h2>
                Scenes&nbsp;&nbsp;
                <a className="btn btn-success" href="#/scenes/edit/==">Create</a>
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
