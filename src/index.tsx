import * as React from 'react';
import {render} from 'react-dom';
import {AppContainer} from 'react-hot-loader';
import createBrowserHistory from "history/createBrowserHistory";
import {Provider} from 'react-redux';
import {ConnectedRouter} from "react-router-redux";

import {configureStore} from "./config/configureStore";
import * as RoutesModule from './routes';
import { routes} from "./routes";
import '../node_modules/bootstrap/dist/css/bootstrap.css';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href')!;
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
