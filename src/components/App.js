import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider, withTheme } from 'theming';
import styled from 'emotion/react';
import { IntlProvider, addLocaleData } from 'react-intl';
import { graphql } from 'react-apollo';
import { routerShape } from 'found/lib/PropTypes';
import Settings from 'components/Settings';
import Header from 'components/Header';
import Sidebar from 'components/Sidebar';
import Footer from 'components/Footer';
import AppQuery from 'graphql/App_Query.graphql';
import theme from 'styles/theme';
import responsive from 'styles/responsive';
import 'styles/global';

const PageWrapper = withTheme(styled.div`
  background: ${p => p.theme.colors.white};
  margin: 0 auto;
  max-width: ${p => p.theme.contentWidth}px;
  padding: 0 ${p => p.theme.padding}px;
`);

const Content = withTheme(styled.div`
  padding: ${p => p.theme.padding}px 0;
  ${responsive.desktop} {
    display: flex;
    margin-right: ${p => p.theme.padding}px;
  }
`);

const Primary = styled.section`${responsive.desktop} {flex: 4;}`;

const Secondary = styled.section`
  display: block;
  min-height: 212px;
  min-width: 212px;
  ${responsive.desktop} {
    flex: 1;
  }
`;

const langCache = {};
const getMessages = locale => {
  if (langCache[locale]) {
    return langCache[locale];
  }
  // eslint-disable-next-line global-require, import/no-dynamic-require
  langCache[locale] = require(`../langs/${locale}.js`).default;
  return langCache[locale];
};

@graphql(AppQuery, {
  options: {
    variables: {
      menuID: 'TmF2TWVudToy',
      sidebarID: 'U2lkZWJhcjpzaWRlYmFyLTE=',
    },
  },
})
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

  state = {
    locale: 'en',
  };

  constructor(props, context) {
    super(props, context);

    this.removeTransitionHook = props.router.addTransitionHook(this.onTransition);
  }

  componentDidMount() {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const localeData = require(`react-intl/locale-data/${this.state.locale}`);
    addLocaleData(localeData);
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
      <ThemeProvider theme={theme}>
        <IntlProvider
          locale={this.state.locale}
          messages={getMessages(this.state.locale)}
        >
          <PageWrapper>
            <Settings settings={settings} locale={this.state.locale} />
            <Header {...{ settings, navMenu }} />
            <Content>
              <Primary>
                {children}
              </Primary>
              <Secondary>
                <Sidebar sidebar={sidebar} />
              </Secondary>
            </Content>
            <Footer />
          </PageWrapper>
        </IntlProvider>
      </ThemeProvider>
    );
  }
}
