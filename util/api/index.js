export async function fetchGQL(gql) {
  let res;

  try {
    const req = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `token ${process.env.GITHUB_AUTH_TOKEN}`
      },
      body:  JSON.stringify(gql)
    })
    res = await req.json();
  } catch(err) {
    throw err;
  }

  return res.data;
}
