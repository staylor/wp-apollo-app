// eslint-disable-next-line import/prefer-default-export
export const convertPlaceholders = (html, embedClass) =>
  html.replace(/"embed"/g, `"${embedClass}"`);
