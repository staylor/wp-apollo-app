import React from 'react';
import PropTypes from 'prop-types';
import { gql } from 'react-apollo';
import Walker from './Walker';
import { CommentConnectionType } from './types';
import styles from './Comments.scss';

export default function Comments({ post, comments }) {
  return (
    <aside className={styles.comments}>
      <h2 className={styles.header}>Comments</h2>
      <Walker post={post} comments={comments} />
    </aside>
  );
}

Comments.fragments = {
  comments: gql`
    fragment Comments_comments on CommentConnection {
      ...Walker_comments
    }
    ${Walker.fragments.comments}
  `,
};

Comments.propTypes = {
  post: PropTypes.string.isRequired,
  comments: CommentConnectionType,
};

Comments.defaultProps = {
  comments: null,
};
