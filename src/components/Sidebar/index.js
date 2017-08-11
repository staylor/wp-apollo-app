import React from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';
import styles from './Sidebar.scss';

/* eslint-disable react/no-danger */

const transformStyles = (classname, html) =>
  html
    .replace(/widget-title/g, styles.title)
    .replace(/widget_go_to_this/g, styles.goToThis);

const Widget = styled.li`margin: 0 0 24px;`;

const Sidebar = ({ sidebar }) =>
  <ul className={styles.widgets}>
    {sidebar.widgets.map(({ id, classname, content: { rendered: widget } }) =>
      <Widget
        key={id}
        dangerouslySetInnerHTML={{
          __html: transformStyles(classname, widget),
        }}
      />
    )}
  </ul>;

Sidebar.propTypes = {
  sidebar: PropTypes.shape({
    widgets: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default Sidebar;
