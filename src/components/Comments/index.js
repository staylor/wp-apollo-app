import React, { Component } from 'react';
import styled from 'emotion/react';
import { withTheme } from 'theming';
import PropTypes from 'prop-types';
import SingleQuery from 'graphql/Single_Query.graphql';
import { Heading } from 'styles/components';
import responsive from 'styles/responsive';
import Walker from './Walker';
import { CommentConnectionType } from './types';
import { COMMENTS_PER_PAGE } from './constants';

const Aside = withTheme(styled.aside`
  margin-top: ${p => p.theme.padding * 3}px;
  max-width: 100%;

  ${responsive.tablet} {
    width: 450px;
  }
`);

export default class Comments extends Component {
  static propTypes = {
    post: PropTypes.shape({
      id: PropTypes.string,
      slug: PropTypes.string,
    }).isRequired,
    comments: CommentConnectionType,
  };

  static defaultProps = {
    comments: null,
  };

  static childContextTypes = {
    queryConfig: PropTypes.object,
    postId: PropTypes.string,
  };

  getChildContext() {
    const { id, slug } = this.props.post;
    // emoji and unicode get encoded
    const decoded = decodeURIComponent(slug);
    return {
      queryConfig: {
        query: SingleQuery,
        variables: {
          commentCount: COMMENTS_PER_PAGE,
          slug: decoded,
        },
      },
      postId: id,
    };
  }

  render() {
    const { comments } = this.props;
    return (
      <Aside>
        <Heading>Comments</Heading>
        <Walker comments={comments} />
      </Aside>
    );
  }
}
