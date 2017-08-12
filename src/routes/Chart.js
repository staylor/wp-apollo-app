import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import Loading from 'components/Loading';
import Error from 'components/Error';
import ChartQuery from 'graphql/Chart_Query.graphql';
import styled from 'emotion/react';
import { clear } from 'styles/global';
import { withTheme } from 'theming';
import { ArticleWrapper, header1 } from 'styles/components';

const Image = styled.img`
  display: block;
  float: left;
  margin: 0 10px 0 0;
`;

const List = styled.ol`list-style: decimal;`;

const Item = styled.li`
  composes: ${clear};
  display: list-item;
  margin: 10px 0 10px 20px;
  padding: 0 0 0 7px;
`;

const Title = withTheme(styled.h1`
  composes: ${header1};
  clear: both;
  font-size: 36px;
  font-weight: bold;
  line-height: 42px;
  margin: 0 0 10px;

  & a {
    color: ${p => p.theme.colors.dark};
    text-decoration: none;
  }
`);

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
      <ArticleWrapper>
        <header>
          <Title>
            <a href={chart.authorUri}>
              {chart.authorName}
            </a>
          </Title>
        </header>
        <List>
          {chart.items.map(({ title, url, artist, releaseDateFormatted, images }) =>
            <Item key={url}>
              {images.length && <Image src={images[0].url} alt="" />}
              <a href={url} target="_blank" rel="noopener noreferrer">
                {title} - {artist}
              </a>
              <p>
                <strong>Released:</strong> {releaseDateFormatted}
              </p>
            </Item>
          )}
        </List>
      </ArticleWrapper>
    );
  }
}
