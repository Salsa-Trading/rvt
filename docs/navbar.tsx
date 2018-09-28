import * as React from 'react';
import {
  UncontrolledDropdown,
  DropdownItem,
  DropdownMenu,
  Navbar,
  NavbarBrand,
  Nav,
  DropdownToggle
} from 'reactstrap';

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
              <DropdownItem href='/examples/streamingTable'>Streaming Table</DropdownItem>
              <DropdownItem href='/examples/streamingGrid'>Streaming Grid</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </Navbar>
    );
  }
}
