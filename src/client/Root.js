import React from 'react';
import { CookiesProvider } from 'react-cookie';
import { ApolloProvider, ApolloClient } from 'react-apollo';
import networkInterface from 'apollo/networkInterface';
import fragmentMatcher from 'apollo/fragmentMatcher';

const Root = ({ router: BrowserRouter }) => {
  const client = new ApolloClient({
    // eslint-disable-next-line no-underscore-dangle
    initialState: window.__APOLLO_STATE__,
    networkInterface,
    fragmentMatcher,
  });

  return (
    <ApolloProvider client={client}>
      <CookiesProvider>
        <BrowserRouter />
      </CookiesProvider>
    </ApolloProvider>
  );
};

export default Root;
