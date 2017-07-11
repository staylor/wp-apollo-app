import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, gql } from 'react-apollo';
import Helmet from 'react-helmet';
import Archive from 'components/Archive';
import Post from 'components/Post';
import { SITE_URL } from 'utils/constants';
import SearchBox from './Box';
import styles from './Search.scss';

@graphql(
  gql`
  query Search_Query($search: String, $count: Int = 10) {
    viewer {
      posts(search: $search, first: $count) {
        edges {
          node {
            ...Post_post
          }
          cursor
        }
        pageInfo {
          startCursor
          endCursor
          hasPreviousPage
          hasNextPage
        }
      }
    }
  }
  ${Post.fragments.post}
`,
  {
    options: { variables: { search: '' } },
  }
)
export default class Search extends Component {
  static propTypes = {
    data: PropTypes.shape({
      viewer: PropTypes.shape({
        tag: PropTypes.object,
        posts: PropTypes.object,
      }),
      refetch: PropTypes.func,
    }).isRequired,
  };

  state = {
    fetching: false,
  };

  term = null;
  count = 10;

  loadMore() {
    this.count += 10;
    this.props.data.refetch(
      {
        search: this.term,
        count: this.count,
      },
      null,
      e => {
        if (e) {
          // eslint-disable-next-line no-console
          console.log(e);
        }
      }
    );
  }

  onSetTerm(term) {
    this.setState({ fetching: true });
    this.count = 10;
    this.term = term;
  }

  onRefetch() {
    this.setState({ fetching: false });
  }

  render() {
    const { data: { refetch, fetchMore, viewer: { posts = null } } } = this.props;
    const showPosts = posts && !this.state.fetching;

    return (
      <div className={styles.sections}>
        <Helmet>
          <title>Search Results</title>
          <link rel="canonical" href={`${SITE_URL}/search`} />
        </Helmet>
        <section>
          <SearchBox
            refetch={refetch}
            pageInfo={posts && posts.pageInfo}
            onSetTerm={term => this.onSetTerm(term)}
            onRefetch={e => this.onRefetch(e)}
          />
          {showPosts && <Archive posts={posts} fetchMore={fetchMore} />}
          {showPosts &&
            posts.pageInfo.hasNextPage &&
            <button className={styles.button} onClick={() => this.loadMore()}>
              MORE
            </button>}
        </section>
      </div>
    );
  }
}
