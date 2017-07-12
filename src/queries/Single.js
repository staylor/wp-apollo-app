import { gql } from 'react-apollo';
import Media from 'components/Media';
import Comments from 'components/Comments/fragments';

const SingleQuery = gql`
  query Single_Query($slug: String!, $commentCount: Int) {
    viewer {
      post(slug: $slug) {
        id
        slug
        date
        title {
          rendered
        }
        content {
          rendered
        }
        excerpt {
          raw
        }
        featuredMedia {
          ...Media_media
          ... on Image {
            source_url
          }
        }
        tags {
          id
          name
          slug
        }
        comments(slug: $slug, first: $commentCount) {
          ...Comments_comments
        }
      }
    }
  }
  ${Media.fragments.media}
  ${Comments.comments}
`;

export default SingleQuery;
