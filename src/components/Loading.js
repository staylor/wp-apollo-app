import React from 'react';
import styled from 'emotion/react';
import { withTheme } from 'theming';

const Container = withTheme(styled.div`
  background: ${p => p.theme.colors.white};
  min-height: 400px;
  padding: 200px 0 0;
`);

const ActivityIndicator = withTheme(styled.div`
  background: ${p => p.theme.colors.white}
    url('/images/icons/icon-activity-indicator.gif') no-repeat 50% 10px;
  height: 56px;
  width: 100%;
`);

export default function Loading() {
  return (
    <Container>
      <ActivityIndicator />
    </Container>
  );
}
