import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import Helmet from 'react-helmet';
import Archive from 'components/Archive';
import Error from 'components/Error';
import Loading from 'components/Loading';
import DateQuery from 'graphql/Date_Query.graphql';
import { SITE_URL } from 'utils/constants';
import { ContentWrapper, Heading } from 'styles/components';

/* eslint-disable react/prefer-stateless-function */

@graphql(DateQuery, {
  options: ({ params }) => {
    const variables = ['year', 'month', 'day'].reduce((memo, value) => {
      if (params[value]) {
        memo[value] = parseInt(params[value], 10);
      }
      return memo;
    }, {});

    return {
      variables: {
        ...variables,
        count: 10,
      },
    };
  },
})
export default class DateRoute extends Component {
  static propTypes = {
    data: PropTypes.shape({
      fetchMore: PropTypes.func,
      variables: PropTypes.object,
      viewer: PropTypes.shape({
        posts: PropTypes.object,
      }),
    }).isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    params: PropTypes.object.isRequired,
  };

  render() {
    const { params, data: { loading, error } } = this.props;
    if (error) {
      return <Error />;
    } else if (loading) {
      return <Loading />;
    }

    const { variables, fetchMore, viewer: { posts } } = this.props.data;
    const values = [params.month, params.day, params.year].filter(value => value);
    const path = values.join('/');
    const title = `Archives: ${path}`;

    return (
      <ContentWrapper>
        <Helmet>
          <title>
            {title}
          </title>
          <link rel="canonical" href={`${SITE_URL}/${path}`} />
        </Helmet>
        <Heading>
          {title}
        </Heading>
        <Archive {...{ posts, fetchMore, variables }} />
      </ContentWrapper>
    );
  }
}
