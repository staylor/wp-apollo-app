import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';
import { withTheme } from 'theming';
import { graphql } from 'react-apollo';
import { Link } from 'found';
import Archive from 'components/Archive';
import Error from 'components/Error';
import Loading from 'components/Loading';
import HomeQuery from 'graphql/Home_Query.graphql';
import { clear, uppercaseHeader } from 'styles/components';

const HomeWrapper = styled.div`composes: ${clear};`;
const HomeSection = styled.section`margin: 0 0 40px;`;
const HomeHeader = styled.h2`composes: ${uppercaseHeader};`;

const ColumnA = styled.div`
  float: left;
  margin: 0 2em 0 0;
  max-width: 300px;
  width: 38%;
`;

const ColumnB = styled.div`
  float: left;
  width: 60%;
`;

const MoreIn = withTheme(styled(Link)`
  font-family: ${p => p.theme.fonts.futura};
  color: ${p => p.theme.colors.black};
  display: block;
  font-weight: ${p => p.theme.weightBold};
  margin-bottom: 30px;
  text-transform: uppercase;
`);

@graphql(HomeQuery, {
  options: {
    variables: {
      stickiesTotal: 2,
      watchThisTotal: 5,
      readThisTotal: 5,
      listenToThisTotal: 5,
    },
  },
})
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
      <HomeWrapper>
        <ColumnA>
          <HomeSection>
            <HomeHeader>Latest</HomeHeader>
            <Archive posts={stickies} />
          </HomeSection>
          <HomeSection>
            <HomeHeader>Read This</HomeHeader>
            <Archive posts={readThis} />
            <MoreIn to={'/music/read-this'}>
              More posts in <em>Read This</em> »
            </MoreIn>
          </HomeSection>
        </ColumnA>
        <ColumnB>
          <HomeSection>
            <HomeHeader>Watch This</HomeHeader>
            <Archive posts={watchThis} />
            <MoreIn to={'/music/watch-this'}>
              More posts in <em>Watch This</em> »
            </MoreIn>
          </HomeSection>
          <HomeSection>
            <HomeHeader>Listen to This</HomeHeader>
            <Archive posts={listenToThis} />
            <MoreIn to={'/music/listen-to-this'}>
              More posts in <em>Listen To This</em> »
            </MoreIn>
          </HomeSection>
        </ColumnB>
      </HomeWrapper>
    );
  }
}
