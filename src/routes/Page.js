import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { graphql } from 'react-apollo';
import Media from 'components/Media';
import Error from 'components/Error';
import Loading from 'components/Loading';
import PageQuery from 'graphql/Page_Query.graphql';
import { SITE_URL } from 'utils/constants';
import { H1, ArticleWrapper } from 'styles/components';

/* eslint-disable react/no-danger */
/* eslint-disable react/prefer-stateless-function */

@graphql(PageQuery, {
  options: ({ params: { slug } }) => ({
    variables: {
      slug,
    },
  }),
})
export default class Page extends Component {
  static propTypes = {
    data: PropTypes.shape({
      viewer: PropTypes.shape({
        page: PropTypes.object,
      }),
    }).isRequired,
  };

  render() {
    const { data: { error, loading, viewer } } = this.props;
    if (error) {
      return <Error />;
    } else if (loading) {
      return <Loading />;
    } else if (!viewer.page) {
      return <Error />;
    }

    const {
      page: {
        slug,
        title: { rendered: title },
        content: { rendered: content },
        featuredMedia,
      },
    } = viewer;
    const url = `${SITE_URL}/${slug}`;
    const featuredImage = (featuredMedia && featuredMedia.sourceUrl) || null;

    return (
      <ArticleWrapper>
        <Helmet>
          <title>
            {title}
          </title>
          <link rel="canonical" href={url} />
          <meta property="og:type" content="article" />
          <meta property="og:title" content={title} />
          <meta property="og:url" content={url} />
          {featuredImage && <meta property="og:image" content={featuredImage} />}
          <meta name="twitter:title" content={title} />
          {featuredImage && <meta name="twitter:image" content={featuredImage} />}
        </Helmet>
        <header>
          <H1 dangerouslySetInnerHTML={{ __html: title }} />
        </header>
        {featuredMedia && <Media media={featuredMedia} crop={'large'} />}
        <section
          css={`
            & h2 {
              margin: 0 0 5px;
            }

            & p {
              margin: 0 0 20px;
            }
          `}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </ArticleWrapper>
    );
  }
}
