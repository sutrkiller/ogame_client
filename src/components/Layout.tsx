import * as React from 'react';
import {NavMenu} from './navigation/NavMenu';
import {ForgotPassword} from "./account/ForgotPassword";
import {
  ROUTE_FORGOT_PASSWORD, ROUTE_HOME, ROUTE_REGISTER, ROUTE_REGISTER_CONFIRM,
  ROUTE_RESET_PASSWORD, ROUTE_RUNNER,
  ROUTE_SIGN_IN, ROUTE_SIGN_OUT
} from "../config/routes";
import {Route, Switch} from "react-router-dom";
import {Home} from "./Home";
import {SignIn} from "./account/Sign-in";
import {SignOut} from "./account/Sign-out";
import {Register} from "./account/Register";
import {ResetPassword} from "./account/ResetPassword";
import * as classNames from 'classnames';
import {RouteComponentProps, withRouter} from "react-router";
import {Head} from "./Head";
import {NotificationContainer} from "./_shared/notifications/NotificationContainer";
import {RegisterConfirm} from "./account/RegisterConfirm";
import {Header} from "./Header";
import {IApplicationState, Dispatch} from "../store/index";
import {connect} from "react-redux";
import {StorageKey_Token} from "../utils/constants";
import {actionCreators} from "../store/Account";
import {PrivateRoute} from "./_shared/routes/PrivateRoute";
import {PublicRoute} from "./_shared/routes/PublicRoute";
import {RunnerMain} from "./runner/RunnerMain";
import {setAppElement} from "react-modal";

interface ILayoutOwnProps {
}

interface ILayoutDataProps {
  isAuthenticated: boolean;
  isAuthenticating: boolean;
}

interface ILayoutDispatchProps {
  getAccountDetails: (redirectAddress: string) => void;
}

type ILayoutRoutedProps = RouteComponentProps<ILayoutDataProps>

type ILayoutProps = ILayoutDataProps & ILayoutDispatchProps & ILayoutRoutedProps;


interface ILayoutState {
  isMenuOpen: boolean;
  isAccountMenuOpen: boolean;
}

class Layout extends React.Component<ILayoutProps, ILayoutState> {
  static displayName = "Layout";

  _navMenuRef: any;
  _navToggleRef: any;

  _accountMenuRef: any;
  _accountToggleRef: any;

  constructor(props: ILayoutProps) {
    super(props);

    this.state = {
      isMenuOpen: false,
      isAccountMenuOpen: false,
    }
  }

  componentDidMount() {
    if (!this.props.isAuthenticated && localStorage.getItem(StorageKey_Token) !== null) {
      this.props.getAccountDetails(this.props.location.pathname);
    }

    document.addEventListener('mouseup', this._handleClickOutsideMenu);
    document.addEventListener('touchend', this._handleClickOutsideMenu);
    //window.addEventListener('resize', this.props.onCloseMenu);
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this._handleClickOutsideMenu);
    document.removeEventListener('touchend', this._handleClickOutsideMenu);
    //window.removeEventListener('resize', this.props.onCloseMenu);
  }

  _onToggleMenu = () => {
    this.setState(prevState => {
      return {isMenuOpen: !prevState.isMenuOpen}
    });
  };

  _onToggleAccountMenu = () => {
    this.setState(prevState => ({isAccountMenuOpen: !prevState.isAccountMenuOpen}))
  };

  _onCloseMenu = () => {
    this.setState(() => ({isMenuOpen: false}));
  };

  _onCloseAccountMenu = () => {
    this.setState(() => ({isAccountMenuOpen: false}))
  };

  _handleClickOutsideMenu = (event: Event) => {
    //to close it when clicked outside the menu
    if (this.state.isMenuOpen && (this._navMenuRef && !this._navMenuRef.contains(event.target)) && (this._navToggleRef && !this._navToggleRef.contains(event.target))) {
      this._onCloseMenu();
    }
    else if (this.state.isAccountMenuOpen && (this._accountMenuRef && !this._accountMenuRef.contains(event.target)) && (this._accountToggleRef && !this._accountToggleRef.contains(event.target))) {
      this._onCloseAccountMenu();
    }


  };

  _onNavigation = (event: any) => {
    if (this.props.location.pathname === event.currentTarget.pathname) {
      event.preventDefault();
    }
    if (this.state.isMenuOpen) {
      this._onCloseMenu();
    }

    if (this.state.isAccountMenuOpen) {
      this._onCloseAccountMenu();
    }
  };

  render() {
    return <div className='container-fluid'>
      <Head />
      <Header isMenuOpen={this.state.isMenuOpen}
              isAccountMenuOpen={this.state.isAccountMenuOpen}
              isAuthenticated={this.props.isAuthenticated}
              isAuthenticating={this.props.isAuthenticating}
              onNavigation={this._onNavigation}
              onToggleMenu={this._onToggleMenu}
              onToggleAccountMenu={this._onToggleAccountMenu}
              setNavToggleRef={element => this._navToggleRef = element}
              setAccountMenuRef={element => this._accountMenuRef = element}
              setAccountToggleRef={element => this._accountToggleRef = element}
      />

      <NotificationContainer />

      <NavMenu isAuthenticated={this.props.isAuthenticated}
               isOpen={this.state.isMenuOpen}
               setMenuRef={el => this._navMenuRef = el}
               onNavigation={this._onNavigation}/>

      {/*More specific first*/}
      <section className={classNames("content-main", {"nav-open": this.state.isMenuOpen})}>
        <Switch>
          <Route exact path={ROUTE_HOME} component={Home}/>
          <PublicRoute isAuthenticated={this.props.isAuthenticated} path={ROUTE_SIGN_IN} component={SignIn}/>
          <PrivateRoute isAuthenticated={this.props.isAuthenticated} path={ROUTE_SIGN_OUT} component={SignOut}/>
          <PrivateRoute isAuthenticated={this.props.isAuthenticated} path={ROUTE_RUNNER} component={RunnerMain}/>
          <Route path={ROUTE_REGISTER_CONFIRM} component={RegisterConfirm}/>
          <PublicRoute isAuthenticated={this.props.isAuthenticated} path={ROUTE_REGISTER} component={Register}/>
          <PublicRoute isAuthenticated={this.props.isAuthenticated} path={ROUTE_FORGOT_PASSWORD} component={ForgotPassword}/>
          <PublicRoute isAuthenticated={this.props.isAuthenticated} path={ROUTE_RESET_PASSWORD} component={ResetPassword}/>
        </Switch>
      </section>
    </div>;
  }
}



const mapStateToProps = (state: IApplicationState): ILayoutDataProps => {
  return {
    isAuthenticated: state.account.isAuthenticated,
    isAuthenticating: state.account.isAuthenticating,
  };
};

const mapDispatchToProps = (dispatch: Dispatch): ILayoutDispatchProps => {
  return {
    getAccountDetails: (redirectAddress: string) => {dispatch(actionCreators.getDetails(redirectAddress))}
  };
};

const layoutContainer = connect(mapStateToProps, mapDispatchToProps as any)(Layout);
const LayoutRouted = withRouter<ILayoutOwnProps>(layoutContainer);

export {LayoutRouted as Layout}
