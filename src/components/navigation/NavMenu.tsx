import * as React from 'react';
import {NavLink} from 'react-router-dom';
import {NavItem, Nav} from 'reactstrap';
import {ROUTE_HOME, ROUTE_SIGN_IN} from "../../config/routes";
import * as classNames from 'classnames';
import Tooltip from "rc-tooltip";

interface INavMenuDataProps {
  isOpen: boolean;
}

interface INavMenuDispatchProps {
  onNavigation: (event: any) => void;
  setInnerRef: (elementRef: any) => void;
}

type INavMenuProps = INavMenuDataProps & INavMenuDispatchProps;

interface INavMenuState {
}

export class NavMenu extends React.Component<INavMenuProps, INavMenuState> {
  static displayName = "NavMenu";

  render() {
    return (
      <nav ref={element => this.props.setInnerRef(element)}
           className={classNames("nav-main", {"nav-main-collapsed": !this.props.isOpen})}>
        <Nav navbar>
          <NavItem>
            {/*TODO: can use 'replace'*/}
            <Tooltip placement="right" trigger={['hover']} mouseEnterDelay={0.7} overlay={<span>Home</span>}
                     overlayClassName={classNames("nav-tooltip-overlay", {"nav-tooltip-overlay-hidden": this.props.isOpen})}>
              <NavLink exact to={ROUTE_HOME} className='nav-link' onClick={this.props.onNavigation}>
                <span className='fa fa-fw fa-home fa-lg'/> <span className="nav-link-text">Home</span>
              </NavLink>
            </Tooltip>
          </NavItem>
          <NavItem>
            <Tooltip placement="right" trigger={['hover']} mouseEnterDelay={0.7} overlay={<span>Sign in</span>}
                     overlayClassName={classNames("nav-tooltip-overlay", {"nav-tooltip-overlay-hidden": this.props.isOpen})}>
              <NavLink to={ROUTE_SIGN_IN} className='nav-link' onClick={this.props.onNavigation}>
                <span className='fa fa-fw fa-user fa-lg'/> <span className="nav-link-text">Sign in</span>
              </NavLink>
            </Tooltip>
          </NavItem>
        </Nav>
        {/*<ReactTooltip />*/}
      </nav>);
  }
}
