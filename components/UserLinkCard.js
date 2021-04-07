import Link from 'next/link';
import styles from '../styles/components/UserLinkCard.module.css'

export default function UserCard({ data: user }) {
  return (
    <Link href={`/user/${user.login}`}>
      <a className={styles.link}>
        <div className={styles.imageWrapper}>
          <img
            src={user.avatarUrl}
            alt={user.login + ' avatar'}
            width={40}
            height={40}
          />
        </div>
        <div className={styles.infoWrapper}>
          <p>
            <b className='fw500'>{user.login}</b>
            <br/>
            <small>{user.name}</small>
          </p>
        </div>
      </a>
    </Link>
  );
}
