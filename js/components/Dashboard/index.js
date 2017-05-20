/*
* External Dependancies
*/

import React from 'react';
import {
  Grid, Row, Col
} from 'react-bootstrap';
import axios from 'axios';

import SceneList from './Scenes/SceneList';
import Footer from './Footer';
import Playlist from './Playlist';

/*
* Variables
*/
const bodyStyle = {
  overflowY: "scroll",
  height: "calc(100vh - 72px - 200px)"
};

/*
* React
*/
export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: null,
    };
  }

  componentDidMount() {
    this.updateData();
  }

  updateData(){
    const id = 1;
    axios.get('/api/settings/' + id)
    .then(res => {
      this.setState({ settings: res.data || [] });
      console.log("Loaded settings for:", id);
    })
    .catch(err => {
      this.setState({ settings: {} });
      alert("Get settings error:", err);
    });
  }

  showFooter(){
    const { settings } = this.state;
    return settings ? settings.mode != "playlist" : false;
  }

  render() {
    const { settings } = this.state;
    if (!settings)
      return <div>Loading...</div>;

    if (settings.mode == "playlist")
      return <Playlist id={this.props.params.id} />;

    return (
      <div>
        <div style={bodyStyle}>
          <Grid>
            <Row>
              <Col xs={12}>
                <SceneList id={this.props.params.id} />
              </Col>
            </Row>
          </Grid>
        </div>
        { this.showFooter() ? <Footer /> : "" }
      </div>
    );
  }
}
