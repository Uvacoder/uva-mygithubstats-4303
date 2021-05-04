import { fetchGQL } from '~/util/api';

export default async function (req, res) {
  const { user, cursor } = req.query;

  const gql = {
    query: `
    {
      user(login: "${user}") {
        repositoriesContributedTo(
          first: 10,
          after: "${cursor}",
          includeUserRepositories: true,
          contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY, PULL_REQUEST_REVIEW],
          orderBy: { field: PUSHED_AT, direction: DESC }
        ) {
          pageInfo {
            endCursor
            hasNextPage
          }
          edges {
            node {
              nameWithOwner
              url
              isInOrganization
              owner {
                login
                avatarUrl(size: 48)
              }
              primaryLanguage {
                name
                color
              }
            }
          }
        }
      }
    }`,
  };

  const data = await fetchGQL(gql);
  res.json(data);
}
