import { ChevronDownIcon } from '@heroicons/react/outline';
import { object } from 'prop-types';
import { useState, useEffect } from 'react';
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
  const [cache, setCache] = useState({
    [internals.INITIAL_DATA_KEY]: user.contributionsCollection,
  });
  const [collection, setCollection] = useState(
    cache[internals.INITIAL_DATA_KEY],
  );
  const [year, setYear] = useState(internals.INITIAL_DATA_KEY);
  const [loading, setLoading] = useState(false);

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
    ReactTooltip.rebuild();
  }, [collection]);

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

  return (
    <>
      <section className="mb3">
        <header className="flex aic mb1">
          <h2 className="fs-lg fw500 mr1 primary-text">Activity</h2>
          <span className="select mr1">
            <select onChange={handleSelectChange} disabled={loading}>
              <option>{internals.INITIAL_DATA_KEY}</option>
              {user.contributionsCollection.contributionYears.map((y, i) => (
                <option key={i} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="select-arrow" width={16} height={16} />
          </span>
          {loading && <Loader className="mb1" width={20} />}
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
                width={240}
                height={172}
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
            <ul className="repository-contributions-list clean-list">
              {collection.repositoryContributions.nodes.map((n, i) => (
                <li key={i}>
                  <RepoCard data={n.repository} hideDescription hideAvatar />
                </li>
              ))}
            </ul>
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
          display: grid;
          grid-gap: 1rem;
          grid-template-columns: repeat(auto-fill, minmax(154px, 1fr));
        }

        .repository-contributions-list:not(:empty) {
          margin-top: 1rem;
        }

        .repository-contributions-list > li > :global(.repo-card) {
          padding: 0;
          box-shadow: none;
        }
      `}</style>
    </>
  );
}

UserActivity.propTypes = {
  user: object.isRequired,
  languageColors: object.isRequired,
};
