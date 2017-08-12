import { css } from 'emotion';
import styled from 'emotion/react';
import { withTheme } from 'theming';
import theme from 'styles/theme';

export const header1 = css`
  font-family: ${theme.fonts.futura};
  font-size: 32px;
  line-height: 40px;
`;

export const H1 = withTheme(styled.h1`composes: ${header1};`);

export const H2 = withTheme(styled.h2`
  font-family: ${p => p.theme.fonts.futura};
  font-size: 24px;
  line-height: 32px;
`);

export const ContentWrapper = styled.div`max-width: 740px;`;
export const ArticleWrapper = styled.article`max-width: 740px;`;

export const uppercaseHeader = css`
  font-family: ${theme.fonts.futura};
  font-size: 18px;
  letter-spacing: 0.5px;
  line-height: 24px;
  text-transform: uppercase;
`;

export const ArchiveHeader = styled.h2`
  composes: ${uppercaseHeader};
  margin-bottom: 40px;
`;

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

export const button = css`
  border: 1px solid ${theme.colors.dark};
  cursor: pointer;
  display: inline-block;
  font-family: ${theme.fonts.futura};
  padding: 5px;
  text-align: center;
  text-transform: uppercase;
`;

export const SubmitButton = withTheme(styled.button`
  composes: ${button};
  background: ${p => p.theme.colors.dark};
  color: ${p => p.theme.colors.white};
`);

export const ResetButton = withTheme(styled.button`
  composes: ${button};
  background: ${p => p.theme.colors.white};
  color: ${p => p.theme.colors.dark};
`);

export const formField = css`
  border: 1px solid ${theme.colors.detail};
  margin: 0;
  padding: 6px;
  width: 100%;

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    box-shadow: 0 0 0 1000px ${theme.colors.white} inset;
    color: ${theme.colors.dark};
    transition: background-color 5000s ease-in-out 0s;
  }
`;

export const embed = css`
  cursor: pointer;
  display: inline-block;
  height: auto !important;
  margin: 0 0 20px;
  max-width: 100%;
  position: relative;

  & figcaption {
    display: none;
  }

  & img {
    height: auto;
    max-width: 100%;
    position: relative;
    z-index: 1;
  }

  &::before {
    background:  ${theme.colors.pink};
    border-radius: 10px;
    content: ' ';
    height: 52px;
    left: 50%;
    margin: -26px 0 0 -38px;
    opacity: 0.8;
    position: absolute;
    top: 50%;
    width: 76px;
    z-index: 2;
  }

  &::after {
    border-bottom: 10px solid transparent;
    border-left: 20px solid  ${theme.colors.white};
    border-top: 10px solid transparent;
    content: ' ';
    height: 0;
    left: calc(50% - 10px);
    position: absolute;
    top: calc(50% - 10px);
    width: 0;
    z-index: 3;
  }

  &:hover {
    &::before {
      background:  ${theme.colors.black};
    }
  }
`;
