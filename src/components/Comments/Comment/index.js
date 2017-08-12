import React, { Component } from 'react';
import { css } from 'emotion';
import styled from 'emotion/react';
import { withTheme } from 'theming';
import PropTypes from 'prop-types';
import cn from 'classnames';
import md5 from 'md5';
import { withCookies, Cookies } from 'react-cookie';
import { intlShape } from 'react-intl';
import withIntl from 'decorators/withIntl';
import { clear } from 'styles/global';
import theme from 'styles/theme';
import EditComment from './Edit';
import DeleteButton from './DeleteButton';
import { AUTHOR_EMAIL_COOKIE } from '../constants';
import { CommentType } from '../types';

/* eslint-disable react/no-danger */
/* eslint-disable react/forbid-prop-types */

const Wrapper = withTheme(styled.div`
  border-bottom: 1px solid ${p => p.theme.colors.detail};
  position: relative;
`);

const Meta = styled.div`composes: ${clear};`;

const Image = styled.img`
  float: left;
  margin: 0 10px 10px 0;
`;

const Content = styled.div`
  p {
    font-size: 12px;
    line-height: 15px;
  }
`;

const Reply = styled.button`
  background: none;
  border: 0;
  cursor: pointer;
  font-size: 16px;
  line-height: 20px;
  padding: 0;
  position: absolute;
  right: 0;
  top: 0;

  &:active,
  &:focus {
    outline: 0 none;
  }
`;

const Actions = styled.div`margin: 5px 0;`;

const active = css`color: ${theme.colors.pink};`;

const EditButton = withTheme(styled.button`
  background: transparent;
  border: 1px solid ${p => p.theme.colors.detail};
  cursor: pointer;
  transition: 600ms;

  &:hover {
    border: 1px solid ${p => p.theme.colors.dark};
  }

  &:active,
  &:focus {
    outline: 0 none;
  }
`);

const Author = withTheme(styled.span`
  display: block;
  text-transform: uppercase;

  a {
    color: ${p => p.theme.colors.dark};
  }
`);
const Time = styled.span`display: block;`;

@withIntl
@withCookies
export default class Comment extends Component {
  static propTypes = {
    cookies: PropTypes.instanceOf(Cookies).isRequired,
    active: PropTypes.bool.isRequired,
    setReplyTo: PropTypes.func.isRequired,
    comment: CommentType.isRequired,
    intl: intlShape.isRequired,
  };

  editToken = null;

  state = {
    editing: false,
  };

  onClick = id => {
    if (this.props.active) {
      this.props.setReplyTo(null);
    } else {
      this.props.setReplyTo(id);
    }
  };

  onEditClick = () => {
    this.setState({
      editing: true,
    });
  };

  onEditSubmit = () => {
    this.setState({
      editing: false,
    });
  };

  viewerOwns() {
    const { comment, cookies } = this.props;
    const authorEmail = cookies.get(AUTHOR_EMAIL_COOKIE);
    if (!authorEmail) {
      return false;
    }
    const tokenKey = encodeURIComponent(`token_${comment.id}`);
    this.editToken = cookies.get(tokenKey);
    if (!this.editToken) {
      return false;
    }
    const values = md5(`${comment.id}${authorEmail}`);
    return values === this.props.comment.authorHash;
  }

  render() {
    const {
      id,
      date,
      authorUrl,
      authorName,
      authorAvatarUrls,
      content: { rendered: content },
    } = this.props.comment;
    const avatar = authorAvatarUrls && authorAvatarUrls.find(data => data.size === 48);
    let authorDisplay = authorName;
    if (authorUrl) {
      authorDisplay = (
        <a href={authorUrl}>
          {authorName}
        </a>
      );
    }

    let commentContent = null;
    if (this.state.editing) {
      commentContent = (
        <EditComment
          token={this.editToken}
          comment={this.props.comment}
          onEditSubmit={this.onEditSubmit}
        />
      );
    } else {
      commentContent = <Content dangerouslySetInnerHTML={{ __html: content }} />;
    }

    return (
      <Wrapper>
        <Meta>
          {avatar ? <Image alt="" src={avatar.url} /> : null}
          <Author>
            {authorDisplay}
          </Author>
          <Time>
            {this.props.intl.formatRelative(date)}
          </Time>
        </Meta>
        {commentContent}
        <Reply
          className={cn({ [active]: this.props.active })}
          onClick={() => this.onClick(id)}
        >
          ↵
        </Reply>
        {this.viewerOwns() &&
          !this.state.editing &&
          <Actions>
            <EditButton onClick={this.onEditClick}>Edit</EditButton>
            <DeleteButton editToken={this.editToken} comment={this.props.comment} />
          </Actions>}
      </Wrapper>
    );
  }
}
