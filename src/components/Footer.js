import React from 'react';
import styled from 'emotion/react';
import { withTheme } from 'theming';

const Footer = withTheme(styled.footer`
  padding: ${p => p.theme.padding}px 0;
  text-align: center;
`);

export default () =>
  <Footer>
    © Scott Taylor ...&nbsp; Brooklyn, NY ...{' '}
    <a href="https://twitter.com/wonderboymusic">@wonderboymusic</a>&nbsp; ... Powered by
    GraphQL / React / Apollo / WordPress / nginx / Redis / SCSS
  </Footer>;
