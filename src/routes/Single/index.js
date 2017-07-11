import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { graphql } from 'react-apollo';
import { Link } from 'found';
import { FormattedRelative } from 'react-intl';
import Media from 'components/Media';
import Comments from 'components/Comments';
import Error from 'components/Error';
import Loading from 'components/Loading';
import SingleQuery from 'queries/Single';
import { convertPlaceholders } from 'utils';
import { dateRegex } from 'utils/regex';
import { SITE_URL } from 'utils/constants';
import styles from './Single.scss';

/* eslint-disable react/no-danger */

@graphql(SingleQuery, {
  options: ({ params: { slug } }) => ({
    variables: {
      slug,
      commentCount: 100,
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

    const nodes = this.content.querySelectorAll(`figure.${styles.embed}`);
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
          html = html.replace(/<iframe /, `<iframe class="${styles.iframe}" `);
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
          <meta property="og:description" content={excerpt} />
          {featuredImage && <meta property="og:image" content={featuredImage} />}
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={excerpt} />
          {featuredImage && <meta name="twitter:image" content={featuredImage} />}
        </Helmet>
        <header>
          <h1 className={styles.title} dangerouslySetInnerHTML={{ __html: title }} />
          <div className={styles.meta}>
            Posted:{' '}
            <Link to={`/${year}/${month}`}>
              <FormattedRelative
                value={Date.parse(date)}
                style="numeric" // eslint-disable-line react/style-prop-object
              />
            </Link>
          </div>
        </header>
        {featuredMedia && <Media media={featuredMedia} crop={'large'} />}
        <section
          ref={this.bindRef}
          dangerouslySetInnerHTML={{
            __html: convertPlaceholders(content, styles),
          }}
        />
        {tags &&
          <footer className={styles.footer}>
            Tags:{' '}
            {tags.map(tag =>
              <Link key={tag.id} to={`/tag/${tag.slug}`}>
                {tag.name}
              </Link>
            )}
          </footer>}
        <Comments post={{ id, slug }} comments={comments} />
      </article>
    );
  }
}
