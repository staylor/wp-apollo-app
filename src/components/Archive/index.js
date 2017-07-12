import React from 'react';
import PropTypes from 'prop-types';
import Post from '../Post';
import styles from './Archive.scss';

const Archive = ({ variables, fetchMore = null, posts: { pageInfo, edges } }) =>
  <section>
    <ul>
      {edges.map(({ cursor, node }) =>
        <li key={cursor}>
          <Post post={node} />
        </li>
      )}
    </ul>
    {fetchMore &&
      pageInfo.hasNextPage &&
      <button
        className={styles.button}
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
      </button>}
  </section>;

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
