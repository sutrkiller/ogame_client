import * as React from 'react';
import {render} from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import { Root } from './config/Root';

const renderApp = (Component : any) => {
  render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root'),
  );
};

renderApp(Root);

if (module.hot) {
  module.hot.accept('./config/Root.tsx', () => {
    const newApp = require("./config/Root").Root;
    renderApp(newApp);
  });
}
