import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, gql } from 'react-apollo';
import SingleQuery from 'queries/Single';
import { CommentType } from '../types';
import styles from './Comment.scss';

@graphql(gql`
  mutation DeleteComment_Mutation($input: DeleteCommentInput!) {
    deleteComment(input: $input) {
      status
    }
  }
`)
export default class DeleteButton extends Component {
  static propTypes = {
    post: PropTypes.shape({
      id: PropTypes.string,
      slug: PropTypes.string,
    }).isRequired,
    mutate: PropTypes.func.isRequired,
    editToken: PropTypes.string.isRequired,
    comment: CommentType.isRequired,
  };

  onDelete = () => {
    const optimisticResponse = {
      deleteComment: {
        __typename: 'DeleteCommentPayload',
        status: 'pending',
      },
    };

    const variables = {
      input: {
        id: this.props.comment.id,
        post: this.props.comment.post,
        token: this.props.editToken,
      },
    };

    const queryVars = {
      query: SingleQuery,
      variables: {
        // emoji and unicode get encoded
        slug: decodeURIComponent(this.props.post.slug),
        commentCount: 100,
      },
    };

    this.props.mutate({
      variables,
      optimisticResponse,
      refetchQueries: [{ ...queryVars }],
      update: (store, { data: { deleteComment } }) => {
        if (deleteComment.status === 'pending') {
          return;
        }
        const data = store.readQuery({ ...queryVars });
        const edges = data.viewer.post.comments.edges;
        const commentIndex = edges.find(
          ({ node }, index) => node.id === this.props.comment.id && index
        );
        edges.splice(commentIndex, 1);
        store.writeQuery({ ...queryVars, data });
      },
    });
  };

  render() {
    return (
      <button className={styles.deletion} onClick={this.onDelete}>
        Delete
      </button>
    );
  }
}
