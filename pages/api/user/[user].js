import { fetchGQL } from '../../../util/api';

const { log } = console;

async function getRepositoriesByUser(login, limit = 30, after = null) {
  if (after) after = `\"${after}\"`;

  return await fetchGQL({query: `
    {
      user(login: "${login}") {
        repositories(first: ${limit}, after: ${after}) {
          pageInfo {
            endCursor
            hasNextPage
          }
          edges {
            node {
              name
              url
              descriptionHTML
              stargazerCount
              forkCount
              primaryLanguage {
                name
                color
              }
              licenseInfo {
                name
              }
            }
          }
        }
      }
    }
  `});
}

async function getAllRepositoriesByUser(username) {
  let repos = [];

  const getRepos = async (login, cursor = null) => {
    log(login, cursor)
    let { user: { repositories }} = await getRepositoriesByUser(login, 100, cursor);
    repos = repos.concat(repositories.edges);

    if (repositories.pageInfo.hasNextPage) {
      await getRepos(username, repositories.pageInfo.endCursor);
    }
  };
  await getRepos(username);

  return { repositories: repos };
}

export default async function(req, res) {
  const username = req.query.user;

  const gql = {query: `
    {
      user(login: "${username}") {
        login
        name
        repositories {
          totalCount
        }
        avatarUrl(size: 200)
        followers {
          totalCount
        }
        following {
          totalCount
        }
        starredRepositories {
          totalCount
        }
        createdAt
        bio
        status {
          emoji
          emojiHTML
          message
        }
        location
        email
        websiteUrl
        twitterUsername
        repositories {
          totalCount
        }
        gists {
          totalCount
        }
        contributionsCollection {
          totalCommitContributions
          totalIssueContributions
          totalPullRequestContributions
          totalPullRequestReviewContributions
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionLevel
                weekday
              }
            }
          }
          commitContributionsByRepository(maxRepositories: 100) {
            contributions {
              totalCount
            }
            repository {
              primaryLanguage {
                name
              }
            }
          }
        }
        packages {
          totalCount
        }
        projects {
          totalCount
        }
        organizations {
          totalCount
        }
        sponsorshipsAsMaintainer(includePrivate:true) {
          totalCount
        }
        sponsorshipsAsSponsor {
          totalCount
        }
        watching {
          totalCount
        }
      }
    }
  `};

  const [{ user }, { repositories }] = await Promise.all([
    fetchGQL(gql),
    getAllRepositoriesByUser(username)
  ]);

  res.json({
    user,
    repositories
  });
}
