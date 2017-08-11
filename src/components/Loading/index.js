import React from 'react';

export default function Loading() {
  return (
    <div
      css={`
        background: #fff;
        min-height: 400px;
        padding: 200px 0 0;
      `}
    >
      <div
        css={`
          background: #fff url('/images/icons/icon-activity-indicator.gif') no-repeat 50% 10px;
          height: 56px;
          width: 100%;
        `}
      />
    </div>
  );
}
