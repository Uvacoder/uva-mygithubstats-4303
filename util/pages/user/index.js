/**
 * @param {Object[]} repositories
 * @return {number} the sum of user's repositories `stargazerCount`
 */
export const getTotalStars = repositories =>
  repositories.reduce((acc, repo) => acc + repo.node.stargazerCount, 0);

/**
 * @param {Object[]} repositories
 * @return {number} the sum of user’s repositories `forkCount`
 */
export const getTotalForks = repositories =>
  repositories.reduce((acc, repo) => acc + repo.node.forkCount, 0);

/**
 * @param {Object[]} repositories
 * @return {(string|undefined)} the `licenseInfo.name` with more incidents on user’s repositories
 */
export const getPreferredLicense = repositories => {
  const licensesPerRepo = repositories
    .reduce((acc, current) => {
      const name = current?.node?.licenseInfo?.name;
      if (!name) return acc;
      acc[name] = acc[name] || 0;
      acc[name]++;
      return acc;
    }, {});

  let preferredLicense;
  let licenseCount = 0;

  Object.entries(licensesPerRepo).forEach(([key, val]) => {
    if (val > licenseCount) {
      preferredLicense = key;
      licenseCount = val;
    }
  });

  return preferredLicense;
}

/**
 * @param {Object[]} repositories
 * @return {Object[]} a new array of repositories sorted by `stargazerCount`
 */
export const getMostStarredRepos = repositories =>
  repositories
    .concat()
    .sort((a, b) => b.node.stargazerCount - a.node.stargazerCount);

/**
 * @param {Object[]} repositories
 * @return {Object[]} a new array of repositories sorted by `forkCount`
 */
export const getMostForkedRepos = repositories =>
  repositories
    .concat()
    .sort((a, b) => b.node.forkCount - a.node.forkCount);

/**
 * @param {Object[]} repositories
 * @return {Object} where every key is the `primaryLanguage.name` and its value is the accumulation of `forkCount`
 */
export const getForksPerLanguage = repositories =>
  repositories.reduce((acc, current) => {
    const lang = current?.node?.primaryLanguage?.name ?? 'Unknown';
    acc[lang] = acc[lang] || 0;
    acc[lang] += current.node.forkCount;
    return acc;
  }, {});

/**
 * @param {Object[]} repositories
 * @return {Object} where every key is the `primaryLanguage.name` and its value is the accumulation of `stargazerCount`
 */
export const getStarsPerLanguage = repositories =>
  repositories.reduce((acc, current) => {
    const lang = current.node.primaryLanguage?.name ?? 'Unknown';
    acc[lang] = acc[lang] || 0;
    acc[lang] += current.node.stargazerCount;
    return acc;
  }, {});

/**
 * @param {Object[]} repositories - `user.contributionsCollection.commitContributionsByRepository`
 * @return {Object} where every key is the `primaryLanguage.name` and its value is the accumulation of `contributions.totalCount`
 */
export const getCommitsPerLanguage = repositories =>
  repositories.reduce((acc, current) => {
    const lang = current?.repository?.primaryLanguage?.name ?? 'Unknown';
    acc[lang] = acc[lang] || 0;
    acc[lang] += current.contributions.totalCount;
    return acc;
  }, {});

/**
 * @param {Object[]} repositories - `user.contributionsCollection.commitContributionsByRepository`
 * @return {Object} where every key is the `repository.name` and its value is the accumulation of `contributions.totalCount`
 */
export const getCommitsPerRepo = (repositories, slice) =>
  repositories
    .concat()
    .slice(0, slice)
    .reduce((acc, current) => {
      const name = current?.repository?.name;
      acc[name] = acc[name] || 0;
      acc[name] += current.contributions.totalCount;
      return acc;
    }, {});

/**
 * @param {Object[]} repositories
 * @return {Object} where every key is the `repository.name` and its value is `repositories.stargazerCount`
 */
export const getStarsPerRepo = (repositories, slice) =>
  repositories
    .concat()
    .slice(0, slice)
    .reduce((acc, current) => {
      const name = current?.node?.name;
      acc[name] = acc[name] || 0;
      acc[name] += current.node.stargazerCount;
      return acc;
    }, {});

/**
 * @param {Object[]} repositories
 * @return {Object} where every key is the `primaryLanguage.name` and its value is the `primaryLanguage.color``
 */
export const getLanguageColors = repositories =>
  repositories.reduce((acc, current) => {
    const lang = current?.node?.primaryLanguage?.name;
    if (!lang) return acc;
    acc[lang] = current.node.primaryLanguage?.color;
    return acc;
  }, {});

/**
 * @param {Object[]} repositories
 * @return {Object} where every key is the `primaryLanguage.name` and its value is the accumulation of occurrences`
 */
export const getLanguagesPerRepo = repositories =>
  repositories.reduce((acc, current) => {
    const lang = current?.node?.primaryLanguage?.name ?? 'Unknown';
    acc[lang] = acc[lang] || 0;
    acc[lang]++;
    return acc;
  }, {});
