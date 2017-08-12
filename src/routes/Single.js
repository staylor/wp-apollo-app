import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import styled from 'emotion/react';
import { withTheme } from 'theming';
import Helmet from 'react-helmet';
import { graphql } from 'react-apollo';
import { Link } from 'found';
import { FormattedRelative } from 'react-intl';
import Error from 'components/Error';
import Loading from 'components/Loading';
import Media from 'components/Media';
import Comments from 'components/Comments';
import { COMMENTS_PER_PAGE } from 'components/Comments/constants';
import SingleQuery from 'graphql/Single_Query.graphql';
import { convertPlaceholders } from 'utils';
import { dateRegex } from 'utils/regex';
import { SITE_URL } from 'utils/constants';
import { ArticleWrapper, header1, embed } from 'styles/components';
import responsive from 'styles/responsive';

/* eslint-disable react/no-danger */

const iframe = css`margin: 0 0 20px;`;

const Title = withTheme(styled.h1`
  composes: ${header1};
  font-size: 24px;
  font-weight: bold;
  line-height: 30px;
  margin: 0 0 ${p => p.theme.padding}px;

  ${responsive.tablet} {
    font-size: 36px;
    line-height: 42px;
  }
`);

const Meta = withTheme(styled.div`
  clear: both;
  color: ${p => p.theme.colors.meta};
  font-size: 12px;
  line-height: 18px;
  margin-bottom: ${p => p.theme.padding}px;
`);

const Content = withTheme(styled.section`
  & h2 {
    font-family: ${p => p.theme.fonts.futura};
    font-size: 24px;
    line-height: 32px;
    font-weight: ${p => p.theme.weightBold};
    margin: 0 0 ${p => p.theme.padding / 2}px;
  }

  & p {
    margin: 0 0 ${p => p.theme.padding}px;
  }
`);

const Tag = withTheme(styled(Link)`
  display: inline-block;
  margin: 0 0 0 ${p => p.theme.padding / 4}px;
`);

@graphql(SingleQuery, {
  options: ({ params: { slug } }) => ({
    variables: {
      slug,
      commentCount: COMMENTS_PER_PAGE,
    },
  }),
})
export default class Single extends Component {
  static propTypes = {
    data: PropTypes.shape({
      viewer: PropTypes.shape({
        post: PropTypes.object,
      }),
    }).isRequired,
  };

  content = null;
  bindRef = node => {
    this.content = node;
  };

  componentDidMount() {
    if (!this.content) {
      return;
    }

    const nodes = this.content.querySelectorAll(`figure.${embed}`);
    if (!nodes) {
      return;
    }

    const maxWidth = 740;
    nodes.forEach(node => {
      node.onclick = e => {
        e.preventDefault();

        const data = JSON.parse(
          node.querySelector('script[type="application/json"]').innerHTML
        );
        let width = data.width;
        let height = data.height;
        let html = data.html;
        if (html.indexOf('<iframe') === 0) {
          html = html.replace(/<iframe /, `<iframe class="${iframe}" `);
          if (width < maxWidth) {
            height = Math.ceil(height * maxWidth / width);
            width = maxWidth;
            html = html
              .replace(/width="[0-9]+"/, `width="${width}"`)
              .replace(/height="[0-9]+"/, `height="${height}"`);
          }
        }

        e.currentTarget.outerHTML = html;
      };
    });
  }

  render() {
    const { data: { error, loading } } = this.props;
    if (error) {
      return <Error />;
    } else if (loading) {
      return <Loading />;
    }

    const {
      viewer: {
        post: {
          id,
          slug,
          date,
          title: { rendered: title },
          content: { rendered: content },
          excerpt: { raw: excerpt },
          featuredMedia,
          tags,
          comments,
        },
      },
    } = this.props.data;

    const [, year, month, day] = dateRegex.exec(date);
    const url = `${SITE_URL}/${year}/${month}/${day}/${slug}`;
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
          <meta property="og:description" content={excerpt} />
          {featuredImage && <meta property="og:image" content={featuredImage} />}
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={excerpt} />
          {featuredImage && <meta name="twitter:image" content={featuredImage} />}
        </Helmet>
        <header>
          <Title dangerouslySetInnerHTML={{ __html: title }} />
          <Meta>
            Posted:{' '}
            <Link to={`/${year}/${month}`}>
              <FormattedRelative
                value={Date.parse(date)}
                style="numeric" // eslint-disable-line react/style-prop-object
              />
            </Link>
          </Meta>
        </header>
        {featuredMedia && <Media media={featuredMedia} crop={'large'} />}
        <Content
          innerRef={this.bindRef}
          dangerouslySetInnerHTML={{
            __html: convertPlaceholders(content, embed),
          }}
        />
        {tags &&
          <footer>
            Tags:{' '}
            {tags.map(tag =>
              <Tag key={tag.id} to={`/tag/${tag.slug}`}>
                {tag.name}
              </Tag>
            )}
          </footer>}
        <Comments post={{ id, slug }} comments={comments} />
      </ArticleWrapper>
    );
  }
}
