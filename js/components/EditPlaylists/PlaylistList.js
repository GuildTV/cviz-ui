/*
* External Dependancies
*/

import React from 'react';
import {
  Grid, Row, Col,
  Table, Button
} from 'react-bootstrap';
import axios from 'axios';

/*
* React
*/
export class EditPlaylistList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playlists: [],
    };
  }

  componentDidMount() {
    this.updateData();
  }

  componentWillUnmount(){
    this.setState({
      playlists: [],
    });
  }

  updateData(){
    axios.get('/api/playlists')
    .then(res => {
      this.setState({ playlists: res.data || [] });
      console.log("Loaded " + res.data.length + " playlists");
    })
    .catch(err => {
      this.setState({ playlists: [] });
      alert("Get playlists error:", err);
    });
  }

  render() {
    const rows = this.state.playlists.map((playlist) => {
      return (
        <tr key={ JSON.stringify(playlist) }>
          <td>{ playlist.name }</td>
          <td>{ (playlist.PlaylistEntries || []).length }</td>
          <td>
            <a className="btn btn-primary" href={`#/edit/playlists/edit/${playlist.id}`}>Edit</a>&nbsp;
            <a className="btn btn-warning" href={`#/edit/playlists/clone/${playlist.id}`}>Clone</a>
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
                Playlists&nbsp;&nbsp;
                <a className="btn btn-primary" href="#/edit/playlists/create">Create</a>&nbsp;
                <Button bsStyle="success" onClick={() => this.updateData()}>Refresh</Button>&nbsp;
              </h2>
              <Table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Entries</th>
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
