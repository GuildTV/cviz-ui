/*
* External Dependancies
*/

import React from 'react';
import {
  Row, Col, 
  Input, Button,
} from 'react-bootstrap';
import axios from 'axios';
import Socket from 'react-socket';

import SceneEntry from './SceneEntry';

/*
* Variables
*/
const RunTemplateKey = "runTemplate";

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

  filterNames(e){
    this.setState({ filter: e.target.value });
  }

  runTemplate(data) {
    this.sock.socket.emit(RunTemplateKey, data);
  }

  render() {
    const scenes = this.state.scenes
      .filter((p) => SceneList.filterList(this.state.filter, p));
    scenes.sort(SceneEntry.sortScenes);
    const sceneList = scenes.map((p) => <SceneEntry key={p.id} sock={this.sock} parent={this} runTemplate={d => this.runTemplate(d)} data={p} channelId={this.props.id} />);

    return (
      <div>
        <Socket.Event name={ RunTemplateKey } callback={() => {}} ref={e => this.sock = e} />

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
