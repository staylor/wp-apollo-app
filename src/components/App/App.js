import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IntlProvider, addLocaleData } from 'react-intl';
import Helmet from 'react-helmet';
import { graphql, gql } from 'react-apollo';
import { routerShape } from 'found/lib/PropTypes';
import Header from 'components/Header';
import NavMenu from 'components/NavMenu';
import Sidebar from 'components/Sidebar';
import { SITE_URL, SITE_DESCRIPTION, TWITTER_USERNAME, TWITTER_CREATOR } from 'utils/constants';
import styles from './App.scss';

const langCache = {};

const getMessages = locale => {
  if (langCache[locale]) {
    return langCache[locale];
  }
  // eslint-disable-next-line global-require, import/no-dynamic-require
  langCache[locale] = require(`../../langs/${locale}.js`).default;
  return langCache[locale];
};

@graphql(
  gql`
  query App_Query($menuID: ID!, $sidebarID: ID!) {
    viewer {
      settings {
        title
        description
        language
      }
      navMenu(id: $menuID) {
        ...NavMenu_navMenu
      }
      sidebar(id: $sidebarID) {
        ...Sidebar_sidebar
      }
    }
  }
  ${NavMenu.fragments.navMenu}
  ${Sidebar.fragments.sidebar}
`,
  {
    options: {
      variables: {
        menuID: 'TmF2TWVudToy',
        sidebarID: 'U2lkZWJhcjpzaWRlYmFyLTE=',
      },
    },
  }
)
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
      <IntlProvider locale={this.state.locale} messages={getMessages(this.state.locale)}>
        <div className={styles.page}>
          <Helmet titleTemplate={`%s - ${settings.title}`} defaultTitle={settings.title}>
            <html lang={this.state.locale} prefix="og: http://ogp.me/ns#" />
            <title>
              {settings.description}
            </title>
            <meta httpEquiv="Content-Language" content={this.state.locale} />
            <meta property="og:site_name" content={settings.title} />
            <meta property="og:description" content={SITE_DESCRIPTION} />
            <meta property="og:type" content="website" />
            <meta property="og:locale" content={settings.language} />
            <meta property="og:url" content={SITE_URL} />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:site" content={TWITTER_USERNAME} />
            <meta name="twitter:creator" content={TWITTER_CREATOR} />
            <meta name="twitter:description" content={SITE_DESCRIPTION} />
          </Helmet>
          <Header {...{ settings, navMenu }} />
          <div className={styles.content}>
            <section className={styles.primary}>
              {children}
            </section>
            <section className={styles.secondary}>
              <Sidebar sidebar={sidebar} />
            </section>
          </div>
          <footer className={styles.footerCredits}>
            © Scott Taylor ...&nbsp; Brooklyn, NY ...{' '}
            <a href="https://twitter.com/wonderboymusic">@wonderboymusic</a>&nbsp; ... Powered by
            GraphQL / React / Apollo / WordPress / nginx / Redis / SCSS
          </footer>
        </div>
      </IntlProvider>
    );
  }
}
