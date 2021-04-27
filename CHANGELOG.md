# Changelog

(feature/misc)
#### Added
- components:{PieChart,PolarAreaChart}: prettify numbers on tooltips
- user: preconnect to origin avatars.githubusercontent.com
- conf: `jscofig.json` and `next.config.js`
- user: alt attribute to avatar image
- meta descriptions
- api
  - user fields
    - `isHireable`
    - `hasSponsorsListing`
    - `contributionsCollection.restrictedContributionsCount`
    - `contributionsCollection.contributionYears`
  - new contributions function `api/user/{user}/contributions?year={year}`
  - search: do not limit search query to `in:login` matches, allow a more broad search in user
- user: display public vs private contribution percents
#### Changed
- use absolute imports and module path aliases
- user: serve images at double size to maximize image clarity
- user: reorder stars/forks per language, show stars first
- use heroicons/react icons
#### Fixed
- search: filter organizations (empty objects) from search results

## [0.7.0] - 2021-04-17
#### Added
- dependencies: add react-tooltip
- user
  - organizations: tooltip to show org name
  - CalendarLine (chart): tooltip to show grouped contributions per week
- components
  - PolarAreaChart: tooltip to show percentage
  - PieChart: tooltip to show per percentage
#### Fixed
- components: PolarAreaChart: handle case for 1 entry

## [0.6.0] - 2021-04-15
#### Added
- components: polar area chart
- display version number on footer
#### Changed
- user: use PolarAreaChart instead of RepoCard
- components: pie chart: use path instead of stroke-dasharray
- constants: update chart colors

## [0.5.0] - 2021-04-13
#### Added
- user: calendar line chart

## [0.4.0] - 2021-04-10
#### Added
- search: "no results" state
#### Fixed
- user: make sure emojiHTML is not null or undefined, the `parse` fn will fail in this case

## [0.3.0] - 2021-04-09
#### Added
- user
  - filter forksPerLanguage, starsPerLanguage and commitsPerLanguage greater than zero
  - filter starred and forked repos greater than zero
  - add page title
  - show user company
#### Fixed
- users: organizations list: printing zero when no organizations

## [0.2.1] - 2021-04-09
- user: show only owned repositories

## [0.2.0] - 2021-04-09
#### Added
- users
  - list user organizations
  - add languages chart
  - add stars per repo chart
  - add simple empty states
  - format joined date
  - display preferred user license
- search
  - index(search): autoFocus input

#### Fixed
- user: charts: display Unknown instead of `undefined` when the repo doesn’t have a primaryLanguage

## [0.1.1] - 2021-04-07
#### Added
- format numbers
- rate limit status indicator

## 0.1.0 - 2021-04-06
Initial release
#### Added
- Search GitHub users by `login` (username) using GitHub’s GraphQL API
- Display GitHub user profile page with the following stats/data:
  - calendar contributions
  - activity summary
  - most starred repos
  - most forked repos
  - forks per language
  - stars per language
  - commits per language
  - languages per repo
  - commits per repo (top 10)

[0.7.0]: https://github.com/noeldelgado/gh-profile-stats/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/noeldelgado/gh-profile-stats/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/noeldelgado/gh-profile-stats/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/noeldelgado/gh-profile-stats/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/noeldelgado/gh-profile-stats/compare/v0.2.1...v0.3.0
[0.2.1]: https://github.com/noeldelgado/gh-profile-stats/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/noeldelgado/gh-profile-stats/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/noeldelgado/gh-profile-stats/compare/v0.1.0...v0.1.1
