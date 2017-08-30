import React from 'react';
import queryMiddleware from 'farce/lib/queryMiddleware';
import createRender from 'found/lib/createRender';
import makeRouteConfig from 'found/lib/makeRouteConfig';
import Route from 'found/lib/Route';
import 'isomorphic-fetch';

const getComponent = loader => (location, cb) =>
  loader()
    .then(module => module.default)
    .catch(error => {
      // eslint-disable-next-line no-console
      console.error(error);
      cb(error, null);
    });

export const historyMiddlewares = [queryMiddleware];

export const routeConfig = makeRouteConfig(
  <Route
    path="/"
    getComponent={getComponent(() => /* webpackChunkName: "app" */ import('../containers/App'))}
  >
    <Route
      path=":category(music)/:slug"
      getComponent={getComponent(() => /* webpackChunkName: "term" */ import('./Term'))}
    />
    <Route
      path=":tag(tag)/:slug"
      getComponent={getComponent(() => /* webpackChunkName: "term" */ import('./Term'))}
    />
    <Route
      path=":year(\d{4})/:month(\d{2})/:day(\d{2})/:slug"
      getComponent={getComponent(() => /* webpackChunkName: "single" */ import('./Single'))}
    />
    <Route
      path=":year(\d{4})/:month(\d{2})?/:day(\d{2})?"
      getComponent={getComponent(() => /* webpackChunkName: "date" */ import('./Date'))}
    />
    <Route
      path="search"
      getComponent={getComponent(() => /* webpackChunkName: "search" */ import('./Search'))}
    />
    <Route
      path="charts"
      getComponent={getComponent(() => /* webpackChunkName: "chart" */ import('./Chart'))}
    />
    <Route
      path=":slug"
      getComponent={getComponent(() => /* webpackChunkName: "page" */ import('./Page'))}
    />
    <Route getComponent={getComponent(() => /* webpackChunkName: "home" */ import('./Home'))} />
  </Route>
);

export const render = createRender({});
