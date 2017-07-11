import React from 'react';
import PropTypes from 'prop-types';
import { gql } from 'react-apollo';
import Image from '../Image';

const Media = ({ media, crop = null }) => {
  switch (media.__typename) {
    case 'Image':
      return <Image image={media} crop={crop} />;
    default:
      return null;
  }
};

Media.propTypes = {
  crop: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  media: PropTypes.object.isRequired,
};

Media.defaultProps = {
  crop: 'large',
};

Media.fragments = {
  media: gql`
    fragment Media_media on Media {
      __typename
      ...Image_image
    }
    ${Image.fragments.image}
  `,
};

export default Media;
