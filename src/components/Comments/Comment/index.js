import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import md5 from 'md5';
import { withCookies, Cookies } from 'react-cookie';
import { intlShape } from 'react-intl';
import withIntl from 'decorators/withIntl';
import EditComment from './Edit';
import DeleteButton from './DeleteButton';
import { AUTHOR_EMAIL_COOKIE } from '../constants';
import { CommentType } from '../types';
import styles from './Comment.scss';

/* eslint-disable react/no-danger */
/* eslint-disable react/forbid-prop-types */

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
      comment: {
        id,
        date,
        authorUrl,
        authorName,
        authorAvatarUrls,
        content: { rendered: content },
      },
    } = this.props;
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
      commentContent = (
        <div className={styles.content} dangerouslySetInnerHTML={{ __html: content }} />
      );
    }

    return (
      <div className={styles.comment}>
        <div className={styles.meta}>
          {avatar ? <img alt="" className={styles.image} src={avatar.url} /> : null}
          <span className={styles.author}>
            {authorDisplay}
          </span>
          <span className={styles.time}>
            {this.props.intl.formatRelative(date)}
          </span>
        </div>
        {commentContent}
        <button
          className={cn(styles.reply, {
            [styles.active]: this.props.active,
          })}
          onClick={() => this.onClick(id)}
        >
          ↵
        </button>
        {this.viewerOwns() &&
          !this.state.editing &&
          <div className={styles.actions}>
            <button className={styles.edit} onClick={this.onEditClick}>
              Edit
            </button>
            <DeleteButton editToken={this.editToken} comment={this.props.comment} />
          </div>}
      </div>
    );
  }
}
