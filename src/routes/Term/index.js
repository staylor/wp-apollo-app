import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import Helmet from 'react-helmet';
import Archive from 'components/Archive';
import Error from 'components/Error';
import Loading from 'components/Loading';
import TermQuery from 'graphql/Term_Query.graphql';
import { SITE_URL } from 'utils/constants';
import styles from './Term.scss';

@graphql(TermQuery, {
  options: ({ params: { slug, tag = null } }) => {
    let taxonomy = 'category';
    if (tag) {
      taxonomy = 'tag';
    }
    return {
      variables: {
        slug,
        taxonomy,
        count: 10,
      },
    };
  },
})
export default class Term extends Component {
  static propTypes = {
    data: PropTypes.shape({
      fetchMore: PropTypes.func,
      variables: PropTypes.object,
      viewer: PropTypes.shape({
        term: PropTypes.object,
        posts: PropTypes.object,
      }),
    }).isRequired,
  };

  render() {
    const { data: { error, loading } } = this.props;
    if (error) {
      return <Error />;
    } else if (loading) {
      return <Loading />;
    }

    const { variables, fetchMore, viewer: { term, posts } } = this.props.data;

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
            <Archive {...{ posts, fetchMore, variables }} />
          </section>}
      </div>
    );
  }
}
