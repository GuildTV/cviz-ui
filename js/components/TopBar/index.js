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
* Variables
*/
const RunTemplateKey = "runTemplate";

/*
* React
*/
export default class TopBar extends React.Component {

  runTemplate(e){
    let target = e.target;
    if(!e.target.hasAttribute('data-id'))
      target = target.parentElement;

    console.log("Running template:", target.getAttribute('data-id'));

    this.sock.socket.emit(RunTemplateKey, {
      template: target.getAttribute('data-id'),
      data: target.getAttribute('data-data'),
      dataId: target.getAttribute('data-key')
    });
  }

  render() {
    // <MenuItem eventKey={1.2} href="#/playlist">Playlist</MenuItem>
    return (
      <Navbar inverse>
        <Socket.Socket />
        <Socket.Event name="test" ref={e => this.sock = e} />
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
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
