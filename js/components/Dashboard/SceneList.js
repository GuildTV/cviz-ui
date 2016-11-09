/*
* External Dependancies
*/

import React from 'react';
import {
  Row, Col, 
  Input, Button,
} from 'react-bootstrap';
import axios from 'axios';

import SceneEntry from './SceneEntry';

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

  render() {
    const sceneList = this.state.scenes
      .filter((p) => SceneList.filterList(this.state.filter, p))
      .map((p) => <SceneEntry key={p.id} sock={this.sock} parent={this} data={p} />);

    return (
      <div>
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
