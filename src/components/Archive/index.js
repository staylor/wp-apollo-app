import React from 'react';
import PropTypes from 'prop-types';
import { LoadMore } from 'styles/components';
import Post from '../Post';

const Archive = ({ variables, fetchMore = null, posts: { pageInfo, edges } }) => [
  <ul key="list">
    {edges.map(({ cursor, node }) =>
      <li key={cursor}>
        <Post post={node} />
      </li>
    )}
  </ul>,
  fetchMore &&
    pageInfo.hasNextPage &&
    <LoadMore
      key="button"
      onClick={() =>
        fetchMore({
          variables: {
            ...variables,
            cursor: pageInfo.endCursor,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const { edges: previousEdges } = previousResult.viewer.posts;
            const { edges: newEdges } = fetchMoreResult.viewer.posts;
            const newViewer = {
              viewer: {
                ...fetchMoreResult.viewer,
                posts: {
                  ...fetchMoreResult.viewer.posts,
                  edges: [...previousEdges, ...newEdges],
                },
              },
            };
            return newViewer;
          },
        })}
    >
      MORE
    </LoadMore>,
];

Archive.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  variables: PropTypes.object,
  fetchMore: PropTypes.func,
  posts: PropTypes.shape({
    edges: PropTypes.arrayOf(
      PropTypes.shape({
        node: PropTypes.object,
        cursor: PropTypes.string,
      })
    ),
  }).isRequired,
};

Archive.defaultProps = {
  variables: {},
  fetchMore: null,
};

export default Archive;
