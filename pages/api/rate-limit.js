import { fetchGQL } from '../../util/api';

export default async function(req, res) {
  const gql = {query: `
    {
      rateLimit {
        used
        limit
        remaining
        cost
        nodeCount
      }
    }
  `};

  const { rateLimit } = await fetchGQL(gql);
  res.json(rateLimit);
}
