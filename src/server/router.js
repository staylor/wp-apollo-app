import React from 'react';
import { getFarceResult } from 'found/lib/server';
import { CookiesProvider } from 'react-cookie';
import template from 'server/template';
import { historyMiddlewares, render, routeConfig } from 'routes';
import {
  ApolloClient,
  createNetworkInterface,
  ApolloProvider,
  renderToStringWithData,
} from 'react-apollo';
import fragmentMatcher from 'apollo/fragmentMatcher';

export default ({ manifestJSBundle, mainJSBundle, vendorJSBundle, mainCSSBundle }) => async (
  req,
  res
) => {
  try {
    const { redirect, element } = await getFarceResult({
      url: req.url,
      historyMiddlewares,
      routeConfig,
      render,
    });

    if (redirect) {
      res.redirect(302, redirect.url);
      return;
    }

    const client = new ApolloClient({
      ssrMode: true,
      networkInterface: createNetworkInterface({
        uri: 'http://localhost:8080/graphql',
      }),
      fragmentMatcher,
    });
    const app = (
      <ApolloProvider client={client}>
        <CookiesProvider cookies={req.universalCookies}>
          {element}
        </CookiesProvider>
      </ApolloProvider>
    );

    renderToStringWithData(app).then(root => {
      const initialState = {
        apollo: client.getInitialState(),
      };
      res.status(200);
      res.send(
        template({
          root,
          data: initialState,
          manifestJSBundle,
          mainJSBundle,
          vendorJSBundle,
          mainCSSBundle,
        })
      );
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    res.send(e.message);
  }
};
