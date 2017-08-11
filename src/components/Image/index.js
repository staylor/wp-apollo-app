import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';

const ResponsiveImage = styled.img`
  display: block;
  height: auto;
  margin: 0 0 10px;
  max-width: 100%;
`;

export default class Image extends Component {
  static propTypes = {
    crop: PropTypes.string,
    image: PropTypes.shape({
      sourceUrl: PropTypes.String,
      mediaDetails: PropTypes.object,
    }).isRequired,
  };

  static defaultProps = {
    crop: 'large',
  };

  getCrop(sizes) {
    let chosen;
    const choices = [this.props.crop, this.constructor.defaultProps.crop, 'full'];

    for (let i = 0; i < choices.length; i += 1) {
      chosen = sizes.find(size => size.name === choices[i]);
      if (chosen) {
        return chosen;
      }
    }

    return null;
  }

  render() {
    const { sourceUrl, mediaDetails: { sizes } } = this.props.image;

    if (!sourceUrl) {
      return '';
    }

    const chosen = this.getCrop(sizes);
    if (!chosen) {
      return null;
    }

    return (
      <figure>
        <ResponsiveImage alt="" src={chosen.sourceUrl} />
      </figure>
    );
  }
}
