import React from 'react';
import styled from 'emotion/react';
import { withTheme } from 'theming';
import PropTypes from 'prop-types';
import { Link } from 'found';
import NavMenu from 'components/NavMenu';
import { clear } from 'styles/global';
import { header1 } from 'styles/components';

const Masthead = withTheme(styled.header`
  composes: ${clear};
  background: ${p => p.theme.colors.white};
  border-top: 2px solid ${p => p.theme.colors.topBorder};
  max-width: ${p => p.theme.contentWidth};
  position: relative;
  width: 100%;
  z-index: 9999;
`);

const Headers = styled.div`overflow: hidden;`;

const Title = withTheme(styled.h1`
  composes: ${header1};
  color: ${p => p.theme.colors.black};
  float: left;
  font-size: 48px;
  font-weight: ${p => p.theme.weightBold};
  line-height: 72px;
  padding: 2.6% 0 0;

  & a {
    color: ${p => p.theme.colors.black};
    text-decoration: none;
  }
`);

const Description = withTheme(styled.h2`
  bottom: 40%;
  color: ${p => p.theme.colors.subhead};
  font-family: ${p => p.theme.fonts.futura};
  font-size: 24px;
  line-height: 24px;
  position: absolute;
  right: 32px;
`);

const Header = ({ settings, navMenu }) =>
  <Masthead role="banner">
    <Headers>
      <Title>
        <Link to="/">
          {settings.title}
        </Link>
      </Title>
      <Description>
        {settings.description}
      </Description>
    </Headers>
    <NavMenu navMenu={navMenu} />
  </Masthead>;

Header.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  settings: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  navMenu: PropTypes.object.isRequired,
};

export default Header;
