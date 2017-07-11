import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, gql } from 'react-apollo';
import Helmet from 'react-helmet';
import Archive from 'components/Archive';
import Post from 'components/Post';
import { SITE_URL } from 'utils/constants';
import styles from './Date.scss';

/* eslint-disable react/prefer-stateless-function */

@graphql(
  gql`
  query Date_Query($year: Int!, $month: Int, $day: Int, $cursor: String, $count: Int = 10) {
    viewer {
      posts(year: $year, month: $month, day: $day, after: $cursor, first: $count) {
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
    options: ({ params }) => {
      const variables = ['year', 'month', 'day'].reduce((memo, value) => {
        if (params[value]) {
          memo[value] = parseInt(params[value], 10);
        }
        return memo;
      }, {});

      return { variables };
    },
  }
)
export default class DateRoute extends Component {
  static propTypes = {
    data: PropTypes.shape({
      viewer: PropTypes.shape({
        posts: PropTypes.object,
      }),
    }).isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    params: PropTypes.object.isRequired,
  };

  render() {
    const { params, data: { fetchMore, viewer: { posts } } } = this.props;
    const values = [params.month, params.day, params.year].filter(value => value);
    const path = values.join('/');
    const title = `Archives: ${path}`;

    return (
      <div className={styles.sections}>
        <Helmet>
          <title>
            {title}
          </title>
          <link rel="canonical" href={`${SITE_URL}/${path}`} />
        </Helmet>
        <section>
          <h2 className={styles.label}>
            {title}
          </h2>
          <Archive {...{ posts, fetchMore }} />
        </section>
      </div>
    );
  }
}
