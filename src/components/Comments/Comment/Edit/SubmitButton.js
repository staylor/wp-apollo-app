import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import UpdateCommentMutation from 'graphql/UpdateComment_Mutation.graphql';
import SingleQuery from 'graphql/Single_Query.graphql';
import { newlineRegex } from 'utils/regex';
import { CommentType } from '../../types';
import styles from './Edit.scss';

@graphql(UpdateCommentMutation)
export default class SubmitButton extends Component {
  static propTypes = {
    content: PropTypes.string.isRequired,
    post: PropTypes.shape({
      id: PropTypes.string,
      slug: PropTypes.string,
    }).isRequired,
    mutate: PropTypes.func.isRequired,
    comment: CommentType.isRequired,
    token: PropTypes.string.isRequired,
    onEditSubmit: PropTypes.func.isRequired,
  };

  onEdit = e => {
    e.preventDefault();

    this.props.onEditSubmit();

    const variables = {
      input: {
        id: this.props.comment.id,
        content: this.props.content,
        token: this.props.token,
      },
    };

    const content = {
      __typename: 'Content',
      rendered: `<p>${variables.input.content.replace(newlineRegex, '<br />')}</p>`,
      raw: variables.input.content,
    };

    const optimisticResponse = {
      updateComment: {
        __typename: 'UpdateCommentPayload',
        comment: {
          __typename: 'Comment',
          ...this.props.comment,
          content,
        },
        status: 'update',
        cookies: '',
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
      update: (store, { data: { updateComment } }) => {
        const data = store.readQuery({ ...queryVars });
        const comment = data.viewer.post.comments.edges.find(
          ({ node }) => node.id === updateComment.comment.id
        );
        comment.content = content;
        store.writeQuery({ ...queryVars, data });
      },
    });
  };

  render() {
    return (
      <button type="submit" className={styles.button} onClick={this.onEdit}>
        Submit
      </button>
    );
  }
}
