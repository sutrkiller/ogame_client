import * as React from 'react';
import {Route} from "react-router-dom";
import {Layout} from "./components/Layout";
import {Home} from "./components/Home";

export const ROUTE_HOME = "/";

export const routes =
  <Layout>
    <Route exact path={ROUTE_HOME} component={Home}/>
  </Layout>;
