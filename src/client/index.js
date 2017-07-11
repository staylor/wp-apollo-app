import React from 'react';
import ReactDOM from 'react-dom';
import createInitialBrowserRouter from 'found/lib/createInitialBrowserRouter';
import { CookiesProvider } from 'react-cookie';
import { historyMiddlewares, render, routeConfig } from 'routes';
import { ApolloProvider, ApolloClient, createNetworkInterface } from 'react-apollo';
import fragmentMatcher from 'apollo/fragmentMatcher';

(async () => {
  try {
    const uri = 'http://localhost:3000/graphql';

    const client = new ApolloClient({
      // eslint-disable-next-line no-underscore-dangle
      initialState: window.__APOLLO_STATE__,
      networkInterface: createNetworkInterface({
        uri,
      }),
      fragmentMatcher,
    });

    const BrowserRouter = await createInitialBrowserRouter({
      historyMiddlewares,
      historyOptions: { useBeforeUnload: true },
      routeConfig,
      render,
    });
    ReactDOM.render(
      <ApolloProvider client={client}>
        <CookiesProvider>
          <BrowserRouter />
        </CookiesProvider>
      </ApolloProvider>,
      document.getElementById('main')
    );
  } catch (e) {
    throw e;
  }
})();
