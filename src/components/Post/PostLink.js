import React from 'react';
import PropTypes from 'prop-types';
import { gql } from 'react-apollo';
import { Link } from 'found';
import { dateRegex } from 'utils/regex';

const PostLink = ({ children, post: { id, date, title: { rendered: title } } }) => {
  const [, year, month, day] = dateRegex.exec(date);
  const url = `/${year}/${month}/${day}/${id}`;
  if (children) {
    return (
      <Link to={url}>
        {children}
      </Link>
    );
  }
  return <Link to={url} dangerouslySetInnerHTML={{ __html: title }} />;
};

PostLink.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  post: PropTypes.object.isRequired,
  children: PropTypes.node,
};

PostLink.defaultProps = {
  children: null,
};

PostLink.fragments = {
  post: gql`
    fragment PostLink_post on Post {
      id
      date
      title {
        rendered
      }
    }
  `,
};

export default PostLink;
