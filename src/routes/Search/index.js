import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, gql } from 'react-apollo';
import Helmet from 'react-helmet';
import Archive from 'components/Archive';
import Error from 'components/Error';
import Loading from 'components/Loading';
import { SITE_URL } from 'utils/constants';
import debounce from 'debounce';
import styles from './Search.scss';

@graphql(
  gql`
  query Search_Query($search: String, $count: Int, $cursor: String) {
    viewer {
      posts(search: $search, first: $count, after: $cursor) {
        ...Archive_posts
      }
    }
  }
  ${Archive.fragments.posts}
`,
  {
    options: { variables: { search: '', count: 10 } },
  }
)
export default class Search extends Component {
  static propTypes = {
    data: PropTypes.shape({
      viewer: PropTypes.shape({
        posts: PropTypes.object,
      }),
      variables: PropTypes.object,
      refetch: PropTypes.func,
      fetchMore: PropTypes.func,
    }).isRequired,
  };

  input = null;

  state = {
    term: '',
  };

  doRefetch = debounce(() => {
    this.props.data
      .refetch({
        ...this.props.data.variables,
        search: this.state.term,
      })
      .catch(e => {
        if (e) {
          // eslint-disable-next-line no-console
          console.log(e);
        }
      })
      .then(() => {
        this.input.blur();
      });
  }, 600);

  onChange = e => {
    this.setState({
      term: e.target.value,
    });
    this.doRefetch();
  };

  render() {
    const {
      data: { loading, error, variables, fetchMore, viewer },
    } = this.props;
    if (error) {
      return <Error />;
    }

    const pageInfo = viewer && viewer.posts && viewer.posts.pageInfo;

    let title = 'Search the Archive';
    const searching = this.state.term && (loading || !pageInfo);

    if (this.state.term) {
      if (searching) {
        title = `Searching the archive for “${this.state.term}”`;
      } else {
        title = `Search Results for “${this.state.term}”`;
      }
    }

    return (
      <div className={styles.sections}>
        <Helmet>
          <title>Search Results</title>
          <link rel="canonical" href={`${SITE_URL}/search`} />
        </Helmet>
        <section>
          <section className={styles.box}>
            <h2 className={styles.label}>
              {title}
            </h2>
            <form>
              <label className={styles.a11y} htmlFor="field-term">
                Search Term
              </label>
              <input
                ref={input => {
                  this.input = input;
                }}
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
          {viewer &&
            viewer.posts &&
            !loading &&
            <Archive {...{ variables, posts: viewer.posts, fetchMore }} />}
        </section>
      </div>
    );
  }
}
