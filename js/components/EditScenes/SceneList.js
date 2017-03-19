/*
* External Dependancies
*/

import React from 'react';
import {
  Grid, Row, Col,
  Table, Button, Input
} from 'react-bootstrap';
import axios from 'axios';

/*
* React
*/
export class EditSceneList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scenes: [],
      selectedScenes: [],
    };
  }

  componentDidMount() {
    this.updateData();
  }

  componentWillUnmount(){
    this.setState({
      scenes: [],
      selectedScenes: [],
    });
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

  deleteSelected(){
    if (this.state.selectedScenes.length == 0)
      return;

    if(!window.confirm("Are you sure you want to delete " + this.state.selectedScenes.length + " scenes?"))
      return;

    axios.post('/api/scenes/bulk-delete', {
      ids: this.state.selectedScenes
    })
    .then(res => {
      this.setState({ 
        scenes: res.data || [],
        selectedScenes: []
      });
      console.log("Loaded " + res.data.length + " scenes");
    })
    .catch(err => {
      this.setState({ selectedScenes: [] });
      alert("Get scenes error:", err);
    });
  }

  handleRowCheckbox(e){
    const id = e.target.getAttribute('data-id');
    const selectedScenes = this.state.selectedScenes.slice();

    if (e.target.checked) {
      selectedScenes.push(id)
    } else {
      for(let i=0; i<selectedScenes.length; i++){
        if(selectedScenes[i] == id){
          selectedScenes.splice(i,1);
          break;
        }
      }
    }

    this.setState({ selectedScenes });
  }

  render() {
    const rows = this.state.scenes.map((scene) => {
      return (
        <tr key={ JSON.stringify(scene) }>
          <td><Input type="checkbox" onChange={e => this.handleRowCheckbox(e)} checked={this.state.selectedScenes.indexOf(scene.id+"") >= 0} data-id={scene.id} /></td>
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
                <Button bsStyle="success" onClick={() => this.updateData()}>Refresh</Button>&nbsp;
                <Button bsStyle="danger" onClick={() => this.deleteSelected()} disabled={this.state.selectedScenes.length==0}>Delete</Button>
              </h2>
              <Table>
                <thead>
                  <tr>
                    <th></th>
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
