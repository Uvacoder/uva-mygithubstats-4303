import { fetchGQL } from '~/util/api';

async function getRepositoriesByUser(login, limit = 30, after = null) {
  if (after) after = `\"${after}\"`;

  return await fetchGQL({query: `
    {
      user(login: "${login}") {
        repositories(first: ${limit}, after: ${after}, ownerAffiliations: [OWNER], privacy: PUBLIC) {
          pageInfo {
            endCursor
            hasNextPage
          }
          edges {
            node {
              name
              isFork
              isArchived
              isMirror
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
        avatarUrl(size: 96)
        isHireable
        hasSponsorsListing
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
        company
        location
        email
        websiteUrl
        twitterUsername
        gists {
          totalCount
        }
        contributionsCollection {
          restrictedContributionsCount
          totalCommitContributions
          totalIssueContributions
          totalPullRequestContributions
          totalPullRequestReviewContributions
          contributionYears
          contributionCalendar {
            totalContributions
            months {
              name
              year
              totalWeeks
            }
            weeks {
              contributionDays {
                contributionLevel
                contributionCount
                date
              }
            }
          }
          commitContributionsByRepository(maxRepositories: 100) {
            contributions {
              totalCount
            }
            repository {
              name
              primaryLanguage {
                name
              }
            }
          }
          repositoryContributions(last: 10) {
            totalCount
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
        packages {
          totalCount
        }
        projects {
          totalCount
        }
        organizations(first: 100) {
          nodes {
            name
            avatarUrl(size: 64)
          }
        }
        sponsorshipsAsMaintainer(includePrivate:true) {
          totalCount
        }
        sponsorshipsAsSponsor {
          totalCount
        }
        repositoriesContributedTo(
          first: 10,
          includeUserRepositories: true,
          contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY, PULL_REQUEST_REVIEW],
          orderBy: { field: PUSHED_AT, direction: DESC }
        ) {
          totalCount
          nodes {
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
            issues(states: [OPEN]) {
              totalCount
            }
            pullRequests(states: [OPEN]) {
              totalCount
            }
          }
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
