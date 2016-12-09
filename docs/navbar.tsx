import * as React from 'react';
import { Link } from 'react-router';
import { Navbar } from 'react-bootstrap';
// import { LinkContainer } from 'react-router-bootstrap';

export default class NavBar extends React.Component<{
}, {}> {
  public render() {

    return (
      <Navbar fluid>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to='/'>React-Virtual-Table</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
