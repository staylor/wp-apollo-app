import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import styled from 'emotion/react';
import { withTheme } from 'theming';
import { withCookies, Cookies } from 'react-cookie';
import { graphql } from 'react-apollo';
import md5 from 'md5';
import { newlineRegex } from 'utils/regex';
import AddCommentMutation from 'graphql/AddComment_Mutation.graphql';
import { SubmitButton, ResetButton, formField } from 'styles/components';
import { AUTHOR_NAME_COOKIE, AUTHOR_EMAIL_COOKIE, AUTHOR_URL_COOKIE } from './constants';

const CommentForm = styled.form`
  margin: 20px 0 40px;
  width: 300px;
`;

const Field = styled.p`margin: 5px 0;`;

const Label = withTheme(styled.label`
  display: block;
  font-family: ${p => p.theme.fonts.futura};
  font-size: 16px;
  line-height: 20px;
`);

const submit = css`
  font-size: 16px;
  line-height: 20px;
  padding: 8px;
  width: 80px;
`;

const reset = css`
  font-size: 16px;
  line-height: 20px;
  margin: 0 10px;
  padding: 8px;
`;

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
      <CommentForm onSubmit={e => e.preventDefault()}>
        {Object.keys(fields).map(field => {
          const cookieVal = cookies.get(fields[field].cookie);
          return (
            <Field key={field}>
              <Label htmlFor={`field-${field}`}>
                {fields[field].name}:
              </Label>
              {cookieVal ||
                <input
                  className={formField}
                  type="text"
                  id={`field-${field}`}
                  name={field}
                  value={this.state.comment[field]}
                  onChange={this.onChange}
                />}
            </Field>
          );
        })}
        <Field>
          <Label htmlFor="field-content">Comment:</Label>
          <textarea
            className={formField}
            rows="6"
            id="field-content"
            name="content"
            value={this.state.comment.content}
            onChange={this.onChange}
          />
        </Field>
        <SubmitButton className={submit} type="submit" onClick={this.onClick}>
          Submit
        </SubmitButton>
        {this.props.replyTo
          ? <ResetButton className={reset} type="reset" onClick={this.onCancel}>
              Cancel
            </ResetButton>
          : null}
      </CommentForm>
    );
  }
}
