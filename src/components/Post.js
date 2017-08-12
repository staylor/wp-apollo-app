import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';
import { withTheme } from 'theming';
import { routerShape } from 'found/lib/PropTypes';
import Media from 'components/Media';
import { convertPlaceholders } from 'utils';
import { dateRegex } from 'utils/regex';
import { header1, embed } from 'styles/components';
import PostLink from './PostLink';

/* eslint-disable react/no-danger */

const Article = withTheme(styled.article`margin: 0 0 ${p => p.theme.padding}px;`);

const Title = withTheme(styled.h1`
  composes: ${header1};
  font-size: 18px;
  line-height: 24px;
  margin: 0 0 ${p => p.theme.padding}px;

  & a {
    color: ${p => p.theme.colors.subhead};
    text-decoration: none;
  }
`);

const Content = withTheme(styled.section`
  & p {
    margin: 0 0 ${p => p.theme.padding}px;
  }
`);

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
      <Article>
        <header>
          <Title>
            <PostLink post={this.props.post} />
          </Title>
        </header>
        {featuredMedia &&
          <PostLink post={this.props.post}>
            <Media media={featuredMedia} />
          </PostLink>}
        <Content
          innerRef={this.bindRef}
          dangerouslySetInnerHTML={{ __html: postContent }}
        />
      </Article>
    );
  }
}
