import { object } from 'prop-types';
import { useState } from 'react';
import RepoCard from '~/components/RepoCard';

export default function UserContributedRepositories({ user }) {
  const [repositories, setRepostories] = useState(
    user.repositoriesContributedTo.edges,
  );
  const [pageInfo, setPageInfo] = useState(
    user.repositoriesContributedTo.pageInfo,
  );

  async function handleLoadMoreClick() {
    try {
      const res = await fetch(
        `/api/user/${user.login}/repositories-contributed-to?cursor=${pageInfo.endCursor}`,
      );
      const data = await res.json();

      setRepostories((prev) => [
        ...prev,
        ...data.user.repositoriesContributedTo.edges,
      ]);
      setPageInfo(data.user.repositoriesContributedTo.pageInfo);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <section className="mb3">
      <h2 className="fs-lg fw500 mb1">
        Recently contributed to {user.repositoriesContributedTo.totalCount}{' '}
        repositories
      </h2>
      {Boolean(user.repositoriesContributedTo.totalCount) && (
        <>
          {repositories.some((r) => r.node.isInOrganization) && (
            <div className="flex aic mb1 fw">
              <p className="tertiary-text mr05">Organizations</p>
              <ul className="clean-list flex fw">
                {[
                  ...new Map(
                    repositories
                      .filter((repo) => repo.node.isInOrganization)
                      .map((repo) => [repo.node.owner.login, repo.node]),
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
            {repositories.map((node, i) => (
              <RepoCard
                key={i}
                data={{ name: node.node.nameWithOwner, ...node.node }}
                hideDescription
                hideStars
                hideForks
              />
            ))}
            {pageInfo.hasNextPage && (
              <button onClick={handleLoadMoreClick}>
                request more data abckjasg
              </button>
            )}
          </div>
        </>
      )}
      <style jsx>{`
        .contributed-to-list {
          padding: 0.25rem 0;
          display: grid;
          grid-gap: 0.5rem 1rem;
          grid-auto-flow: column;
          grid-auto-columns: minmax(260px, 1fr);
          grid-template-rows: repeat(3, 1fr);
          overflow-x: auto;
        }
      `}</style>
    </section>
  );
}

UserContributedRepositories.propTypes = {
  user: object.isRequired,
};
