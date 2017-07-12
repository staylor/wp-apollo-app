import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import Loading from 'components/Loading';
import Error from 'components/Error';
import ChartQuery from 'graphql/Chart_Query.graphql';
import styles from './Chart.scss';

/* eslint-disable react/prefer-stateless-function */

@graphql(ChartQuery)
export default class Chart extends Component {
  static propTypes = {
    data: PropTypes.shape({
      viewer: PropTypes.shape({
        chart: PropTypes.object,
      }),
    }).isRequired,
  };

  render() {
    const { data: { error, loading } } = this.props;
    if (error) {
      return <Error />;
    } else if (loading) {
      return <Loading />;
    }

    const { viewer: { chart } } = this.props.data;
    if (!chart) {
      return <Error />;
    }

    return (
      <article className={styles.content}>
        <header>
          <h1 className={styles.title}>
            <a href={chart.authorUri}>
              {chart.authorName}
            </a>
          </h1>
        </header>
        <ol className={styles.list}>
          {chart.items.map(({ title, url, artist, releaseDateFormatted, images }) =>
            <li key={url} className={styles.item}>
              {images.length &&
                <img src={images[0].url} alt="" className={styles.image} />}
              <a href={url} target="_blank" rel="noopener noreferrer">
                {title} - {artist}
              </a>
              <p>
                <strong>Released:</strong> {releaseDateFormatted}
              </p>
            </li>
          )}
        </ol>
      </article>
    );
  }
}
