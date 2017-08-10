import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { graphql } from 'react-apollo';
import md5 from 'md5';
import { newlineRegex } from 'utils/regex';
import AddCommentMutation from 'graphql/AddComment_Mutation.graphql';
import { AUTHOR_NAME_COOKIE, AUTHOR_EMAIL_COOKIE, AUTHOR_URL_COOKIE } from '../constants';
import styles from './Form.scss';

const fields = {
  authorName: { name: 'Name', cookie: AUTHOR_NAME_COOKIE },
  authorEmail: { name: 'Email', cookie: AUTHOR_EMAIL_COOKIE },
  authorUrl: { name: 'URL', cookie: AUTHOR_URL_COOKIE },
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

@graphql(AddCommentMutation)
@withCookies
export default class Form extends Component {
  static contextTypes = {
    queryConfig: PropTypes.object,
    postId: PropTypes.string,
  };

  static propTypes = {
    cookies: PropTypes.instanceOf(Cookies).isRequired,
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
        post: this.context.postId,
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
          authorName: variables.input.authorName,
          authorEmail: variables.input.authorEmail,
          authorUrl: variables.input.authorUrl,
          authorHash: '',
          date: new Date().toISOString(),
          content: {
            __typename: 'Content',
            raw: variables.input.content,
            rendered: `<p>${variables.input.content.replace(newlineRegex, '<br />')}</p>`,
          },
          authorAvatarUrls: [
            {
              __typename: 'Avatar',
              size: 48,
              url: `http://2.gravatar.com/avatar/${md5(
                variables.input.authorEmail
              )}?s=48&d=mm&r=g`,
            },
          ],
          post: this.context.postId,
          parent: variables.input.parent || null,
        },
        status: 'new',
        cookies: '',
      },
    };

    const queryVars = {
      ...this.context.queryConfig,
    };

    this.props
      .mutate({
        variables,
        optimisticResponse,
        refetchQueries: [queryVars],
        update: (store, { data: { addComment } }) => {
          if (!addComment.comment) {
            // eslint-disable-next-line no-alert
            alert(addComment.status);
            return;
          }
          const data = store.readQuery(queryVars);
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
