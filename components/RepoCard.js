import { ExclamationCircleIcon, ExternalLinkIcon, StarIcon } from '@heroicons/react/outline';
import Parse from 'html-react-parser';
import { arrayOf, bool, exact, number, shape, string } from 'prop-types';
import ColorItem from '~/components/ColorItem';
import { prettyNumber } from '~/util';

export default function RepoCard({
  data,
  hideDescription = false,
  hideStars = false,
  hideForks = false,
  hideAvatar = false
}) {
  return (
    <>
      <div className='root repo-card flex'>
        {Boolean(!hideAvatar) && (
          <div>
            <img
              className='avatar'
              src={data.owner.avatarUrl}
              alt={`${data.owner.login} avatar`}
              width={24}
              height={24}
            />
          </div>
        )}
        <div className='info-wrapper'>
          <p>
            <a
              href={data.url}
              target='_blank'
              rel='noopener noreferrer'
              className='flex aic'
            >
              <span className='name'>{data.name}</span>
              &nbsp;
              <span>
                <ExternalLinkIcon
                  width={14}
                  height={14}
                  className='block'
                />
              </span>
            </a>
          </p>

          {Boolean(!hideDescription) && (
            <div className='description'>
              {Parse(data.descriptionHTML ?? '')}
            </div>
          )}

          <p className='stats'>
            {data.primaryLanguage && (
              <span>
                <ColorItem
                  color={data.primaryLanguage.color}
                  text={data.primaryLanguage.name}
                />
              </span>
            )}
            {Boolean(!hideStars) && (
              <span className='flex aic'>
                <StarIcon width={16} height={16}/>
                <span className='tertiary-text'>
                  {prettyNumber(data.stargazerCount)}
                </span>
              </span>
            )}
            {Boolean(!hideForks) && (
              <span className='flex aic'>
                <svg width={14} height={14}  viewBox='0 0 16 16'>
                  <path fillRule='evenodd' d='M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z'></path>
                </svg>
                <span className='tertiary-text'>
                  {prettyNumber(data.forkCount)}
                </span>
              </span>
            )}
            {Boolean(false) && (
              <span className='flex aic'>
                <ExclamationCircleIcon width={16} height={16}/>
                <span className='tertiary-text'>
                  {data.issues.totalCount}
                </span>
              </span>
            )}
            {Boolean(false) && (
              <span className='flex aic'>
                <svg width={14} height={14} viewBox='0 0 16 16'>
                  <path fillRule='evenodd' d='M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zM11 2.5h-1V4h1a1 1 0 011 1v5.628a2.251 2.251 0 101.5 0V5A2.5 2.5 0 0011 2.5zm1 10.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.75 12a.75.75 0 100 1.5.75.75 0 000-1.5z'></path>
                </svg>
                <span className='tertiary-text'>
                  {data.pullRequests.totalCount}
                </span>
              </span>
            )}
          </p>
        </div>
      </div>

      <style jsx>{`
        .root {
          font-size: 0.8rem;
          padding: .25rem .5rem;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 0 4px 1px rgba(0 0 0 / .05);
          overflow: hidden;
        }

        a {
          color: var(--color-text-secondary);
        }

        .avatar {
          border-radius: 4px;
          margin: 0.25rem 0.5rem 0 0;
        }

        .info-wrapper { overflow: hidden }

        .name {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          font-weight: 500;
        }

        .description:not(:empty) {
          margin-bottom: 0.5rem;
        }

        .stats {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          color: var(--color-text-tertiary);
        }
        .stats > span:not(:last-child) {
          margin-right: 0.5rem;
        }
        .stats svg {
          display: inline-block;
          vertical-align: text-bottom;
          margin-right: 0.25rem;
        }
      `}</style>
    </>
  );
}

RepoCard.propTypes = {
  data: shape({
    name: string.isRequired,
    url: string.isRequired,

    descriptionHTML: string,
    stargazerCount: number,
    forkCount: number,
    owner: shape({
      login: string.isRequired,
      avatarUrl: string.isRequired
    }),
    primaryLanguage: shape({
      name: string.isRequired,
      color: string.isRequired
    }),
    issues: exact({
      totalCount: number
    }),
    pullRequests: exact({
      totalCount: number
    })
  }).isRequired,

  hideDescription: bool,
  hideStars: bool,
  hideForks: bool,
  hideAvatar: bool
};
