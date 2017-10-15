import * as React from 'react';
import {NavLink, Link} from 'react-router-dom';
import {Navbar, NavItem, NavbarBrand, NavbarToggler, Collapse, Nav} from 'reactstrap';
import {ROUTE_HOME} from "../routes";

interface StateProps {
  isOpen: boolean;
}

export class NavMenu extends React.Component<{}, StateProps> {
  constructor() {
    super();
    this.state = {isOpen: false}
  }

  _onToggle = () => {
    this.setState(prevState => {
      return {isOpen: !prevState.isOpen}
    });
  };

  render() {
    return <div className='main-nav col-max-250'>
      <Navbar color="dark" dark expand="md">
        <Link className="navbar-brand" to={ROUTE_HOME}>OGame</Link>
        <NavbarToggler onClick={this._onToggle}/>
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              {/*TODO: can use 'replace'*/}
              <NavLink exact to={ROUTE_HOME} className='nav-link'>
                <span className='fa fa-fw fa-home fa-lg'/> Home
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  }
}
