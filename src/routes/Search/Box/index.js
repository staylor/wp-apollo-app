import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'debounce';
import Loading from 'components/Loading';
import styles from './Box.scss';

export default class Box extends Component {
  static propTypes = {
    refetch: PropTypes.func.isRequired,
    onSetTerm: PropTypes.func.isRequired,
    onRefetch: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    pageInfo: PropTypes.object,
  };

  static defaultProps = {
    pageInfo: null,
  };

  state = {
    term: '',
    fetching: false,
  };

  refetchVariables = fragmentVariables => ({
    ...fragmentVariables,
    search: this.state.term,
  });

  doRefetch = debounce(() => {
    this.setState({ fetching: true });
    this.props.refetch(this.refetchVariables, null, e => {
      if (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
      this.props.onRefetch(e);
      this.setState({ fetching: false });
    });
  }, 600);

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });

    this.props.onSetTerm(e.target.value);
    this.doRefetch();
  };

  render() {
    const { pageInfo } = this.props;
    let title = 'Search the Archive';
    const searching = this.state.term && (this.state.fetching || !pageInfo);

    if (this.state.term) {
      if (searching) {
        title = `Searching the archive for “${this.state.term}”`;
      } else {
        title = `Search Results for “${this.state.term}”`;
      }
    }

    return (
      <section className={styles.box}>
        <h2 className={styles.label}>
          {title}
        </h2>
        <form>
          <label className={styles.a11y} htmlFor="field-term">
            Search Term
          </label>
          <input
            className={styles.input}
            type="search"
            id="field-term"
            name="term"
            value={this.state.term}
            onChange={this.onChange}
          />
        </form>
        {searching && <Loading />}
      </section>
    );
  }
}
