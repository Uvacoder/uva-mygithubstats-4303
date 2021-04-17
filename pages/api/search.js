import { fetchGQL } from '~/util/api';

export default async function(req, res) {
  const q = req.query.q;

  const gql = {query: `
    {
      search(query: "${q} in:login", type: USER, first: 10) {
        userCount
        nodes {
          ... on User {
            id
            login
            avatarUrl(size:40)
            name
          }
        }
      }
    }
  `};

  const data = await fetchGQL(gql);
  res.json(data);
}
