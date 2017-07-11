import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, gql } from 'react-apollo';
import Helmet from 'react-helmet';
import Archive from 'components/Archive';
import Post from 'components/Post';
import Error from 'components/Error';
import Loading from 'components/Loading';
import { SITE_URL } from 'utils/constants';
import styles from './Term.scss';

@graphql(
  gql`
  query Term_Query($slug: String!, $taxonomy: String!, $cursor: String, $count: Int = 10) {
    viewer {
      term(slug: $slug, taxonomy: $taxonomy) {
        id
        name
        slug
        taxonomy {
          rewrite {
            slug
          }
          labels {
            singular
            plural
          }
        }
      }
      posts(term: $slug, taxonomy: $taxonomy, after: $cursor, first: $count) {
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
    options: ({ location, params: { slug } }) => {
      let taxonomy = 'category';
      if (location.pathname.indexOf('/tag/') === 0) {
        taxonomy = 'tag';
      }
      return { variables: { slug, taxonomy } };
    },
  }
)
export default class Term extends Component {
  static propTypes = {
    data: PropTypes.shape({
      viewer: PropTypes.shape({
        term: PropTypes.object,
        posts: PropTypes.object,
      }),
    }).isRequired,
  };

  loadMore() {
    return this;
  }

  render() {
    const { data: { error, loading, fetchMore } } = this.props;
    if (error) {
      return <Error />;
    } else if (loading) {
      return <Loading />;
    }

    const { viewer: { term, posts } } = this.props.data;

    const title = `${term.taxonomy.labels.singular}: ${term.name}`;
    const url = `${SITE_URL}/${term.taxonomy.rewrite.slug}/${term.slug}`;

    return (
      <div className={styles.sections}>
        <Helmet>
          <title>
            {title}
          </title>
          <link rel="canonical" href={url} />
          <meta property="og:title" content={title} />
          <meta property="og:url" content={url} />
        </Helmet>
        {term &&
          <section>
            <h2 className={styles.label}>
              {title}
            </h2>
            <Archive posts={posts} fetchMore={fetchMore} />
          </section>}
      </div>
    );
  }
}
