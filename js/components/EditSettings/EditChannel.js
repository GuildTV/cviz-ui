/*
* External Dependancies
*/

import React from 'react';
import axios from 'axios';
import {
  Grid, Row, Col,
  Input, Button
} from 'react-bootstrap';
import Select from 'react-select';

/*
* React
*/
export class EditChannel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
    };
  }

  componentWillMount(){
    this.loadData();
  }

  componentWillUnmount(){
    this.setState({
      loaded: false
    });
  }

  loadData(){
    const id = this.props.params.id;

    axios.get(`/api/settings/${id}`)
    .then(res => {
      const data = Object.assign({
        loaded: true,
      }, res.data || {});

      this.setState(data);
      console.log("Loaded channel settings:" + res.data.id);
    })
    .catch(err => {
      this.setState({
        loaded: false,
      });
      alert("Get channel settings error: " + err);
    });
  }

  handleModeChange(e){
    const newMode = e.target.querySelector("option:checked").value;
    this.setState({ mode: newMode });
  }

  handlePlaylistId(e){
    this.setState({ playlistId: e.value });
  }

  handleSubmit(e) {
    e.preventDefault();

    const {id, mode, playlistId} = this.state;

    if (!mode) {
      //todo error handling
      alert("Missing input data");
      return;
    }


    const compiledData = {
      id,
      mode,
      playlistId,
    };

    axios.post("/api/settings/" + id, compiledData)
      .then(() => this.props.history.pushState(null, "/edit/settings"))
      .catch(err => alert("Save error: " + err));
  }

  render() {
    if (!this.state.loaded)
      return <div>Loading...</div>;

    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12}>
              <form className="form-horizontal" onSubmit={e => this.handleSubmit(e)}>
                <fieldset>
                  <legend>
                    Edit channel { this.state.id }&nbsp;&nbsp;
                    <a className="btn btn-warning" href="#/edit/settings">Back to List</a>
                  </legend>

                  <Input label="Mode" labelClassName="col-xs-2" wrapperClassName="col-xs-10" type="select" 
                    onChange={e => this.handleModeChange(e)} value={this.state.mode}>
                    <option value="scene">Scene</option>
                    <option value="playlist">Playlist</option>
                  </Input>

                  {
                    this.state.mode == "playlist"
                     ? <Input label="Playlist" labelClassName="col-xs-2" wrapperClassName="col-xs-10">
                         <PlaylistSelect value={this.state.playlistId} onChange={e => this.handlePlaylistId(e)} />
                       </Input>
                     : ""
                  }

                  <Input label=" " labelClassName="col-xs-2" wrapperClassName="col-xs-10">
                    <Button type="submit" bsStyle="primary">Save</Button>&nbsp;
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

class PlaylistSelect extends React.Component {
  loadValues(){
    return axios.get('/api/playlists').then(res => {
      console.log("Loaded playlists list:", res.data.length, "entries");

      const options = res.data.map(u => ({ 
        value: u.id, 
        label: u.name,
      }));

      return {
        complete: true,
        options
      };
    }).catch(err => {
      console.log("Failed loading playlists list:", err);

      return {
        options: []
      };
    });
  }

  render(){
    const { onChange, value } = this.props;

    return <Select.Async
              onChange={onChange}
              value={value}
              loadOptions={() => this.loadValues()} />;
  }
}
