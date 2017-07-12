import React from 'react';
import PropTypes from 'prop-types';
import CommentsFragments from './fragments';
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

Comments.fragments = CommentsFragments;

Comments.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string,
    slug: PropTypes.string,
  }).isRequired,
  comments: CommentConnectionType,
};

Comments.defaultProps = {
  comments: null,
};
