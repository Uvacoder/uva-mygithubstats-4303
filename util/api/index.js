export async function fetchGQL(gql) {
  const req = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Authorization: `token ${process.env.GITHUB_AUTH_TOKEN}`,
    },
    body: JSON.stringify(gql),
  });
  const res = await req.json();

  return res.data;
}
