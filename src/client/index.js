import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { hydrate } from 'emotion';
import createInitialBrowserRouter from 'found/lib/createInitialBrowserRouter';
import { historyMiddlewares, render, routeConfig } from 'routes';
import Root from './Root';

// eslint-disable-next-line no-underscore-dangle
hydrate(window.__emotion);

(async () => {
  const BrowserRouter = await createInitialBrowserRouter({
    historyMiddlewares,
    historyOptions: { useBeforeUnload: true },
    routeConfig,
    render,
  });

  const mount = RootComponent => {
    ReactDOM.hydrate(
      <AppContainer>
        <RootComponent router={BrowserRouter} />
      </AppContainer>,
      document.getElementById('main')
    );
  };

  if (module.hot) {
    module.hot.accept('./Root', () => {
      // eslint-disable-next-line global-require,import/newline-after-import
      const RootComponent = require('./Root').default;
      mount(RootComponent);
    });
  }

  mount(Root);
})();
