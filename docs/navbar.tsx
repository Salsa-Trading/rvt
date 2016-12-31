import * as React from 'react';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
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
          <Nav>
            <LinkContainer to='/examples'>
              <NavItem>
                Examples
              </NavItem>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
