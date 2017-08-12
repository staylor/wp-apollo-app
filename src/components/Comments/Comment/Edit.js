import React, { Component } from 'react';
import { css } from 'emotion';
import styled from 'emotion/react';
import PropTypes from 'prop-types';
import { ResetButton, formField } from 'styles/components';
import { CommentType } from '../types';
import SubmitButton from './SubmitButton';

const Form = styled.form`margin: 0 0 20px;`;

const cancel = css`
  margin: 0 5px;
`;

export default class Edit extends Component {
  static propTypes = {
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

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  render() {
    const { comment, token, onEditSubmit } = this.props;
    return (
      <Form onSubmit={e => e.preventDefault()}>
        <textarea
          className={formField}
          rows="6"
          name="content"
          value={this.state.content}
          onChange={this.onChange}
        />
        <SubmitButton
          content={this.state.content}
          {...{ comment, token, onEditSubmit }}
        />
        <ResetButton className={cancel} type="reset" onClick={this.props.onEditSubmit}>
          Cancel
        </ResetButton>
      </Form>
    );
  }
}
