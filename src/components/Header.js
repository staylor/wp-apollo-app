import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'found';
import { Masthead, Title, Description } from 'wp-styled-components/lib/Header';
import NavMenu from 'wp-styled-components/lib/NavMenu';

const Header = ({ settings, navMenu }) =>
  <Masthead role="banner">
    <Title>
      <Link to="/">
        {settings.title}
      </Link>
    </Title>
    <Description>
      {settings.description}
    </Description>
    <NavMenu navMenu={navMenu} />
  </Masthead>;

Header.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  settings: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  navMenu: PropTypes.object.isRequired,
};

export default Header;
