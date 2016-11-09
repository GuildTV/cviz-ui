/*
* External Dependancies
*/

import React from 'react';
import Socket from 'react-socket';

import { Table, Button } from 'react-bootstrap';

/*
* Variables
*/

const GetSceneKey = "getScenes";
const UpdateSceneKey = "updateScene";
const DeleteSceneKey = "deleteScene";

/*
* React
*/
export default class SceneList extends React.Component {
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
      return (
        <tr key={ JSON.stringify(scene) }>
          <td>{ scene.name }</td>
          <td>{ scene.template }</td>
          <td>{ (scene.SceneData || []).length }</td>
          <td>{ scene.order }</td>
          <td>
            <Button onClick={e => this.props.onEdit(e)} data={JSON.stringify(scene)}>Edit</Button>
          </td>
        </tr>
      );
    });

    return (
      <div>
        <Socket.Event name={ GetSceneKey } callback={e => this.handelInitialData(e)} ref={e => this.sock = e} />
        <Socket.Event name={ UpdateSceneKey } callback={e => this.handleStateChange(e)} />
        <Socket.Event name={ DeleteSceneKey } callback={e => this.handleDelete(e)} />
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
      </div>
    );
  }
}
