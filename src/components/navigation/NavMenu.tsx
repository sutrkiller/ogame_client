import * as React from 'react';
import {NavLink} from 'react-router-dom';
import {NavItem, Nav} from 'reactstrap';
import {ROUTE_HOME, ROUTE_RUNNER, ROUTE_SETTINGS, ROUTE_SIGN_IN, ROUTE_SIGN_OUT} from "../../config/routes";
import * as classNames from 'classnames';
import Tooltip from "rc-tooltip";
import {RunnerIcon} from "../_shared/icons/runner-icon";

interface INavMenuDataProps {
  isOpen: boolean;
  isAuthenticated: boolean;
}

interface INavMenuDispatchProps {
  onNavigation: (event: any) => void;
  setMenuRef: (elementRef: any) => void;
}

type INavMenuProps = INavMenuDataProps & INavMenuDispatchProps;

interface INavMenuState {
}

export class NavMenu extends React.Component<INavMenuProps, INavMenuState> {
  static displayName = "NavMenu";

  render() {
    return (
      <nav ref={element => this.props.setMenuRef(element)}
           className={classNames("nav-main", {"nav-main-collapsed": !this.props.isOpen})}>
        <Nav navbar>
          <NavItem>
            <Tooltip placement="right" trigger={['hover']} mouseEnterDelay={0.7} overlay={<span>Home</span>}
                     overlayClassName={classNames("nav-tooltip-overlay", {"nav-tooltip-overlay-hidden": this.props.isOpen})}>
              <NavLink exact to={ROUTE_HOME} className='nav-link' onClick={this.props.onNavigation}>
                <span className='fas fa-fw fa-home fa-lg'/> <span className="nav-link-text">Home</span>
              </NavLink>
            </Tooltip>
          </NavItem>
          {!this.props.isAuthenticated ? <noscript/> :
            <NavItem>
              <Tooltip placement="right" trigger={['hover']} mouseEnterDelay={0.7} overlay={<span>Runner</span>}
                       overlayClassName={classNames("nav-tooltip-overlay", {"nav-tooltip-overlay-hidden": this.props.isOpen})}>
                <NavLink exact to={ROUTE_RUNNER} className='nav-link' onClick={this.props.onNavigation}>
                  <span style={{paddingRight: '4px'}}>{RunnerIcon}</span><span className="nav-link-text">Runner</span>
                </NavLink>
              </Tooltip>
            </NavItem>
          }
          <NavItem className={classNames("large-screen-hidden", {"display-none": !this.props.isAuthenticated})}>
            <Tooltip placement="right" trigger={['hover']} mouseEnterDelay={0.7} overlay={<span>Account settings</span>}
                     overlayClassName={classNames("nav-tooltip-overlay", {"nav-tooltip-overlay-hidden": this.props.isOpen})}>
              <NavLink to={ROUTE_SETTINGS} className='nav-link' onClick={this.props.onNavigation}>
                <span className='fas fa-fw fa-cog fa-lg'/> <span className="nav-link-text">Account settings</span>
              </NavLink>
            </Tooltip>
          </NavItem>
          <NavItem className="large-screen-hidden">
            <Tooltip placement="right" trigger={['hover']} mouseEnterDelay={0.7} overlay={<span>Sign {this.props.isAuthenticated ? 'out' : 'in'}</span>}
                     overlayClassName={classNames("nav-tooltip-overlay", {"nav-tooltip-overlay-hidden": this.props.isOpen})}>
              <NavLink to={this.props.isAuthenticated ? ROUTE_SIGN_OUT : ROUTE_SIGN_IN} className='nav-link' onClick={this.props.onNavigation}>
                <span className='fas fa-fw fa-user fa-lg'/> <span className="nav-link-text">Sign {this.props.isAuthenticated ? 'out' : 'in'}</span>
              </NavLink>
            </Tooltip>
          </NavItem>

        </Nav>
      </nav>);
  }
}
