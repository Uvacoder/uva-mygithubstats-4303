import { fetchGQL } from '~/util/api';

export default async function (req, res) {
  const q = req.query.q;

  const gql = {
    query: `
    {
      search(query: "${q}", type: USER, first: 10) {
        userCount
        nodes {
          ... on User {
            id
            login
            avatarUrl(size: 64)
            name
            location
          }
        }
      }
    }`,
  };

  const data = await fetchGQL(gql);
  res.json(data);
}
