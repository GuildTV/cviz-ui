/*
* External Dependancies
*/

import React from 'react';
import axios from 'axios';
import {
  Grid, Row, Col,
  Input, Button
} from 'react-bootstrap';

import DropContainer from './EditPlaylistDropList';
import AddScene from './AddScene';

/*
* Variables
*/

const newPlaylist = {
        id: undefined,
        name: '', 
        PlaylistEntries: [],
      };

/*
* React
*/
export class EditPlaylist extends React.Component {
  constructor(props) {
    super(props);

    this.state = Object.assign({
      loaded: false,
      _mode: props.params.mode || "create"
    }, newPlaylist);
  }

  componentWillMount(){
    this.loadData();
  }

  componentWillUnmount(){
    this.setState(Object.assign({
      loaded: false,
      _mode: this.state._mode
    }, newPlaylist));
  }

  loadData(){
    const id = this.props.params.id;

    if (!id) {
      console.log("Update no id");
      return this.setState(Object.assign({
        loaded: true,
        _mode: this.state._mode
      }, newPlaylist));
    }

    axios.get(`/api/playlists/${id}`)
    .then(res => {
      const data = Object.assign({
        loaded: true,
        _mode: this.state._mode
      }, res.data || {});

      if (this.state._mode == "clone"){
        delete data.id;
        data.id2 = Math.random();
        for (let param of data.PlaylistEntries){
          param.id2 = Math.random();
          delete param.id;
        }
      }

      this.setState(data);
      console.log("Loaded playlist data:" + res.data.id);
    })
    .catch(err => {
      this.setState(Object.assign({
        loaded: false,
        _mode: this.state._mode
      }, newPlaylist));
      alert("Get playlists error: " + err);
    });
  }

  DoDelete(){
    const { id } = this.state;

    if (!id)
      return;

    axios.delete(`/api/playlists/${id}`)
      .catch(err => alert("Delete error: " + err));

    this.props.history.pushState(null, "/edit/playlists");
  }

  handleNameChange(e) {
    this.setState({name: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();

    const {name, id} = this.state;

    if (!name) {
      //todo error handling
      alert("Missing input data");
      return;
    }

    const scenes = this.dropList.child.getScenes();

    const compiledData = {
      id,
      name,
      scenes,
    };

    const method = id ? axios.post : axios.put;
    const url = id ? "/api/playlists/" + id : "/api/playlists";

    method(url, compiledData)
      .then(() => this.props.history.pushState(null, "/edit/playlists"))
      .catch(err => alert("Save error: " + err));
  }

  AddScene(){
    this.addModal.open();
  }

  addSceneDone(e){
    console.log("Added: ", e);
    this.dropList.child.addScene({
      id: e.id,
      name: e.name,
      template: e.template,
    });
  }

  render() {
    if (!this.state.loaded)
      return <div>Loading...</div>;

    const dropList = [];
    for(let sc of this.state.PlaylistEntries){
      dropList.push({
        id: sc.Scene.id,
        name: sc.Scene.name,
        template: sc.Scene.template
      });
    }

    return (
      <div>
        <AddScene ref={e => this.addModal = e} save={e => this.addSceneDone(e)} />

        <Grid>
          <Row>
            <Col xs={12}>
              <form className="form-horizontal" onSubmit={e => this.handleSubmit(e)}>
                <fieldset>
                  <legend>
                    Edit playlist&nbsp;&nbsp;
                    <a className="btn btn-warning" href="#/edit/playlists">Back to List</a>
                  </legend>

                  <Input type="text" label="ID" labelClassName="col-xs-2" wrapperClassName="col-xs-10" disabled value={this.state.id} />
                  <Input type="text" label="Name" labelClassName="col-xs-2" wrapperClassName="col-xs-10" 
                    onChange={e => this.handleNameChange(e)} value={this.state.name} />


                  <Input label="Scenes" labelClassName="col-xs-2" wrapperClassName="col-xs-10">
                    <DropContainer scenes={dropList} ref={e => this.dropList = e}/>
                  </Input>

                 
                  <Input label=" " labelClassName="col-xs-2" wrapperClassName="col-xs-10">
                    <Button type="submit" bsStyle="primary">Save</Button>&nbsp;
                    <Button bsStyle="info" onClick={() => this.AddScene()}>Add scene</Button>&nbsp;
                    { this.state.id ? <Button bsStyle="danger" onClick={() => this.DoDelete()}>Delete</Button> : "" }
                  </Input>
                </fieldset>
              </form>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
