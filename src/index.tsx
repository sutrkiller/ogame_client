import * as React from 'react';
import {render} from 'react-dom';
import {AppContainer} from 'react-hot-loader';
import createBrowserHistory from "history/createBrowserHistory";
import {Provider} from 'react-redux';
import {ConnectedRouter} from "react-router-redux";

import {configureStore} from "./config/configureStore";
import * as LayoutModule from './components/Layout';
import { Layout } from "./components/Layout";

import '../node_modules/bootstrap/dist/css/bootstrap.css';

const baseUrl = '/';
const history = createBrowserHistory({ basename: baseUrl });
const store = configureStore(history);


const renderApp = (app: any) => {
  render(
    <AppContainer>
      <Provider store={store}>
        <ConnectedRouter history={history} children={app} />
      </Provider>
    </AppContainer>,
    document.getElementById('root'),
  );
};

renderApp(<Layout/>);

if (module.hot) {
  module.hot.accept('./components/Layout', () => {
    renderApp(require<typeof LayoutModule>("./components/Layout").Layout);
  });
}
