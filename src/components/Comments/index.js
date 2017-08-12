import React, { Component } from 'react';
import styled from 'emotion/react';
import PropTypes from 'prop-types';
import SingleQuery from 'graphql/Single_Query.graphql';
import { ArchiveHeader } from 'styles/components';
import Walker from './Walker';
import { CommentConnectionType } from './types';
import { COMMENTS_PER_PAGE } from './constants';

const Aside = styled.aside`
  max-width: 100%;
  width: 450px;
`;

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
        <ArchiveHeader>Comments</ArchiveHeader>
        <Walker comments={comments} />
      </Aside>
    );
  }
}
