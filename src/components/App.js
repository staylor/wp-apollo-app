import React from 'react';
import PropTypes from 'prop-types';
import { PageWrapper, Content, Primary, Secondary, Footer } from 'wp-styled-components/lib/App';
import Sidebar from 'wp-styled-components/lib/Sidebar';
import 'wp-styled-components/lib/global';
import Settings from 'components/Settings';
import Header from 'components/Header';

export default function App({ settings, navMenu, sidebar, children }) {
  return (
    <PageWrapper>
      <Settings settings={settings} />
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
  );
}

App.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  settings: PropTypes.object.isRequired,
  navMenu: PropTypes.object.isRequired,
  sidebar: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};
