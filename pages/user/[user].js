import {
  BookmarkAltIcon,
  ExclamationCircleIcon,
  GlobeAltIcon,
  HeartIcon,
  ScaleIcon,
  StarIcon,
  UsersIcon,
} from '@heroicons/react/outline';
import Parse from 'html-react-parser';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ReactTooltip from 'react-tooltip';
import useSWR from 'swr';
import UserActivity from '~/components/UserActivity';
import BarChartH from '~/components/BarChartH';
import ColorItem from '~/components/ColorItem';
import LanguagesChart from '~/components/LanguagesChart';
import PieChart from '~/components/PieChart';
import RepoCard from '~/components/RepoCard';
import { prettyNumber } from '~/util';
import * as userUtil from '~/util/pages/user';
import styles from '~/styles/User.module.css';

const internals = {
  MAX_STARRED_REPOS_TO_SHOW: 10,
  MAX_FORKED_REPOS_TO_SHOW: 10,
  MAX_STARS_PER_LANG_TO_SHOW: 5,
  MAX_FORKS_PER_LANG_TO_SHOW: 5,
};

export default function User() {
  const router = useRouter();
  const { user: username } = router.query;
  const { data, error } = useSWR(username ? `/api/user/${username}` : null, {
    revalidateOnFocus: false,
  });

  if (error) {
    return (
      <div className={styles.loadingScreen}>
        <p>Failed to load {username}’s stats</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.loadingScreen}>
        <Head>
          <title>GitHub Profile Stats - {username}</title>
          <link rel="preconnect" href="https://avatars.githubusercontent.com" />
        </Head>
        <p>Loading {username}’s profile stats</p>
      </div>
    );
  }

  const { user, repositories } = data;

  const totalStars = userUtil.getTotalStars(repositories);
  const totalForks = userUtil.getTotalForks(repositories);
  const preferredLicense = userUtil.getPreferredLicense(repositories) ?? 'None';
  const mostStarredRepos = userUtil
    .getMostStarredRepos(repositories)
    .slice(0, internals.MAX_STARRED_REPOS_TO_SHOW);
  const mostForkedRepos = userUtil
    .getMostForkedRepos(repositories)
    .slice(0, internals.MAX_FORKED_REPOS_TO_SHOW);
  const forksPerLanguage = userUtil.getForksPerLanguage(
    repositories,
    internals.MAX_FORKS_PER_LANG_TO_SHOW,
  );
  const starsPerLanguage = userUtil.getStarsPerLanguage(
    repositories,
    internals.MAX_STARS_PER_LANG_TO_SHOW,
  );
  const languageColors = userUtil.getLanguageColors(repositories);
  const languagesPerRepo = userUtil.getLanguagesPerRepo(repositories);

  const forkReposCount = repositories.filter((r) => r.node.isFork).length;
  const archiveReposCount = repositories.filter((r) => r.node.isArchived)
    .length;
  const mirrorReposCount = repositories.filter((r) => r.node.isMirror).length;
  const sourceRepoCount =
    repositories.length - forkReposCount - archiveReposCount - mirrorReposCount;

  return (
    <div className={styles.container}>
      <Head>
        <title>
          GitHub Profile Stats - {user.login} ({user.name})
        </title>
        <meta
          name="description"
          content={`${user.login} has ${repositories.length} repositories available.`}
        />
        <link rel="preconnect" href="https://avatars.githubusercontent.com" />
      </Head>

      <aside className={`${styles.aside} tertiary-text`}>
        <div className="flex aic mb1">
          <div className="rel mr1">
            <img
              src={user.avatarUrl}
              className={styles.avatar}
              alt="Avatar"
              width="48"
              height="48"
            />
            {user.status && (
              <div className={`${styles.status} secondary-text`}>
                <span>{Parse(user.status.emojiHTML ?? '💭')}</span>
                <span>{user.status.message}</span>
              </div>
            )}
          </div>
          <div>
            <h1 className={styles.userIntro}>
              <div className="primary-text fw600">{user.name}</div>
              <span className="secondary-text fw500">{user.login}</span>
            </h1>
          </div>
        </div>

        {user.isHireable && (
          <div className="mb1 fs-sm">
            <ColorItem color="var(--color-primary)" text="Available for hire" />
          </div>
        )}

        {user.bio && <p className="mb1">{user.bio}</p>}

        <ul className="clean-list mb2 flex aic">
          <li>
            <a
              href={`https://github.com/${user.login}`}
              target="_blank"
              rel="noopener noreferrer"
              className="tertiary-text"
              title={`View ${user.login}’s profile on GitHub`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </li>
          {user.twitterUsername && (
            <li className="ml05">
              <a
                href={`https://twitter.com/${user.twitterUsername}`}
                rel="noopener noreferrer"
                target="_blank"
                title={`Visit ${user.twitterUsername}’s twitter account`}
                className="tertiary-text"
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z" />
                </svg>
              </a>
            </li>
          )}
          {user.websiteUrl && (
            <li className="ml05">
              <a
                href={user.websiteUrl}
                rel="noopener noreferrer"
                target="_blank"
                className="tertiary-text"
                title={`Visit ${user.name ?? 'user'} website`}
              >
                <GlobeAltIcon width={16} height={16} />
              </a>
            </li>
          )}
        </ul>

        <div className="mb2">
          <ul className="icon-list">
            <li>
              <span className="icon">
                <UsersIcon width={16} height={16} />
              </span>
              <span className="fw600">
                {prettyNumber(user.followers.totalCount)}
              </span>{' '}
              followers
            </li>
            <li>
              <span className="icon">
                <StarIcon width={16} height={16} />
              </span>
              <span className="fw600">{prettyNumber(totalStars)}</span>{' '}
              stargazers
            </li>
            <li>
              <span className="icon">
                <svg width={14} height={14} viewBox="0 0 16 16">
                  <path
                    fillRule="evenodd"
                    d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"
                  ></path>
                </svg>
              </span>
              <span className="fw600">{prettyNumber(totalForks)}</span> forks
            </li>
            {user.hasSponsorsListing && (
              <li>
                <span className="icon">
                  <HeartIcon width={16} height={16} />
                </span>
                <span className="fw600">
                  {prettyNumber(user.sponsorshipsAsMaintainer.totalCount)}
                </span>{' '}
                sponsors
              </li>
            )}
          </ul>
        </div>

        <div className="mb2">
          <ul className="icon-list">
            <li>
              <span className="icon">
                <BookmarkAltIcon width={16} height={16} />
              </span>
              <span className="fw600">{prettyNumber(repositories.length)}</span>{' '}
              repositories <small>({sourceRepoCount} Sources)</small>
              <ul className="clean-list fs-sm ml15 flex fw">
                <li>{forkReposCount} Forks</li>
                <li>&nbsp;·&nbsp;</li>
                <li>{archiveReposCount} Archived</li>
                <li>&nbsp;·&nbsp;</li>
                <li>{mirrorReposCount} Mirrors</li>
              </ul>
            </li>
            <li>
              <span className="icon">
                <ExclamationCircleIcon width={16} height={16} />
              </span>
              <span className="fw600">
                {prettyNumber(user.issues.totalCount)}
              </span>{' '}
              issues
            </li>
            <li>
              <span className="icon">
                <UsersIcon width={16} height={16} />
              </span>
              <span className="fw600">
                {prettyNumber(user.pullRequests.totalCount)}
              </span>{' '}
              pull requests
            </li>
            <li>
              <span className="icon">
                <ScaleIcon width={16} height={16} />
              </span>
              {preferredLicense}
            </li>
          </ul>
        </div>

        {Boolean(user.organizations.nodes.length) && (
          <div>
            <h3 className="mb05 fw500">Organizations</h3>
            <ul className="clean-list flex fw">
              {user.organizations.nodes.map((org, i) => (
                <li key={i} className="mr05 mb05">
                  <img
                    src={org.avatarUrl}
                    title={org.name}
                    className="block br4"
                    width={32}
                    height={32}
                    data-tip={org.name}
                    data-effect="solid"
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      <div>
        <UserActivity user={user} languageColors={languageColors} />

        <section className="mb3">
          <h2 className="fs-lg fw500 mb1">
            Recently contributed to {user.repositoriesContributedTo.totalCount}{' '}
            repositories
          </h2>
          {Boolean(user.repositoriesContributedTo.totalCount) && (
            <>
              {user.repositoriesContributedTo.nodes.some(
                (r) => r.isInOrganization,
              ) && (
                <div className="flex aic mb1 fw">
                  <p className="tertiary-text mr05">Organizations</p>
                  <ul className="clean-list flex fw">
                    {[
                      ...new Map(
                        user.repositoriesContributedTo.nodes
                          .filter((repo) => repo.isInOrganization)
                          .map((repo) => [repo.owner.login, repo]),
                      ).values(),
                    ].map((repo, i) => {
                      return (
                        <li key={i} className="mr05">
                          <img
                            src={repo.owner.avatarUrl}
                            alt={repo.owner.login}
                            width={24}
                            height={24}
                            className="block"
                            data-tip={repo.owner.login}
                            data-effect="solid"
                            style={{ borderRadius: 4 }}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              <div className="contributed-to-list">
                {user.repositoriesContributedTo.nodes.map((node, i) => (
                  <RepoCard
                    key={i}
                    data={{ name: node.nameWithOwner, ...node }}
                    hideDescription
                    hideStars
                    hideForks
                  />
                ))}
              </div>
            </>
          )}
        </section>

        <section className="mb3">
          <h2 className="fs-lg fw500 mb1">User Repositories</h2>

          <div className="paper">
            <div className="mb">
              <p className="fw500 mb05">Primary user repository languages</p>
              <div className="tertiary-text">
                <LanguagesChart
                  data={languagesPerRepo}
                  colors={languageColors}
                  height={4}
                />
              </div>
            </div>

            <div className="paper-divider--h" />

            <div
              className="grid"
              style={{ '--columns': 2, '--gap': '1rem 3rem' }}
            >
              <div>
                <p className="fw500 mb1">Stars per language (top 5)</p>
                <PieChart
                  data={starsPerLanguage}
                  colors={languageColors}
                  cutout={0}
                  width="100px"
                />
              </div>
              <div>
                <p className="fw500 mb1">Forks per language (top 5)</p>
                <PieChart
                  data={forksPerLanguage}
                  colors={languageColors}
                  cutout={0}
                  width="100px"
                />
              </div>
            </div>

            <div className="paper-divider--h" />

            <div
              className="grid"
              style={{ '--columns': 2, '--gap': '1rem 3rem' }}
            >
              <div>
                <h4 className="fw500 mb1">Most starred</h4>
                <BarChartH
                  data={mostStarredRepos.reduce((acc, c) => {
                    acc[c.node.name] = c.node.stargazerCount;
                    return acc;
                  }, {})}
                />
              </div>
              <div>
                <h4 className="fw500 mb1">Most forked</h4>
                <BarChartH
                  data={mostForkedRepos.reduce((acc, c) => {
                    acc[c.node.name] = c.node.forkCount;
                    return acc;
                  }, {})}
                  size="200"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <ReactTooltip />

      <style jsx>{`
        .contributed-to-list {
          display: grid;
          grid-gap: 0.5rem 1rem;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
        }
      `}</style>
    </div>
  );
}
