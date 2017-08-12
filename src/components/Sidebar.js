import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import styled from 'emotion/react';
import { withTheme } from 'theming';
import theme from 'styles/theme';
import { uppercaseHeader } from 'styles/components';

/* eslint-disable react/no-danger */

const Widget = withTheme(styled.li`margin: 0 0 ${p => p.theme.padding * 2}px;`);

const title = css`
  composes: ${uppercaseHeader};
  margin: 0 0 ${theme.padding}px;
`;

const goToThis = css`
  & .title {
    line-height: 1.6em;
  }

  & a {
    font-weight: ${theme.weightBold};
    text-decoration: none;
  }

  & ol {
    margin: ${theme.padding}px 0;
  }

  & li {
    margin: ${theme.padding / 2}px 0;
    border-top: 3px solid ${theme.colors.detail};
  }
`;

const transformStyles = (classname, html) =>
  html.replace(/widget-title/g, title).replace(/widget_go_to_this/g, goToThis);

const Sidebar = ({ sidebar }) =>
  <ul>
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
