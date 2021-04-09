# Changelog

## [0.2.0] - 2021-04-09
#### Features
- users
  - list user organizations
  - add languages chart
  - add stars per repo chart
  - add simple empty states
  - format joined date
  - display preferred user license
- search
  - index(search): autoFocus input

#### Bugfixes
(feat/aside)
- user: charts: display Unknown instead of `undefined` when the repo doesn’t have a primaryLanguage

## [0.1.1] - 2021-04-07
#### Features
- format numbers
- rate limit status indicator

## 0.1.0 - 2021-04-06
Initial release
#### Features
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

[0.2.0]: https://github.com/noeldelgado/gh-profile-stats/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/noeldelgado/gh-profile-stats/compare/v0.1.0...v0.1.1
