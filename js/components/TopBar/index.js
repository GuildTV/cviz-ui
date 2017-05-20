/*
* External Dependancies
*/
import React from 'react';
import Socket from 'react-socket';

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

  render() {
    // <MenuItem eventKey={1.2} href="#/playlist">Playlist</MenuItem>
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
          <Nav pullRight>
            <NavDropdown eventKey={1} title="Pages" id="basic-nav-dropdown">
              <MenuItem eventKey={1.1} href="#">Dashboard</MenuItem>
              <MenuItem eventKey={1.3} href="#/scenes">Scenes</MenuItem>
              <MenuItem eventKey={1.3} href="#/edit/playlists">Playlists</MenuItem>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
