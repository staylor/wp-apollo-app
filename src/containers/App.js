import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { routerShape } from 'found/lib/PropTypes';
import { ThemeProvider } from 'wp-styled-components/lib/App';
import 'wp-styled-components/lib/global';
import IntlProvider from 'decorators/IntlProvider';
import AppQuery from 'graphql/App_Query.graphql';
import AppComponent from 'components/App';

@graphql(AppQuery, {
  options: {
    variables: {
      menuID: 'TmF2TWVudToy',
      sidebarID: 'U2lkZWJhcjpzaWRlYmFyLTE=',
    },
  },
})
@IntlProvider
export default class App extends Component {
  static propTypes = {
    data: PropTypes.shape({
      viewer: PropTypes.shape({
        settings: PropTypes.object,
        navMenu: PropTypes.object,
        sidebar: PropTypes.object,
      }),
    }).isRequired,
    children: PropTypes.node,
    router: routerShape.isRequired,
  };

  static defaultProps = {
    children: null,
  };

  static childContextTypes = {
    router: routerShape.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.removeTransitionHook = props.router.addTransitionHook(this.onTransition);
  }

  componentWillUnmount() {
    this.removeTransitionHook();
  }

  onTransition = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  };

  getChildContext() {
    return {
      router: this.props.router,
    };
  }

  render() {
    const { data, children } = this.props;
    const { viewer: { settings, navMenu, sidebar } } = data;

    return (
      <ThemeProvider>
        <AppComponent {...{ settings, navMenu, sidebar }}>
          {children}
        </AppComponent>
      </ThemeProvider>
    );
  }
}
