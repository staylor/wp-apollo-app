import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, gql } from 'react-apollo';
import { Comment as CommentFragments } from 'fragments/Comments';
import { newlineRegex } from 'utils/regex';
import SingleQuery from 'queries/Single';
import { CommentType } from '../../types';
import styles from './Edit.scss';

@graphql(gql`
  mutation UpdateComment_Mutation($input: UpdateCommentInput!) {
    updateComment(input: $input) {
      comment {
        ...Comment_comment
      }
      cookies
      status
    }
  }
  ${CommentFragments.comment}
`)
export default class Edit extends Component {
  static propTypes = {
    post: PropTypes.shape({
      id: PropTypes.string,
      slug: PropTypes.string,
    }).isRequired,
    mutate: PropTypes.func.isRequired,
    comment: CommentType.isRequired,
    token: PropTypes.string.isRequired,
    onEditSubmit: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      content: props.comment.content.raw,
    };
  }

  onEdit = e => {
    e.preventDefault();

    this.props.onEditSubmit();

    const variables = {
      input: {
        id: this.props.comment.id,
        content: this.state.content,
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

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  render() {
    return (
      <form onSubmit={e => e.preventDefault()} className={styles.form}>
        <textarea
          className={styles.content}
          rows="6"
          name="content"
          value={this.state.content}
          onChange={this.onChange}
        />
        <button type="submit" className={styles.button} onClick={this.onEdit}>
          Submit
        </button>
        <button type="reset" className={styles.cancel} onClick={this.props.onEditSubmit}>
          Cancel
        </button>
      </form>
    );
  }
}
