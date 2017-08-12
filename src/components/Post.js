import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { routerShape } from 'found/lib/PropTypes';
import Media from 'components/Media';
import { convertPlaceholders } from 'utils';
import { dateRegex } from 'utils/regex';
import styled from 'emotion/react';
import { header1, embed } from 'styles/components';
import PostLink from './PostLink';

/* eslint-disable react/no-danger */

const Title = styled.h1`
  composes: ${header1};
  font-size: 18px;
  line-height: 24px;
  margin: 0 0 10px;

  & a {
    color: #222;
    text-decoration: none;
  }
`;

export default class Post extends Component {
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
    const nodes = this.content.querySelectorAll(`figure.${embed}`);
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
    const postContent = isEmbed ? convertPlaceholders(content, embed) : excerpt;

    return (
      <article>
        <header>
          <Title>
            <PostLink post={this.props.post} />
          </Title>
        </header>
        {featuredMedia &&
          <PostLink post={this.props.post}>
            <Media media={featuredMedia} />
          </PostLink>}
        <section
          ref={this.bindRef}
          css={`
            p {
              margin: 0 0 20px;
            }
          `}
          dangerouslySetInnerHTML={{ __html: postContent }}
        />
      </article>
    );
  }
}
