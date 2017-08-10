import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CommentType } from '../../types';
import SubmitButton from './SubmitButton';
import styles from './Edit.scss';

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
      <form onSubmit={e => e.preventDefault()} className={styles.form}>
        <textarea
          className={styles.content}
          rows="6"
          name="content"
          value={this.state.content}
          onChange={this.onChange}
        />
        <SubmitButton
          content={this.state.content}
          {...{ comment, token, onEditSubmit }}
        />
        <button type="reset" className={styles.cancel} onClick={this.props.onEditSubmit}>
          Cancel
        </button>
      </form>
    );
  }
}
