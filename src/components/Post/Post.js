import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { gql } from 'react-apollo';
import { routerShape } from 'found/lib/PropTypes';
import Media from 'components/Media';
import { convertPlaceholders } from 'utils';
import { dateRegex } from 'utils/regex';
import PostLink from './PostLink';
import styles from './Post.scss';

/* eslint-disable react/no-danger */

export default class Post extends Component {
  static fragments = {
    post: gql`
      fragment Post_post on Post {
        id
        slug
        date
        title {
          rendered
        }
        content {
          rendered
        }
        excerpt {
          rendered
        }
        featuredMedia {
          ...Media_media
        }
        ...PostLink_post
      }
      ${PostLink.fragments.post}
      ${Media.fragments.media}
    `,
  };

  static propTypes = {
    post: PropTypes.shape({
      id: PropTypes.string,
      slug: PropTypes.string,
      date: PropTypes.string,
      title: PropTypes.object,
      content: PropTypes.object,
      excerpt: PropTypes.object,
      featuredMedia: PropTypes.object,
    }).isRequired,
  };

  static contextTypes = {
    router: routerShape.isRequired,
  };

  content = null;
  bindRef = node => {
    this.content = node;
  };

  componentDidMount() {
    const nodes = this.content.querySelectorAll(`figure.${styles.embed}`);
    if (!nodes) {
      return;
    }
    nodes.forEach(node => {
      node.onclick = e => {
        e.preventDefault();

        const { id, date } = this.props.post;
        const [, year, month, day] = dateRegex.exec(date);
        const url = `/${year}/${month}/${day}/${id}`;

        this.context.router.push(url);
      };
    });
  }

  render() {
    const {
      content: { rendered: content },
      excerpt: { rendered: excerpt },
      featuredMedia,
    } = this.props.post;

    const isEmbed = content.indexOf('<figure') === 0;
    const postContent = isEmbed ? convertPlaceholders(content, styles) : excerpt;

    return (
      <article>
        <header>
          <h1 className={styles.title}>
            <PostLink post={this.props.post} />
          </h1>
        </header>
        {featuredMedia &&
          <PostLink post={this.props.post}>
            <Media media={featuredMedia} />
          </PostLink>}
        <section
          ref={this.bindRef}
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: postContent }}
        />
      </article>
    );
  }
}
