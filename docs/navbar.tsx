import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  UncontrolledDropdown,
  DropdownItem,
  DropdownMenu,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  DropdownToggle
} from 'reactstrap';
import { autobind } from 'core-decorators';

export default class NavBar extends React.Component<
  {},
  {}
> {
  public render() {
    return (
      <Navbar light={true} color='light'>
        <NavbarBrand href='/'>
          React-Virtual-Table
        </NavbarBrand>
        <Nav navbar>
          <UncontrolledDropdown>
            <DropdownToggle caret>Examples</DropdownToggle>
            <DropdownMenu>
              <DropdownItem href='/examples/virtualTable'>Virtual Table</DropdownItem>
              <DropdownItem href='/examples/style'>Style</DropdownItem>
              <DropdownItem href='/examples/grid'>Grid</DropdownItem>
              <DropdownItem href='/examples/virtualGrid'>Virtual Grid</DropdownItem>
              <DropdownItem href='/examples/customGrid'>Custom Grid</DropdownItem>
              <DropdownItem href='/examples/virtualScroller'>Virtual Scroller</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </Navbar>
    );
  }
}
