import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { graphql, gql } from 'react-apollo';
import md5 from 'md5';
import SingleQuery from 'queries/Single';
import { newlineRegex } from 'utils/regex';
import { Comment as CommentFragments } from '../fragments';
import { AUTHOR_NAME_COOKIE, AUTHOR_EMAIL_COOKIE, AUTHOR_URL_COOKIE } from '../constants';
import styles from './Form.scss';

const fields = {
  author_name: { name: 'Name', cookie: AUTHOR_NAME_COOKIE },
  author_email: { name: 'Email', cookie: AUTHOR_EMAIL_COOKIE },
  author_url: { name: 'URL', cookie: AUTHOR_URL_COOKIE },
};

const getDefaultState = props => {
  const state = {
    content: '',
  };

  Object.keys(fields).forEach(field => {
    state[field] = props.cookies.get(fields[field].cookie) || '';
  });

  return state;
};

@graphql(gql`
  mutation AddComment_Mutation($input: AddCommentInput!) {
    addComment(input: $input) {
      comment {
        ...Comment_comment
      }
      cookies
      status
    }
  }
  ${CommentFragments.comment}
`)
@withCookies
export default class Form extends Component {
  static propTypes = {
    cookies: PropTypes.instanceOf(Cookies).isRequired,
    post: PropTypes.shape({
      id: PropTypes.string,
      slug: PropTypes.string,
    }).isRequired,
    replyTo: PropTypes.string,
    setReplyTo: PropTypes.func.isRequired,
    mutate: PropTypes.func.isRequired,
  };

  static defaultProps = {
    replyTo: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      comment: getDefaultState(props),
    };
  }

  onClick = e => {
    e.preventDefault();
    e.currentTarget.blur();

    const variables = {
      input: {
        ...this.state.comment,
        post: this.props.post.id,
      },
    };

    if (this.props.replyTo) {
      variables.input.parent = this.props.replyTo;
    }

    const optimisticResponse = {
      __typename: 'Mutation',
      addComment: {
        __typename: 'AddCommentPayload',
        comment: {
          __typename: 'Comment',
          id: '',
          author_name: variables.input.author_name,
          author_email: variables.input.author_email,
          author_url: variables.input.author_url,
          author_hash: '',
          date: new Date().toISOString(),
          content: {
            __typename: 'Content',
            raw: variables.input.content,
            rendered: `<p>${variables.input.content.replace(newlineRegex, '<br />')}</p>`,
          },
          author_avatar_urls: [
            {
              __typename: 'Avatar',
              size: 48,
              url: `http://2.gravatar.com/avatar/${md5(
                variables.input.author_email
              )}?s=48&d=mm&r=g`,
            },
          ],
          post: this.props.post.id,
          parent: variables.input.parent || null,
        },
        status: 'new',
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

    this.props
      .mutate({
        variables,
        optimisticResponse,
        refetchQueries: [{ ...queryVars }],
        update: (store, { data: { addComment } }) => {
          const data = store.readQuery({ ...queryVars });
          data.viewer.post.comments.edges.push({
            __typename: 'CommentEdge',
            node: {
              __typename: 'Comment',
              ...addComment.comment,
            },
          });
          store.writeQuery({ ...queryVars, data });
        },
      })
      .then(({ data }) => {
        if (data.addComment && data.addComment.cookies) {
          const values = data.addComment.cookies.split(',');
          values.forEach(cookie => {
            document.cookie = cookie;
          });
        }
        this.setState({
          comment: getDefaultState(this.props),
        });
      });
  };

  onChange = e => {
    this.setState({
      comment: {
        ...this.state.comment,
        [e.target.name]: e.target.value,
      },
    });
  };

  onCancel = () => {
    this.props.setReplyTo(null);
  };

  render() {
    const { cookies } = this.props;

    return (
      <form className={styles.form} onSubmit={e => e.preventDefault()}>
        {Object.keys(fields).map(field => {
          const cookieVal = cookies.get(fields[field].cookie);
          return (
            <p key={field}>
              <label htmlFor={`field-${field}`}>
                {fields[field].name}:
              </label>
              {cookieVal ||
                <input
                  type="text"
                  id={`field-${field}`}
                  name={field}
                  value={this.state.comment[field]}
                  onChange={this.onChange}
                />}
            </p>
          );
        })}
        <p>
          <label htmlFor="field-content">Comment:</label>
          <textarea
            rows="6"
            id="field-content"
            name="content"
            value={this.state.comment.content}
            onChange={this.onChange}
          />
        </p>
        <button type="submit" className={styles.button} onClick={this.onClick}>
          Submit
        </button>
        {this.props.replyTo
          ? <button type="reset" className={styles.reset} onClick={this.onCancel}>
              Cancel
            </button>
          : null}
      </form>
    );
  }
}
