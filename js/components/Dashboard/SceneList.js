/*
* External Dependancies
*/

import React from 'react';
import {
  Row, Col, 
  Input, Button,
} from 'react-bootstrap';
import Socket from 'react-socket';

import SceneEntry from './SceneEntry';

/*
* Variables
*/
const GetScenesKey = "getScenes";
const UpdateSceneKey = "updateScene";
const DeleteSceneKey = "deleteScene";

/*
* React
*/
export default class SceneList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scenes: [],
      filter: ""
    };
  }

  componentDidMount() {
    this.updateData();
  }

  updateData(){
    this.sock.socket.emit(GetScenesKey);
  }

  handleStateChange(newData) {
    console.log("SCENES", newData);

    const scenes = this.state.scenes;
    newData.map(scene => {
      const index = scenes.findIndex(p => p.uid == scene.uid);
      if(index >= 0)
        scenes[index] = scene;
      else  
        scenes.push(scene);
    });

    console.log(scenes);
    this.setState({scenes});
  }

  handleDelete(id){
    const scenes = this.state.scenes.filter(s => s.id != id);
    this.setState({ scenes });
  }

  filterNames(e){
    this.setState({ filter: e.target.value });
  }

  loadedScenes(scenes){
    this.setState({ scenes });
    console.log(scenes);
  }

  render() {
    const sceneList = this.state.scenes
      .filter((p) => SceneList.filterList(this.state.filter, p))
      .map((p) => <SceneEntry key={p.id} sock={this.sock} parent={this} data={p} />);

    return (
      <div>
        <Socket.Event name={ GetScenesKey } callback={e => this.loadedScenes(e)} ref={e => this.sock = e} />
        <Socket.Event name={ UpdateSceneKey } callback={e => this.handleStateChange(e)} />
        <Socket.Event name={ DeleteSceneKey } callback={e => this.handleDelete(e)} />

        <form className="form-horizontal">
          <Input label="Search:" labelClassName="col-xs-2" wrapperClassName="col-xs-10">
            <Row>
              <Col xs={10}>
                <Input type="text" onChange={e => this.filterNames(e)} />
              </Col>
              <Col xs={2}>
                <Button bsStyle="success" onClick={() => this.updateData()}>Refresh Data</Button>
              </Col>
            </Row>
          </Input>
        </form>
        <hr />

        { sceneList }
      </div>    
    );
  }

  static filterList(filter, p){
    if(filter == "")
      return true;

    filter = filter.toLowerCase();

    if(p.name.toLowerCase().indexOf(filter) != -1)
      return true;

    return false;
  }
}
