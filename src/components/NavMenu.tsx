import * as React from 'react';
import {NavLink, Link} from 'react-router-dom';
import {Navbar, NavItem, NavbarToggler, Collapse, Nav} from 'reactstrap';
import {ROUTE_HOME, ROUTE_LOGIN} from "../routes";

interface NavMenuProps {

}

interface NavMenuState {
  isOpen: boolean;
}

export class NavMenu extends React.Component<NavMenuProps, NavMenuState> {
  static displayName = "NavMenu";

  wrapperRef: any;

  constructor(props: NavMenuProps) {
    super(props);
    this.state = {
      isOpen: false
    }
  }

  componentDidMount() {
    document.addEventListener('mouseup', this._handleClickOutside);
    document.addEventListener('touchend', this._handleClickOutside);
    window.addEventListener('resize', this._closeMenu);
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this._handleClickOutside);
    document.removeEventListener('touchend', this._handleClickOutside);
    window.removeEventListener('resize', this._closeMenu);
  }

  _setWrapperRef = (node: any) => {
    this.wrapperRef = node;
  };

  _handleClickOutside = (event: Event) => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState(_ => ({isOpen: false}));
    }
  };

  _closeMenu = () => {
    if (this.state.isOpen) {
      this.setState(_ => ({isOpen: false}));
    }
  };

  _onToggle = () => {
    this.setState(prevState => {
      return {isOpen: !prevState.isOpen}
    });
  };

  render() {
    return <div ref={this._setWrapperRef} className='main-nav col-max-250'>
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
              <NavLink to={ROUTE_LOGIN} className='nav-link'>
                <span className='fa fa-fw fa-user fa-lg'/> Login
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  }
}
