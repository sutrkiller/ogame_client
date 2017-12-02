import * as React from 'react';
import {Redirect, Route, RouteProps} from "react-router-dom";
import {ROUTE_HOME, ROUTE_SIGN_IN} from "../../../config/routes";

export interface IPrivateRouteProps extends RouteProps {
  isAuthenticated: boolean;
}

export const PublicRoute: React.StatelessComponent<IPrivateRouteProps> = (props: IPrivateRouteProps) => {
  const {isAuthenticated, component, ...rest} = props;
  const Component = component as React.ComponentType<any>;

  return <Route {...rest} render={(renderProps) => isAuthenticated
    ? <Redirect to={{pathname: ROUTE_HOME, state: {from: renderProps.location}}} />
    : <Component {...renderProps} />} />
};