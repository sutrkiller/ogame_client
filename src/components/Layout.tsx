import * as React from 'react';
import {NavMenu} from './navigation/NavMenu';
import {ForgotPassword} from "./account/ForgotPassword";
import {
  ROUTE_FORGOT_PASSWORD, ROUTE_HOME, ROUTE_REGISTER, ROUTE_REGISTER_CONFIRM, ROUTE_REGISTER_CONFIRM_SUCCESS,
  ROUTE_REGISTER_SUCCESS,
  ROUTE_SIGN_IN
} from "../config/routes";
import {NavLink, Route, Switch} from "react-router-dom";
import {Home} from "./Home";
import {SignIn} from "./account/Sign-in";
import {Register} from "./account/Register";
import * as classNames from 'classnames';
import {NavToggler} from "./navigation/NavToggler";
import {RouteComponentProps, withRouter} from "react-router";
import {Head} from "./Head";
import {NotificationContainer} from "./_shared/notifications/NotificationContainer";
import {RegisterSuccess} from "./account/RegisterSuccess";
import {RegisterConfirm} from "./account/RegisterConfirm";
import {RegisterConfirmSucess} from "./account/RegisterConfirmSuccess";

interface ILayoutDataProps {
}

interface ILayoutDispatchProps {
}

type ILayoutProps = ILayoutDataProps & ILayoutDispatchProps;
type ILayoutRoutedProps = RouteComponentProps<ILayoutProps>

interface ILayoutState {
  isMenuOpen: boolean;
}

class Layout extends React.Component<ILayoutRoutedProps, ILayoutState> {
  static displayName = "Layout";

  navMenuRef: any;
  navToggleRef: any;

  constructor(props: ILayoutRoutedProps) {
    super(props);

    this.state = {
      isMenuOpen: false
    }
  }

  componentDidMount() {
    document.addEventListener('mouseup', this._handleClickOutside);
    document.addEventListener('touchend', this._handleClickOutside);
    //window.addEventListener('resize', this.props.onCloseMenu);
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this._handleClickOutside);
    document.removeEventListener('touchend', this._handleClickOutside);
    //window.removeEventListener('resize', this.props.onCloseMenu);
  }

  _onToggleMenu = () => {
    this.setState(prevState => {
      return {isMenuOpen: !prevState.isMenuOpen}
    });
  };

  _onCloseMenu = () => {
    this.setState(prevState => ({isMenuOpen: false}));
  };

  _handleClickOutside = (event: Event) => {
    //to close it when clicked outside the menu
    if (this.state.isMenuOpen && (this.navMenuRef && !this.navMenuRef.contains(event.target)) && (this.navToggleRef && !this.navToggleRef.contains(event.target))) {
      this._onCloseMenu();
    }
  };

  _onNavigation = (event:any) => {
    if (this.props.location.pathname === event.currentTarget.pathname) {
      event.preventDefault();
    }
    this._onCloseMenu();
  };

  render() {
    return <div className='container-fluid'>
      <Head />
      <header className="main-header">
        <NavToggler isOpen={this.state.isMenuOpen} onToggle={this._onToggleMenu} setInnerRef={element => this.navToggleRef = element}/>
        <div className="header-part-right">
          <strong>
            <NavLink to={ROUTE_SIGN_IN} className='nav-link' onClick={this._onNavigation}>
              <span className='fa fa-fw fa-user fa-lg'/> <span className="nav-link-account">Register / sign in</span>
            </NavLink>
          </strong>
        </div>
        <div className={classNames("header-title", {"nav-open": this.state.isMenuOpen})}>
          <h1>
            <NavLink exact to={ROUTE_HOME} onClick={this._onNavigation}>Title</NavLink>
          </h1>
        </div>
      </header>

      <NotificationContainer />

      <NavMenu setInnerRef={el => this.navMenuRef = el}
               isOpen={this.state.isMenuOpen}
               onNavigation={this._onNavigation}/>

      {/*More specific first*/}
      <section className={classNames("content-main", {"nav-open": this.state.isMenuOpen})}>
        <Switch>
          <Route exact path={ROUTE_HOME} component={Home}/>
          <Route path={ROUTE_SIGN_IN} component={SignIn}/>
          <Route path={ROUTE_REGISTER_CONFIRM_SUCCESS} component={RegisterConfirmSucess}/>
          <Route path={ROUTE_REGISTER_CONFIRM} component={RegisterConfirm}/>
          <Route path={ROUTE_REGISTER} component={Register}/>
          <Route path={ROUTE_FORGOT_PASSWORD} component={ForgotPassword}/>
        </Switch>
      </section>
    </div>;
  }
}

const LayoutRouted = withRouter<ILayoutProps>(Layout);

export {LayoutRouted as Layout}
