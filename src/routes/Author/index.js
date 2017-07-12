import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import Archive from 'components/Archive';
import Error from 'components/Error';
import Loading from 'components/Loading';
import AuthorQuery from 'graphql/Author_Query.graphql';
import styles from './Author.scss';

/* eslint-disable react/prefer-stateless-function */

@graphql(AuthorQuery, {
  options: ({ params: { id } }) => ({
    variables: {
      id,
      count: 10,
    },
  }),
})
export default class Author extends Component {
  static propTypes = {
    data: PropTypes.shape({
      fetchMore: PropTypes.func,
      variables: PropTypes.object,
      viewer: PropTypes.shape({
        author: PropTypes.object,
        posts: PropTypes.object,
      }),
    }).isRequired,
  };

  render() {
    const { data: { loading, error } } = this.props;
    if (error) {
      return <Error />;
    } else if (loading) {
      return <Loading />;
    }

    const { variables, fetchMore, viewer: { author, posts } } = this.props.data;
    return (
      <div className={styles.sections}>
        <section>
          <h2 className={styles.header}>
            {author.name}
          </h2>
          <Archive {...{ posts, fetchMore, variables }} />
        </section>
      </div>
    );
  }
}
