/*
* External Dependancies
*/

import React from 'react';
import $ from 'jquery';
import {
  Grid, Row, Col, 
  Input, Button,
} from 'react-bootstrap';
import Socket from 'react-socket';

import SceneEntry from './SceneEntry';

/*
* Variables
*/
const GetScenesKey = "getScenes";
const UpdateSceneKey = "updateScene";

/*
* React
*/
export default class SceneList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scenes: [],
      filter: ""
    }
  }

  componentDidMount() {
    this.updateData();
  }

  updateData(){
    this.refs.sock.socket.emit(GetScenesKey);
  }

  handleStateChange(newData) {
    console.log("SCENES", newData);

    let scenes = this.state.scenes;
    newData.map(scene => {
      var index = scenes.findIndex(p => p.uid == scene.uid);
      if(index >= 0)
        scenes[index] = scene;
      else  
        scenes.push(scene);
    });

    console.log(scenes)
    this.setState({scenes});
  }

  filterNames(e){
    var filter = this.refs.filter.getValue();
    this.setState({ filter });
  }

  loadedScenes(scenes){
    this.setState({ scenes });
    console.log(scenes);
  }

  render() {
    var sceneList = this.state.scenes
      .filter((p) => SceneList.filterList(this.state.filter, p))
      .map((p) => <SceneEntry key={p.id} refs={this.refs} parent={this} data={p} />);

    $('.popover').remove();

    return (
      <div>
        <Socket.Event name={ GetScenesKey } callback={ this.loadedScenes.bind(this) } ref="sock"/>
        <Socket.Event name={ UpdateSceneKey } callback={ this.handleStateChange.bind(this) } />

        <form className="form-horizontal">
          <Input label="Search:" labelClassName="col-xs-2" wrapperClassName="col-xs-10">
            <Row>
              <Col xs={10}>
                <Input type="text" onChange={this.filterNames.bind(this)} ref="filter"  />
              </Col>
              <Col xs={2}>
                <Button bsStyle="success" onClick={this.updateData.bind(this)}>Refresh Data</Button>
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
