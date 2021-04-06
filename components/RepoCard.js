import styles from '../styles/components/RepoCard.module.css'

export default function RepoCard({
  data: { node },
  hideDescription = false,
  hideStars = false,
  hideForks = false
}) {
  return (
    <div className={styles.card}>
      <div>
        <a
          href={node.url}
          target='_blank'
          rel='noopener noreferrer'
        >
          {node.name}
          {' '}
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24">
            <path d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"/>
          </svg>
        </a>
      </div>
      {Boolean(!hideDescription) && (
        <p className={styles.description}>{node.description}</p>
      )}
      <p className={styles.stats}>
        {node.primaryLanguage && (
          <span>
            <svg width={12} height={12}>
              <circle fill={node.primaryLanguage.color} r={6} cx={6} cy={6} />
            </svg>
            {node.primaryLanguage.name}
          </span>
        )}
        {Boolean(!hideStars) && (
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M12 5.173l2.335 4.817 5.305.732-3.861 3.71.942 5.27-4.721-2.524-4.721 2.525.942-5.27-3.861-3.71 5.305-.733 2.335-4.817zm0-4.586l-3.668 7.568-8.332 1.151 6.064 5.828-1.48 8.279 7.416-3.967 7.416 3.966-1.48-8.279 6.064-5.827-8.332-1.15-3.668-7.569z"/></svg>
            {node.stargazerCount}
          </span>
        )}
        {Boolean(!hideForks) && (
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path d="M21 3c0-1.657-1.343-3-3-3s-3 1.343-3 3c0 1.323.861 2.433 2.05 2.832.168 4.295-2.021 4.764-4.998 5.391-1.709.36-3.642.775-5.052 2.085v-7.492c1.163-.413 2-1.511 2-2.816 0-1.657-1.343-3-3-3s-3 1.343-3 3c0 1.305.837 2.403 2 2.816v12.367c-1.163.414-2 1.512-2 2.817 0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.295-.824-2.388-1.973-2.808.27-3.922 2.57-4.408 5.437-5.012 3.038-.64 6.774-1.442 6.579-7.377 1.141-.425 1.957-1.514 1.957-2.803zm-16.8 0c0-.993.807-1.8 1.8-1.8s1.8.807 1.8 1.8-.807 1.8-1.8 1.8-1.8-.807-1.8-1.8zm3.6 18c0 .993-.807 1.8-1.8 1.8s-1.8-.807-1.8-1.8.807-1.8 1.8-1.8 1.8.807 1.8 1.8z"/></svg>
            {node.forkCount}
          </span>
        )}
      </p>
    </div>
  );
}
