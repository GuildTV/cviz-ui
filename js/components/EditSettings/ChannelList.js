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
export class EditChannelList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: [],
    };
  }

  componentDidMount() {
    this.updateData();
  }

  componentWillUnmount(){
    this.setState({
      settings: [],
    });
  }

  updateData(){
    axios.get('/api/settings')
    .then(res => {
      this.setState({ settings: res.data || [] });
      console.log("Loaded settings for " + res.data.length + " channels");
    })
    .catch(err => {
      this.setState({ settings: [] });
      alert("Get settings error:", err);
    });
  }


  render() {
    const rows = this.state.settings.map((channel) => {
      return (
        <tr key={ channel.id }>
          <td>{ channel.id }</td>
          <td>{ channel.mode }</td>
          <td>
            <a className="btn btn-primary" href={`#/edit/settings/${channel.id}`}>Edit</a>&nbsp;
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
                Channels&nbsp;&nbsp;
                <Button bsStyle="success" onClick={() => this.updateData()}>Refresh</Button>&nbsp;
              </h2>
              <Table>
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Mode</th>
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
