import { fetchGQL } from '~/util/api';

export default async function (req, res) {
  const { user, year } = req.query;

  const gql = {
    query: `
    {
      user(login: "${user}") {
        contributionsCollection(
          from: "${new Date(year).toISOString()}"
        ) {
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
      }
    }
  `,
  };

  const data = await fetchGQL(gql);
  res.json(data);
}
