import { css } from 'emotion';
import styled from 'emotion/react';

export const futura = css`
  font-family: 'futura-pt', 'Helvetica Neue', sans-serif;
`;

export const clear = css`
  &::after {
    clear: both;
    content: '.';
    display: block;
    height: 0;
    visibility: hidden;
  }
`;

export const H1 = styled.h1`
  composes: ${futura};
  font-size: 32px;
  line-height: 40px;
`;

export const H2 = styled.h2`
  composes: ${futura};
  font-size: 24px;
  line-height: 32px;
`;

export const ContentWrapper = styled.div`max-width: 740px;`;
export const ArticleWrapper = styled.article`max-width: 740px;`;

export const uppercaseHeader = css`
  composes: ${futura};
  font-size: 18px;
  letter-spacing: 0.5px;
  line-height: 24px;
  text-transform: uppercase;
`;

export const ArchiveHeader = styled.h2`
  composes: ${uppercaseHeader};
  margin-bottom: 40px;
`;

export const LoadMore = styled.button`
  appearance: none;
  background: #fff;
  border: 1px solid #eee;
  box-sizing: border-box;
  color: #767676;
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
    border: 1px solid #000;
    color: #000;
    outline: 0 none;
  }
`;

export const button = css`
  composes: ${futura};

  border: 1px solid #444;
  cursor: pointer;
  display: inline-block;
  padding: 5px;
  text-align: center;
  text-transform: uppercase;
`;

export const SubmitButton = styled.button`
  composes: ${button};
  background: #444;
  color: #fff;
`;
