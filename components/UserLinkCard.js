import Link from 'next/link';
import { func, shape, string } from 'prop-types';

export default function UserLinkCard({ data: user, onClick = () => {} }) {
  return (
    <>
      <Link href={`/user/${user.login}`}>
        <a className="root" onClick={() => onClick()}>
          <div className="mr1">
            <img
              src={user.avatarUrl}
              alt={user.login + ' avatar'}
              width={32}
              height={32}
              className="block br4"
            />
          </div>
          <div className="text-wrapper">
            <p>
              <span className="primary-text fw500 mr05">{user.name}</span>
              <span className="secondary-text fw500 mr05">{user.login}</span>
              <span className="tertiary-text">{user.location}</span>
            </p>
          </div>
        </a>
      </Link>

      <style jsx>{`
        .root {
          height: 48px;
          padding: 0.25rem 0.5rem;
          display: flex;
          align-items: center;
          white-space: nowrap;
          line-height: 1.2;
          border-radius: 4px;
        }

        .root:focus,
        .root:hover {
          background-color: var(--color-background);
        }

        .text-wrapper {
          overflow: hidden;
        }
        .text-wrapper > p {
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </>
  );
}

UserLinkCard.propTypes = {
  data: shape({
    id: string,
    login: string,
    avatarUrl: string,
    location: string,
  }).isRequired,

  onClick: func,
};
