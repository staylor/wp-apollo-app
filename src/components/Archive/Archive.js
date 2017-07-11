import React from 'react';
import PropTypes from 'prop-types';
import { gql } from 'react-apollo';
import Post from '../Post';
import styles from './Archive.scss';

const Archive = ({ fetchMore = null, posts: { edges } }) =>
  <section>
    <ul>
      {edges.map(({ cursor, node }) =>
        <li key={cursor}>
          <Post post={node} />
        </li>
      )}
    </ul>
    {fetchMore &&
      <button
        className={styles.button}
        onClick={() => {
          fetchMore(10, e => {
            if (e) {
              // eslint-disable-next-line no-console
              console.log(e);
            }
          });
        }}
      >
        MORE
      </button>}
  </section>;

Archive.fragments = {
  posts: gql`
    fragment Archive_posts on PostConnection {
      edges {
        node {
          ...Post_post
        }
        cursor
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
    ${Post.fragments.post}
  `,
};

Archive.propTypes = {
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
  fetchMore: null,
};

export default Archive;
