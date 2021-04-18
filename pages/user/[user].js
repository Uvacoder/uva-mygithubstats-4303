import Head from 'next/head'
import { useRouter } from 'next/router';
import useSWR from 'swr';
import parse from 'html-react-parser';
import ReactTooltip from 'react-tooltip';
import {
  BookmarkAltIcon,
  CalendarIcon,
  CubeIcon,
  ExternalLinkIcon,
  EyeIcon,
  HeartIcon,
  MailIcon,
  LinkIcon,
  LocationMarkerIcon,
  OfficeBuildingIcon,
  ScaleIcon,
  StarIcon,
  UsersIcon
} from '@heroicons/react/outline';
import CalendarLine from '~/components/CalendarLine';
import ActivityOverview from '~/components/ActivityOverview';
import LanguagesChart from '~/components/LanguagesChart';
import PieChart from '~/components/PieChart';
import PolarAreaChart from '~/components/PolarAreaChart';
import { prettyNumber } from '~/util';
import * as userUtil from '~/util/pages/user';
import styles from '~/styles/User.module.css'

export default function User() {
  const router = useRouter();
  const { user: username } = router.query;
  const { data, error } = useSWR(username ? `/api/user/${username}` : null, {
    revalidateOnFocus: false
  });

  if (error) {
    return (
      <div className={styles.loadingScreen}>
        <p>
          Failed to load {username}’s stats
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.loadingScreen}>
        <Head>
          <title>GitHub Profile Stats - {username}</title>
          <link rel='preconnect' href='https://avatars.githubusercontent.com'/>
        </Head>
        <p>
          Loading {username}’s profile stats
        </p>
      </div>
    );
  }

  const { user, repositories } = data;

  const totalStars = userUtil.getTotalStars(repositories);
  const totalForks = userUtil.getTotalForks(repositories);
  const preferredLicense = userUtil.getPreferredLicense(repositories) ?? 'None';
  const mostStarredRepos = userUtil.getMostStarredRepos(repositories).slice(0, 3);
  const mostForkedRepos = userUtil.getMostForkedRepos(repositories).slice(0, 3);
  const forksPerLanguage = userUtil.getForksPerLanguage(repositories);
  const starsPerLanguage = userUtil.getStarsPerLanguage(repositories);
  const commitsPerLanguage = userUtil.getCommitsPerLanguage(user.contributionsCollection.commitContributionsByRepository);
  const commitsPerRepo = userUtil.getCommitsPerRepo(user.contributionsCollection.commitContributionsByRepository, 10);
  const starsPerRepo = userUtil.getStarsPerRepo(
    userUtil.getMostStarredRepos(repositories).slice(0, 10)
  );
  const languageColors = userUtil.getLanguageColors(repositories);
  const languagesPerRepo = userUtil.getLanguagesPerRepo(repositories);

  return (
    <div className={styles.container}>
      <Head>
        <title>GitHub Profile Stats - {user.login} ({user.name})</title>
        <meta name='description' content={`${user.login} has ${repositories.length} repositories available.`}/>
        <link rel='preconnect' href='https://avatars.githubusercontent.com'/>
      </Head>

      <aside className={styles.aside}>
        <div className={`${styles.bio} mb1`}>
          <div className='mr1'>
            <img
              src={user.avatarUrl}
              className={styles.avatar}
              alt='Avatar'
              width='90'
              height='90'
            />
          </div>
          <div>
            <h1 className={`${styles.header} mb05`}>
              <div>{user.name}</div>
              <a
                href={`https://github.com/${user.login}`}
                target='_blank'
                rel='noopener noreferrer'
                className='primary-text'
                title='View profile on GitHub'
              >
                <span>{user.login}</span>
                {' '}
                <ExternalLinkIcon width={16} height={16} className='secondary-text'/>
              </a>
            </h1>
            {user.status && (
              <div className={styles.status}>
                {parse(user.status.emojiHTML ?? '')} {user.status.message}
              </div>
            )}
          </div>
        </div>

        {user.bio && <p className='mb1'>{user.bio}</p>}

        <div className="mb1">
          <ul className={styles.inlineStats}>
            <li>
              <UsersIcon width={16} height={16} className='secondary-text'/>
              <b>{prettyNumber(user.followers.totalCount)}</b> followers
            </li>
            <li>
              <b>{prettyNumber(user.following.totalCount)}</b> following
            </li>
            <li>
              <StarIcon width={16} height={16} className='secondary-text'/>
              <b>{prettyNumber(user.starredRepositories.totalCount)}</b>
            </li>
          </ul>

          <ul className={styles.inlineStats}>
            <li>
              <BookmarkAltIcon width={16} height={16} className='secondary-text'/>
              <b>{prettyNumber(repositories.length)}</b> repositories
            </li>
            <li><b>{prettyNumber(user.gists.totalCount)}</b> gists</li>
            <li>
              <EyeIcon width={16} height={16} className='secondary-text'/>
              <b>{prettyNumber(user.watching.totalCount)}</b>
            </li>
          </ul>

          <ul className={styles.inlineStats}>
            <li>
              <CubeIcon width={16} height={16} className='secondary-text'/>
              <b>{prettyNumber(user.packages.totalCount)}</b> packages
            </li>
            <li>
              <b>{prettyNumber(user.projects.totalCount)}</b> projects
            </li>
          </ul>

          <ul className={styles.inlineStats}>
            <li>
              <HeartIcon width={16} height={16} className='secondary-text'/>
              <b>{prettyNumber(user.sponsorshipsAsMaintainer.totalCount)}</b> sponsors
            </li>
            <li>
              <b>{prettyNumber(user.sponsorshipsAsSponsor.totalCount)}</b> sponsoring
            </li>
          </ul>
        </div>

        <div className="mb1">
          <ul className={styles.inlineStats}>
            <li>
              <CalendarIcon width={16} height={16} className='secondary-text'/>
              Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </li>
            {user.company && (
              <li>
                <OfficeBuildingIcon width={16} height={16} className='secondary-text'/>
                {user.company}
              </li>
            )}
            {user.location && (
              <li>
                <LocationMarkerIcon width={16} height={16} className='secondary-text'/>
                {user.location}
              </li>
            )}
            {user.email && (
              <li>
                <MailIcon width={16} height={16} className='secondary-text'/>
                {user.email}
              </li>
            )}
            {user.websiteUrl && (
              <li>
                <LinkIcon width={16} height={16} className='secondary-text'/>
                <a
                  href={user.websiteUrl}
                  rel='noopener noreferrer'
                  target='_blank'
                  className='primary-text'
                >
                  {user.websiteUrl}
                </a>
              </li>
            )}
            {user.twitterUsername && (
              <li>
                <svg className='secondary-text' width="15" height="15" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                <a
                  href={`https://twitter.com/${user.twitterUsername}`}
                  rel='noopener noreferrer'
                  target='_blank'
                  className='primary-text'
                >
                  @{user.twitterUsername}
                </a>
              </li>
            )}
          </ul>
        </div>

        <div className="mb1">
          <h4 className="mb05">Profile Statistics</h4>
          <ul className={styles.inlineStats}>
            <li>
              <StarIcon width={16} height={16} className='secondary-text'/>
              <b>{prettyNumber(totalStars)}</b>
            </li>
            <li>
              <svg className='secondary-text' width="14" height="14" viewBox="0 0 24 24">
                <path d="M21 3c0-1.657-1.343-3-3-3s-3 1.343-3 3c0 1.323.861 2.433 2.05 2.832.168 4.295-2.021 4.764-4.998 5.391-1.709.36-3.642.775-5.052 2.085v-7.492c1.163-.413 2-1.511 2-2.816 0-1.657-1.343-3-3-3s-3 1.343-3 3c0 1.305.837 2.403 2 2.816v12.367c-1.163.414-2 1.512-2 2.817 0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.295-.824-2.388-1.973-2.808.27-3.922 2.57-4.408 5.437-5.012 3.038-.64 6.774-1.442 6.579-7.377 1.141-.425 1.957-1.514 1.957-2.803zm-16.8 0c0-.993.807-1.8 1.8-1.8s1.8.807 1.8 1.8-.807 1.8-1.8 1.8-1.8-.807-1.8-1.8zm3.6 18c0 .993-.807 1.8-1.8 1.8s-1.8-.807-1.8-1.8.807-1.8 1.8-1.8 1.8.807 1.8 1.8z"/>
              </svg>
              <b>{prettyNumber(totalForks)}</b>
            </li>
            <li>
              <ScaleIcon width={16} height={16} className='secondary-text'/>
              {preferredLicense}
            </li>
          </ul>
        </div>

        {Boolean(user.organizations.nodes.length) && (
          <div>
            <h4 className="mb05">Organizations</h4>
            <ul className={styles.organizationsList}>
              {user.organizations.nodes.map((org, i) =>
                <li key={i}>
                  <img
                    src={org.avatarUrl}
                    title={org.name}
                    className={styles.orgAvatar}
                    width={32}
                    height={32}
                    data-tip={org.name}
                    data-effect='solid'
                  />
                </li>
              )}
            </ul>
          </div>
        )}
      </aside>

      <div>
        <div className={styles.contentSection}>
          <div>
            <div className='mb1'>
              <p>{(user.contributionsCollection.contributionCalendar.totalContributions).toLocaleString()} contributions int the last year</p>
            </div>
            <CalendarLine data={user.contributionsCollection.contributionCalendar}/>
          </div>
        </div>

        <div className={styles.contentSection}>
          <div>
            <h4 className="mb05">Languages</h4>
            <LanguagesChart data={languagesPerRepo} colors={languageColors} height={5} />
          </div>

          <div style={{flexBasis: 'auto'}}>
            <ActivityOverview
              commits={user.contributionsCollection.totalCommitContributions}
              issues={user.contributionsCollection.totalIssueContributions}
              pullRequests={user.contributionsCollection.totalPullRequestContributions}
              reviews={user.contributionsCollection.totalPullRequestReviewContributions}
              height={130}
            />
          </div>
        </div>

        <div className={styles.contentSection}>
          <div>
            <h4 className='mb1'>Most Starred Repos</h4>
            <PolarAreaChart data={
              mostStarredRepos.reduce((acc, c) => {
                acc[c.node.name] = c.node.stargazerCount
                return acc;
              }, {})
            } size='200' />
          </div>
          <div>
            <h4 className='mb1'>Most Forked Repos</h4>
            <PolarAreaChart data={
              mostForkedRepos.reduce((acc, c) => {
                acc[c.node.name] = c.node.forkCount
                return acc;
              }, {})
            } size='200' />
          </div>
        </div>

        <div className={styles.contentSection}>
          <div>
            <h4 className="mb1">Stars per language</h4>
            <PieChart data={starsPerLanguage} colors={languageColors}/>
          </div>
          <div>
            <h4 className="mb1">Forks per language</h4>
            <PieChart data={forksPerLanguage} colors={languageColors}/>
          </div>
          <div>
            <h4 className="mb1">Commits per language</h4>
            <PieChart data={commitsPerLanguage} colors={languageColors}/>
          </div>
        </div>

        <div className={styles.contentSection}>
          <div>
            <h4 className="mb1">Commits per repo (top 10)</h4>
            <PieChart data={commitsPerRepo}/>
          </div>
          <div>
            <h4 className="mb1">Stars per repo (top 10)</h4>
            <PieChart data={starsPerRepo}/>
          </div>
        </div>

      </div>

      <ReactTooltip />
    </div>
  );
}
