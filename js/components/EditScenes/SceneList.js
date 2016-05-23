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

/*
* React
*/
export default class SceneList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {scenes: []}
  }

  handelInitialData(scenes) {
    this.setState({ scenes });
  }

  handleStateChange(newData) {
    console.log("SCENES", newData);

    let scenes = this.state.scenes;
    newData.map(scene => {
      var index = scenes.findIndex(s => s.uid == scene.uid);
      if(index >= 0)
        scenes[index] = scene;
      else  
        scenes.push(scene);
    });

    console.log(scenes)
    this.setState({scenes});
  }

  componentDidMount() {
    this.refs.sock.socket.emit(GetSceneKey)
  }

  render() {
    let rows = this.state.scenes.map((scene) => {
      console.log(scene);

      return (
        <tr key={ scene.id }>
          <td>{ scene.name }</td>
          <td>{ scene.template }</td>
          <td>{ scene.order }</td>
          <td>
            <Button onClick={this.props.onEdit} data={JSON.stringify(scene)}>Edit</Button>
          </td>
        </tr>
      );
    });

    return (
      <div>
        <Socket.Event name={ GetSceneKey } callback={ this.handelInitialData.bind(this) } ref="sock"/>
        <Socket.Event name={ UpdateSceneKey } callback={ this.handleStateChange.bind(this) } />
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Template</th>
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
