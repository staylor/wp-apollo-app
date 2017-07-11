import { gql } from 'react-apollo';

export const Comment = {
  comment: gql`
    fragment Comment_comment on Comment {
      id
      author_name
      author_url
      author_hash
      date
      content {
        rendered
        raw
      }
      author_avatar_urls {
        size
        url
      }
      parent
      post
    }
  `,
};

export const Walker = {
  comments: gql`
    fragment Walker_comments on CommentConnection {
      edges {
        node {
          id
          parent
          ...Comment_comment
        }
      }
    }
    ${Comment.comment}
  `,
};

export default {
  comments: gql`
    fragment Comments_comments on CommentConnection {
      ...Walker_comments
    }
    ${Walker.comments}
  `,
};
