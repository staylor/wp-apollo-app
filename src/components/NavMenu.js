import url from 'url';
import React, { Component } from 'react';
import { withTheme } from 'theming';
import PropTypes from 'prop-types';
import { Link } from 'found';
import { sortOrderedHierarchy } from 'utils/walker';
import styled from 'emotion/react';
import { clear } from 'styles/global';

const Nav = withTheme(styled.nav`
  display: block;
  float: left;
  margin: 0 auto 6px;
  width: 100%;

  & li {
    float: left;
    position: relative;
  }

  & a {
    color: ${p => p.theme.colors.black};
    display: block;
    line-height: 2em;
    padding: 0 1.2125em;
    text-decoration: none;
    text-transform: uppercase;
  }

  & li:hover > a,
  & ul ul :hover > a,
  & a:focus {
    background: #efefef;
  }

  & li:hover > a,
  & a:focus {
    color: #373737;
  }

  & ul li:hover > ul {
    display: block;
  }
`);

const Level = withTheme(styled.ul`
  composes: ${clear};

  font-size: 14px;
  line-height: 14px;
  list-style: none;
  margin: 0 0 0 -1em;
  padding-left: 0;

  & ul {
    display: none;
    float: left;
    left: 14px;
    margin: 0;
    position: absolute;
    top: 28px;
    width: 188px;
    z-index: 99999;

    a {
      font-size: 13px;
      line-height: 20px;
      background: #f9f9f9;
      border-bottom: 1px dotted #ddd;
      color: ${p => p.theme.colors.dark};
      font-weight: normal;
      height: auto;
      padding: 10px;
      width: 168px;
    }

    & ul {
      left: 100%;
      top: 0;
    }
  }
`);

const NavItem = styled.li`display: inline-block;`;

//
// .activeLink {
//   color: $black;
//   text-decoration: none;
// }

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
