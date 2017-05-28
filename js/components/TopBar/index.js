/*
* External Dependancies
*/
import React from 'react';
import Socket from 'react-socket';
import axios from 'axios';


import { 
  MenuItem,
  Navbar,
  Nav,
  NavDropdown
} from 'react-bootstrap';

/*
* React
*/
export default class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: [],
    };
  }

  componentDidMount() {
    this.updateData();
  }

  updateData(){
    axios.get('/api/settings')
    .then(res => {
      this.setState({ settings: res.data || [] });
      console.log("Loaded nav settings");
    })
    .catch(err => {
      this.setState({ settings: [] });
      alert("Get settings error:", err);
    });
  }

  render() {
    const items = this.state.settings.map(s => <MenuItem key={s.id} eventKey={1.2} href={"#/dashboard/"+s.id}>{s.id}</MenuItem>)
    return (
      <Navbar inverse>
        <Socket.Socket />
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">C-Viz WebUI</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            {items}
          </Nav>
          <Nav pullRight>
            <NavDropdown eventKey={1} title="Pages" id="basic-nav-dropdown">
              <MenuItem eventKey={1.1} href="#">Dashboard</MenuItem>
              <MenuItem eventKey={1.3} href="#/edit/settings">Settings</MenuItem>
              <MenuItem eventKey={1.4} href="#/edit/scenes">Scenes</MenuItem>
              <MenuItem eventKey={1.5} href="#/edit/playlists">Playlists</MenuItem>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
