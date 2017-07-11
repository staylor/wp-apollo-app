import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { graphql, gql } from 'react-apollo';
import Media from 'components/Media';
import Error from 'components/Error';
import Loading from 'components/Loading';
import { SITE_URL } from 'utils/constants';
import styles from './Page.scss';

/* eslint-disable react/no-danger */
/* eslint-disable react/prefer-stateless-function */

@graphql(
  gql`
    query Page_Query($slug: String!) {
      viewer {
        page(slug: $slug) {
          id
          slug
          title {
            rendered
          }
          content {
            rendered
          }
          featuredMedia {
            ... on Image {
              source_url
            }
            ...Media_media
          }
        }
      }
    }
    ${Media.fragments.media}
  `,
  {
    options: ({ params: { slug } }) => ({ variables: { slug } }),
  }
)
export default class Page extends Component {
  static propTypes = {
    data: PropTypes.shape({
      viewer: PropTypes.shape({
        page: PropTypes.object,
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

    const {
      viewer: {
        page: {
          slug,
          title: { rendered: title },
          content: { rendered: content },
          featuredMedia,
        },
      },
    } = this.props.data;
    const url = `${SITE_URL}/${slug}`;
    const featuredImage = (featuredMedia && featuredMedia.source_url) || null;

    return (
      <article className={styles.content}>
        <Helmet>
          <title>
            {title}
          </title>
          <link rel="canonical" href={url} />
          <meta property="og:type" content="article" />
          <meta property="og:title" content={title} />
          <meta property="og:url" content={url} />
          {featuredImage &&
            <meta property="og:image" content={featuredImage} />}
          <meta name="twitter:title" content={title} />
          {featuredImage &&
            <meta name="twitter:image" content={featuredImage} />}
        </Helmet>
        <header>
          <h1
            className={styles.title}
            dangerouslySetInnerHTML={{ __html: title }}
          />
        </header>
        {featuredMedia && <Media media={featuredMedia} crop={'large'} />}
        <section dangerouslySetInnerHTML={{ __html: content }} />
      </article>
    );
  }
}
