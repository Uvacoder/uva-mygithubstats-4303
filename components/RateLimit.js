import useSWR from 'swr';

export default function RateLimit() {
  const { data: rateLimit, error } = useSWR('/api/rate-limit', {
    refreshInterval: 3000
  });

  return (
    <>
      <div className="rate-limit">
        {rateLimit?.remaining ?? 0} requests left of {rateLimit?.limit ?? 0}
      </div>

      <style jsx>{`
        .rate-limit {
          font-size: 0.8rem;
          position: fixed;
          bottom: 1rem;
          right: 1rem;
          padding: 0.5rem 0.75rem;
          border: 1px solid var(--gps-border-color);
          background-color: white;
          border-radius: 4px;
          box-shadow: 0 0 0 2px rgb(0 0 0 / 0.05);
        }
      `}</style>
    </>
  );
}
