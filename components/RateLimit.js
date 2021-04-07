import useSWR from 'swr';
import styles from '../styles/components/RateLimit.module.css';

export default function RateLimit() {
  const { data: rateLimit, error } = useSWR('/api/rate-limit', {
    refreshInterval: 3000
  });
  const remaining = rateLimit?.remaining;

  let status = '';

  if (remaining === 0)
    status = 'error';
  else if (remaining <= 100)
    status = 'warn';
  else if (remaining > 100)
    status = 'ok';

  return (
    <>
      <div className={styles.root} data-status={status}>
        <svg viewBox='0 0 10 10' width={10} height={10} className={styles.status}>
          <circle r={5} cx={5} cy={5}/>
        </svg>
        {remaining} requests left
      </div>
    </>
  );
}
