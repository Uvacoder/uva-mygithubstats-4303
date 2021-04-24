import { ExternalLinkIcon, StarIcon } from '@heroicons/react/outline';
import Parse from 'html-react-parser';
import { bool, number, shape, string } from 'prop-types';
import ColorItem from '~/components/ColorItem';
import { prettyNumber } from '~/util';
import styles from '~/styles/components/RepoCard.module.css'

export default function RepoCard({
  data,
  hideDescription = false,
  hideStars = false,
  hideForks = false
}) {
  return (
    <div className={styles.card}>
      <p>
        <a
          href={data.url}
          target='_blank'
          rel='noopener noreferrer'
          className='flex aic'
        >
          <span>{data.name}</span>
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
        <div className={styles.description}>
          {Parse(data.descriptionHTML)}
        </div>
      )}

      <p className={styles.stats}>
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
            {prettyNumber(data.stargazerCount)}
          </span>
        )}
        {Boolean(!hideForks) && (
          <span className='flex aic'>
            <svg width={14} height={14}  viewBox='0 0 16 16'>
              <path fill-rule='evenodd' d='M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z'></path>
            </svg>
            {prettyNumber(data.forkCount)}
          </span>
        )}
      </p>
    </div>
  );
}

RepoCard.propTypes = {
  data: shape({
    name: string.isRequired,
    url: string.isRequired,

    primaryLanguage: shape({
      name: string.isRequired,
      color: string.isRequired
    }),
    descriptionHTML: string,
    stargazerCount: number,
    forkCount: number
  }).isRequired,

  hideDescription: bool,
  hideStars: bool,
  hideForks: bool
};
