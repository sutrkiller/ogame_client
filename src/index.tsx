import * as React from 'react';
import {render} from 'react-dom';
import {AppContainer} from 'react-hot-loader';
import createBrowserHistory from "history/createBrowserHistory";
import {Provider} from 'react-redux';
import {ConnectedRouter} from "react-router-redux";

import {configureStore} from "./config/configureStore";
import * as RoutesModule from './routes';
import { routes} from "./routes";

import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/scss/font-awesome.scss';

const baseUrl = '/';
const history = createBrowserHistory({ basename: baseUrl });
const store = configureStore(history);


const renderApp = (appRoutes: any) => {
  render(
    <AppContainer>
      <Provider store={store}>
        <ConnectedRouter history={history} children={appRoutes} />
      </Provider>
    </AppContainer>,
    document.getElementById('root'),
  );
};

renderApp(routes);

if (module.hot) {
  module.hot.accept('./routes', () => {
    renderApp(require<typeof RoutesModule>("./routes").routes);
  });
}
