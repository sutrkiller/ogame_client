import * as React from 'react';
import {Redirect, Route, RouteProps} from "react-router-dom";
import {ROUTE_SIGN_IN} from "../../../config/routes";

export interface IPrivateRouteProps extends RouteProps {
  isAuthenticated: boolean;
  componentProps?: any;
}

export const PrivateRoute: React.StatelessComponent<IPrivateRouteProps> = (props: IPrivateRouteProps) => {
  const {isAuthenticated, component, componentProps, ...rest} = props;
  const Component = component as React.ComponentType<any>;

  return <Route {...rest} render={(renderProps) => isAuthenticated
    ? <Component {...renderProps} {...componentProps} />
    : <Redirect to={{pathname: ROUTE_SIGN_IN, state: {from: renderProps.location}}} />} />
};