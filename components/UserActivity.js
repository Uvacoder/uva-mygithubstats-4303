import { ChevronDownIcon } from '@heroicons/react/outline';
import { object } from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import ActivityOverview from '~/components/ActivityOverview';
import CalendarLine from '~/components/CalendarLine';
import Loader from '~/components/Loader';
import PieChart from '~/components/PieChart';
import RepoCard from '~/components/RepoCard';
import * as userUtil from '~/util/pages/user';
import { percent } from '~/util';

const internals = {
  INITIAL_DATA_KEY: 'last year',
  COMMITS_PER_REPO_TOP_NUMBER: 5,
};
const { round } = Math;

export default function UserActivity({ user, languageColors }) {
  const scrollingBox = useRef();
  const [cache, setCache] = useState({
    [internals.INITIAL_DATA_KEY]: user.contributionsCollection,
  });
  const [collection, setCollection] = useState(
    cache[internals.INITIAL_DATA_KEY],
  );
  const [year, setYear] = useState(internals.INITIAL_DATA_KEY);
  const [loading, setLoading] = useState(false);
  const [loadingRepos, setLoadingRepos] = useState(false);

  const commitsPerLanguage = userUtil.getCommitsPerLanguage(
    collection.commitContributionsByRepository,
  );
  const commitsPerRepo = userUtil.getCommitsPerRepo(
    collection.commitContributionsByRepository,
    internals.COMMITS_PER_REPO_TOP_NUMBER,
  );
  const totalContributions = collection.contributionCalendar.totalContributions;
  const restrictedContributionsCount = collection.restrictedContributionsCount;
  const totalPublicContributions =
    totalContributions - restrictedContributionsCount;

  useEffect(() => {
    scrollingBox.current?.scrollTo(0, 0);
    setCache({
      [internals.INITIAL_DATA_KEY]: user.contributionsCollection,
    });
    setCollection(user.contributionsCollection);
    setYear(internals.INITIAL_DATA_KEY);
  }, [user]);

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [collection]);

  useEffect(() => {
    scrollingBox.current?.scrollTo(0, 0);
  }, [year]);

  async function handleSelectChange(ev) {
    const { value } = ev.target;

    if (cache[value]) {
      setYear(value);
      return setCollection(cache[value]);
    }

    setLoading(true);

    try {
      const res = await fetch(
        `/api/user/${user.login}/contributions?year=${value}`,
      );
      const data = await res.json();
      setCache((prev) => ({
        ...prev,
        [value]: data.user.contributionsCollection,
      }));
      setYear(value);
      setCollection(data.user.contributionsCollection);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleLoadMoreClick() {
    setLoadingRepos(true);

    try {
      const res = await fetch(
        `/api/user/${user.login}/contributions/repository-contributions?year=${year}&cursor=${collection.repositoryContributions.pageInfo.endCursor}`,
      );
      const data = await res.json();
      const {
        nodes,
        pageInfo,
        totalCount,
      } = data.user.contributionsCollection.repositoryContributions;

      setCollection((prev) => ({
        ...prev,
        repositoryContributions: {
          totalCount,
          nodes: [...prev.repositoryContributions.nodes, ...nodes],
          pageInfo: pageInfo,
        },
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRepos(false);
    }
  }

  return (
    <>
      <section className="mb3">
        <header className="flex aic mb1">
          <h2 className="fs-lg fw500 mr1 primary-text">Activity</h2>
          <span className="select mr1">
            <select
              onChange={handleSelectChange}
              disabled={loading}
              key={`${user.login}`}
            >
              <option>{internals.INITIAL_DATA_KEY}</option>
              {user.contributionsCollection.contributionYears.map((y, i) => (
                <option key={i} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="select-arrow" width={16} height={16} />
          </span>
          {loading && <Loader size={20} color="var(--color-secondary)" />}
        </header>

        <div className="paper rel">
          <p className="mb1">
            <span>
              {totalContributions.toLocaleString()} contributions in {year}
            </span>
            <span className="mr05 ml05">·</span>
            <small className="tertiary-text">
              {round(percent(totalPublicContributions, totalContributions))}%
              Public
              {' · '}
              {round(percent(restrictedContributionsCount, totalContributions))}
              % Private
            </small>
          </p>

          <div className="tertiary-text">
            <CalendarLine data={collection.contributionCalendar} />
          </div>
          <div className="paper-divider--h" />

          <div className="grid" style={{ '--columns': 3 }}>
            <div>
              <ActivityOverview
                commits={collection.totalCommitContributions}
                issues={collection.totalIssueContributions}
                pullRequests={collection.totalPullRequestContributions}
                reviews={collection.totalPullRequestReviewContributions}
                width={280}
                height={160}
              />
            </div>
            <div>
              <h4 className="fw500 mb1">Commits per language</h4>
              <PieChart
                data={commitsPerLanguage}
                colors={languageColors}
                cutout={0}
                width="100px"
              />
            </div>
            <div>
              <h4 className="fw500 mb1">
                Commits per repo (top {internals.COMMITS_PER_REPO_TOP_NUMBER})
              </h4>
              <PieChart data={commitsPerRepo} cutout={0} width="100px" />
            </div>
          </div>

          <div className="paper-divider--h" />

          <p>
            Created {collection.repositoryContributions.totalCount} repositories
            in {year}
          </p>
          <div>
            <div className="repository-contributions-list" ref={scrollingBox}>
              {collection.repositoryContributions.nodes.map((n, i) => (
                <RepoCard
                  key={i}
                  data={n.repository}
                  hideDescription
                  hideAvatar
                />
              ))}
              {collection.repositoryContributions.pageInfo.hasNextPage && (
                <div className="flex aic">
                  <span className="fs-sm tertiary-text mr05">
                    Showing {collection.repositoryContributions.nodes.length} of{' '}
                    {collection.repositoryContributions.totalCount}
                  </span>

                  {loadingRepos ? (
                    <Loader size={20} color="var(--color-secondary)" />
                  ) : (
                    <button className="secondary" onClick={handleLoadMoreClick}>
                      Load more
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {loading && <div className="fetching-layer"></div>}
        </div>
      </section>

      <style jsx>{`
        .fetching-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          color: var(--color-text-primary);
          background: rgba(255 255 255 / 0.5);
        }

        .repository-contributions-list {
          padding: 0.25rem;
          margin: 0 -0.25rem;
          display: grid;
          grid-gap: 0.5rem 1rem;
          grid-auto-flow: column;
          grid-auto-columns: 260px;
          grid-template-rows: repeat(2, 1fr);
          overflow-x: auto;
        }

        .repository-contributions-list:not(:empty) {
          margin-top: 1rem;
        }
      `}</style>
    </>
  );
}

UserActivity.propTypes = {
  user: object.isRequired,
  languageColors: object.isRequired,
};
