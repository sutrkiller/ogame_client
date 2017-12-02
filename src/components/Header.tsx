import * as React from 'react';
import {NavLink} from "react-router-dom";
import {ROUTE_SETTINGS, ROUTE_SIGN_IN, ROUTE_SIGN_OUT} from "../config/routes";
import {ROUTE_HOME} from "../config/routes";
import {NavToggler} from "./navigation/NavToggler";
import * as classNames from 'classnames';

export interface IHeaderDataProps {
  isMenuOpen: boolean;
  isAccountMenuOpen: boolean;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
}

export interface IHeaderDispatchProps {
  setNavToggleRef: (elementRef: any) => void;
  setAccountMenuRef: (elementRef: any) => void;
  setAccountToggleRef: (elementRef: any) => void;


  onToggleMenu: () => void;
  onToggleAccountMenu: () => void;
  onNavigation: (event: any) => void;
}

export type IHeaderProps = IHeaderDataProps & IHeaderDispatchProps;

class Header extends React.PureComponent<IHeaderProps, {}> {
  static displayName = 'Header';

  _renderRightPart = () => {
    if (this.props.isAuthenticating) {
      return (
        <div className="content-right-auth">
          <span className="fa fa-spinner fa-spin fa-lg fa-fw"/>
        </div>
      );
    }

    if (!this.props.isAuthenticated) {
      return (
        <strong className='account-auth-not'>
          <NavLink to={ROUTE_SIGN_IN} className='nav-link' onClick={this.props.onNavigation}>
            <span className='fa fa-fw fa-user fa-lg'/> <span className="nav-link-account">Register / sign in</span>
          </NavLink>
        </strong>
      );
    }

    return (
      <div className={classNames('dropdown',{'dropdown-open': this.props.isAccountMenuOpen})}>
        <button ref={element => this.props.setAccountToggleRef(element)} className="dropdown-button" onClick={this.props.onToggleAccountMenu}>
          <span>My account</span> <span className="fa fa-fw fa-chevron-down"/>
        </button>
        <div ref={element => this.props.setAccountMenuRef(element)} className="dropdown-content">
          <NavLink exact to={ROUTE_SETTINGS} className='nav-link' onClick={this.props.onNavigation}>
            <span className='fa fa-fw fa-cog fa-lg'/> <span className="nav-link-text">Settings</span>
          </NavLink>
          <NavLink exact to={ROUTE_SIGN_OUT} className='nav-link' onClick={this.props.onNavigation}>
            <span className='fa fa-fw fa-power-off fa-lg'/> <span className="nav-link-text">Sign out</span>
          </NavLink>
        </div>
      </div>
    );
  };

  render() {
    const rightPart = this._renderRightPart();

    return (
      <header className="main-header">
        <NavToggler isOpen={this.props.isMenuOpen} onToggle={this.props.onToggleMenu}
                    setInnerRef={this.props.setNavToggleRef}/>


        <div className={classNames("header-title", {"nav-open": this.props.isMenuOpen})}>
          <h1>
            <NavLink exact to={ROUTE_HOME} onClick={this.props.onNavigation}>Title</NavLink>
          </h1>
        </div>

        <div className="header-part-right">
          <div className="content-right small-screen-hidden">
            {rightPart}
          </div>
        </div>
      </header>
    );
  }
}

export {Header}
// export const Header: React.StatelessComponent<IHeaderProps> = (props: IHeaderProps) => {
//   return (
//     <header className="main-header">
//       <NavToggler isOpen={props.isMenuOpen} onToggle={props.onToggleMenu}
//                   setInnerRef={props.setRefToMenuPart}/>
//       <div className="header-part-right">
//         <strong>
//           <NavLink to={ROUTE_SIGN_IN} className='nav-link' onClick={props.onNavigation}>
//             <span className='fa fa-fw fa-user fa-lg'/> <span className="nav-link-account">Register / sign in</span>
//           </NavLink>
//         </strong>
//       </div>
//       <div className={classNames("header-title", {"nav-open": props.isMenuOpen})}>
//         <h1>
//           <NavLink exact to={ROUTE_HOME} onClick={props.onNavigation}>Title</NavLink>
//         </h1>
//       </div>
//     </header>
//   );
// };