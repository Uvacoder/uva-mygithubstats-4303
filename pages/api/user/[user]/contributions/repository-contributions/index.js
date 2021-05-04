import { fetchGQL } from '~/util/api';

export default async function (req, res) {
  const { user, year, cursor } = req.query;
  let from = null;

  if (!isNaN(Number(year))) {
    from = `"${new Date(year).toISOString()}"`;
  }

  const gql = {
    query: `
    {
      user(login: "${user}") {
        contributionsCollection(
          from: ${from}
        ) {
          repositoryContributions(
            first: 10
            after: "${cursor}",
          ) {
            totalCount
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              repository {
                name
                url
                stargazerCount
                forkCount
                owner {
                  login
                  avatarUrl(size: 48)
                }
                primaryLanguage {
                  color
                  name
                }
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
