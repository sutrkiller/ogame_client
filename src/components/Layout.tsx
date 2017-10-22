import * as React from 'react';
import {NavMenu} from './NavMenu';
import {ForgotPassword} from "./account/ForgotPassword";
import {ROUTE_FORGOT_PASSWORD, ROUTE_HOME, ROUTE_REGISTER, ROUTE_SIGN_IN} from "../config/routes";
import {Route, Switch} from "react-router-dom";
import {Home} from "./Home";
import {SignIn} from "./account/Sign-in";
import {Register} from "./account/Register";

export class Layout extends React.Component<{}, {}> {
  static displayName = "Layout";

  render() {
    return <div className='container-fluid'>
      <div className='row no-gutters'>
        <div className='col-xs-0 col-md-3 col-max-250'>
          <NavMenu/>
        </div>
        <div className='col'>
          <div className="content-main">
            <Switch>
              <Route exact path={ROUTE_HOME} component={Home}/>
              <Route path={ROUTE_SIGN_IN} component={SignIn}/>
              <Route path={ROUTE_REGISTER} component={Register}/>
              <Route path={ROUTE_FORGOT_PASSWORD} component={ForgotPassword}/>
            </Switch>
          </div>
        </div>
      </div>
    </div>;
  }
}
