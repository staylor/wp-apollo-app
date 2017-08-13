import React from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';
import { withTheme } from 'theming';
import Post from './Post';

export const LoadMore = withTheme(styled.button`
  appearance: none;
  background: ${p => p.theme.colors.white};
  border: 1px solid ${p => p.theme.colors.detail};
  box-sizing: border-box;
  color: ${p => p.theme.colors.inactive};
  cursor: pointer;
  font-size: 16px;
  height: 32px;
  line-height: 16px;
  text-align: center;
  text-transform: uppercase;
  transition: 400ms;
  width: 80px;

  &:hover,
  &:active,
  &:focus {
    border: 1px solid ${p => p.theme.colors.black};
    color: ${p => p.theme.colors.black};
    outline: 0 none;
  }
`);

const Archive = ({ variables, fetchMore = null, posts: { pageInfo, edges } }) => [
  <ul key="list">
    {edges.map(({ cursor, node }) =>
      <li key={cursor}>
        <Post post={node} />
      </li>
    )}
  </ul>,
  fetchMore &&
    pageInfo.hasNextPage &&
    <LoadMore
      key="button"
      onClick={() =>
        fetchMore({
          variables: {
            ...variables,
            cursor: pageInfo.endCursor,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const { edges: previousEdges } = previousResult.viewer.posts;
            const { edges: newEdges } = fetchMoreResult.viewer.posts;
            const newViewer = {
              viewer: {
                ...fetchMoreResult.viewer,
                posts: {
                  ...fetchMoreResult.viewer.posts,
                  edges: [...previousEdges, ...newEdges],
                },
              },
            };
            return newViewer;
          },
        })}
    >
      MORE
    </LoadMore>,
];

Archive.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  variables: PropTypes.object,
  fetchMore: PropTypes.func,
  posts: PropTypes.shape({
    edges: PropTypes.arrayOf(
      PropTypes.shape({
        node: PropTypes.object,
        cursor: PropTypes.string,
      })
    ),
  }).isRequired,
};

Archive.defaultProps = {
  variables: {},
  fetchMore: null,
};

export default Archive;
