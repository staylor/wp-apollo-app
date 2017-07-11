import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, gql } from 'react-apollo';
import Archive from 'components/Archive';
import Post from 'components/Post';
import styles from './Author.scss';

/* eslint-disable react/prefer-stateless-function */

@graphql(
  gql`
  query Author_Query($id: ID!) {
    viewer {
      author(id: $id) {
        id
        name
      }
      posts(author: $id, after: $cursor, first: $count) {
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
    }
  }
  ${Post.fragments.post}
`,
  {
    options: ({ params: { id } }) => ({ variables: { id } }),
  }
)
export default class Author extends Component {
  static propTypes = {
    data: PropTypes.shape({
      viewer: PropTypes.shape({
        author: PropTypes.object,
        posts: PropTypes.object,
      }),
    }).isRequired,
  };

  render() {
    const { data: { fetchMore, viewer: { author, posts } } } = this.props;
    return (
      <div className={styles.sections}>
        <section>
          <h2 className={styles.header}>
            {author.name}
          </h2>
          <Archive posts={posts} fetchMore={fetchMore} />
        </section>
      </div>
    );
  }
}
