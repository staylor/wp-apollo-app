import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, gql } from 'react-apollo';
import { Link } from 'found';
import Archive from 'components/Archive';
import Post from 'components/Post';
import Error from 'components/Error';
import Loading from 'components/Loading';
import styles from './Home.scss';

/* eslint-disable react/prefer-stateless-function */

@graphql(
  gql`
  query Home_Query(
    $stickiesTotal: Int = 2,
    $watchThisTotal: Int = 5,
    $readThisTotal: Int = 5,
    $listenToThisTotal: Int = 5,
  ) {
    viewer {
      stickies: posts(sticky: true, first: $stickiesTotal) {
        edges {
          node {
            ...Post_post
          }
          cursor
        }
      }
      readThis: posts(category: "read-this", sticky: false, first: $readThisTotal) {
        edges {
          node {
            ...Post_post
          }
          cursor
        }
      }
      watchThis: posts(category: "watch-this", first: $watchThisTotal) {
        edges {
          node {
            ...Post_post
          }
          cursor
        }
      }
      listenToThis: posts(category: "listen-to-this", first: $listenToThisTotal) {
        edges {
          node {
            ...Post_post
          }
          cursor
        }
      }
    }
  }
  ${Post.fragments.post}
`
)
export default class Home extends Component {
  static propTypes = {
    data: PropTypes.shape({
      viewer: PropTypes.shape({
        readThis: PropTypes.object,
        watchThis: PropTypes.object,
        listenToThis: PropTypes.object,
        stickies: PropTypes.object,
      }),
    }).isRequired,
  };

  render() {
    const { data: { loading, error } } = this.props;
    if (error) {
      return <Error />;
    } else if (loading) {
      return <Loading />;
    }

    const { viewer: { readThis, watchThis, listenToThis, stickies } } = this.props.data;

    return (
      <div className={styles.columns}>
        <div className={styles.columnA}>
          <section className={styles.section}>
            <h2 className={styles.header}>Latest</h2>
            <Archive posts={stickies} />
          </section>
          <section className={styles.section}>
            <h2 className={styles.header}>Read This</h2>
            <Archive posts={readThis} />
            <Link to={'/music/read-this'} className={styles.moreIn}>
              More posts in <em>Read This</em> »
            </Link>
          </section>
        </div>
        <div className={styles.columnB}>
          <section className={styles.section}>
            <h2 className={styles.header}>Watch This</h2>
            <Archive posts={watchThis} />
            <Link to={'/music/watch-this'} className={styles.moreIn}>
              More posts in <em>Watch This</em> »
            </Link>
          </section>
          <section className={styles.section}>
            <h2 className={styles.header}>Listen to This</h2>
            <Archive posts={listenToThis} />
            <Link to={'/music/listen-to-this'} className={styles.moreIn}>
              More posts in <em>Listen To This</em> »
            </Link>
          </section>
        </div>
      </div>
    );
  }
}
