import url from 'url';
import cn from 'classnames';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { gql } from 'react-apollo';
import { Link } from 'found';
import { sortOrderedHierarchy } from 'utils/walker';
import styles from './NavMenu.scss';

export default class NavMenu extends Component {
  static propTypes = {
    navMenu: PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      url: PropTypes.string,
      object: PropTypes.String,
      object_id: PropTypes.String,
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
      <li key={id} className={cn(styles.navItem, styles[`level${this.level}`])}>
        <Link to={path}>
          {title}
        </Link>
        {this.sorted[id] ? this.walk(this.sorted[id]) : null}
      </li>
    );
  }

  walk(node) {
    return (
      <ul>
        {node.map(child => {
          if (!child.parent) {
            this.level = 0;
          }
          return this.parseItem(child);
        })}
      </ul>
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
      <nav className={styles.access}>
        {navMenuHtml}
      </nav>
    );
  }
}

NavMenu.fragments = {
  navMenu: gql`
    fragment NavMenu_navMenu on NavMenu {
      id
      name
      items {
        id
        title
        url
        parent
        order
        type
        typeName
        typeSlug
        dataSlug
        dataID
      }
    }
  `,
};
