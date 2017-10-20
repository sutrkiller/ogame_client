import * as React from 'react';
import {Route} from "react-router-dom";
import {Layout} from "./components/Layout";
import {Home} from "./components/Home";
import {Login} from "./components/Login";
import {Switch} from "react-router";

export const ROUTE_HOME = "/";
export const ROUTE_LOGIN = "/login";

export const routes =
  <Layout>
    <Switch>
      <Route exact path={ROUTE_HOME} component={Home}/>
      <Route path={ROUTE_LOGIN} component={Login}/>
    </Switch>
  </Layout>;
