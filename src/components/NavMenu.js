import url from 'url';
import React, { Component } from 'react';
import styled from 'emotion/react';
import { withTheme } from 'theming';
import PropTypes from 'prop-types';
import { Link } from 'found';
import { sortOrderedHierarchy } from 'utils/walker';
import responsive from 'styles/responsive';

const Nav = withTheme(styled.nav`
  display: block;
  margin: ${p => p.theme.padding / 2}px 0;

  & li {
    position: relative;
  }

  & a {
    color: ${p => p.theme.colors.black};
    display: block;
    font-size: 14px;
    line-height: ${p => p.theme.padding * 1.5}px;
    padding: 0 ${p => p.theme.padding * 0.75}px;
    text-decoration: none;
    text-transform: uppercase;

    ${responsive.desktop} {
      font-size: 14px;
      line-height: ${p => p.theme.padding * 2}px;
      padding: 0 ${p => p.theme.padding}px;
    }
  }

  & li:hover > a,
  & ul ul :hover > a,
  & a:focus {
    background: ${p => p.theme.colors.subnav.hoverBackground};
  }

  & ul li:hover > ul {
    display: block;
  }
`);

const Level = withTheme(styled.ul`
  list-style: none;
  margin: 0 0 0 ${p => p.theme.padding / 2 * -1}px;

  & ul {
    display: none;
    left: ${p => p.theme.padding}px;
    position: absolute;
    top: ${p => p.theme.padding * 1.5}px;
    z-index: 99999;

    ${responsive.desktop} {
      top: ${p => p.theme.padding * 2}px;
    }

    a {
      font-size: 13px;
      line-height: 20px;
      background: ${p => p.theme.colors.subnav.background};
      border-bottom: 1px dotted ${p => p.theme.colors.subnav.detail};
      color: ${p => p.theme.colors.dark};
      height: auto;
      padding: ${p => p.theme.padding / 2}px ${p => p.theme.padding}px;
      width: 168px;
    }

    & ul {
      left: 100%;
      top: 0;
    }
  }
`);

const NavItem = styled.li`display: inline-block;`;

export default class NavMenu extends Component {
  static propTypes = {
    navMenu: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          title: PropTypes.string,
          url: PropTypes.string,
          parent: PropTypes.string,
          order: PropTypes.number,
          type: PropTypes.string,
          typeName: PropTypes.string,
          typeSlug: PropTypes.string,
          dataSlug: PropTypes.string,
          dataID: PropTypes.string,
        })
      ),
    }).isRequired,
  };

  sorted = null;
  level = 0;

  parseItem({ id, title, url: itemUrl, typeSlug, dataSlug }) {
    let path;
    if (typeSlug && dataSlug) {
      path = `/${typeSlug}/${dataSlug}`;
    } else {
      const urlObj = url.parse(itemUrl);
      if (urlObj.path === '/') {
        path = urlObj.path;
      } else {
        path = urlObj.path.replace(/\/$/, '');
      }
    }

    if (this.sorted[id]) {
      this.level += 1;
    }
    return (
      <NavItem key={id}>
        <Link to={path}>
          {title}
        </Link>
        {this.sorted[id] ? this.walk(this.sorted[id]) : null}
      </NavItem>
    );
  }

  walk(node) {
    return (
      <Level>
        {node.map(child => {
          if (!child.parent) {
            this.level = 0;
          }
          return this.parseItem(child);
        })}
      </Level>
    );
  }

  render() {
    const { navMenu } = this.props;

    if (!navMenu) {
      return null;
    }

    this.sorted = sortOrderedHierarchy(navMenu.items);
    const navMenuHtml = this.walk(this.sorted.top);

    return (
      <Nav>
        {navMenuHtml}
      </Nav>
    );
  }
}
