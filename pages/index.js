import Head from 'next/head';
import SearchUser from '~/components/SearchUser';

export async function getStaticProps() {
  return { props: { hideHeaderSearch: true } };
}

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>View GitHub Profile Stats</title>
        <meta
          name="description"
          content="gh-profile-stats: different statistics for GitHub users"
        />
      </Head>

      <p className="fw500 mb05">Search GitHub User</p>

      <div className="search-wrapper">
        <SearchUser autoFocus={true} placeholder="e.g. uvacoder" />
      </div>

      <style jsx>{`
        .container {
          max-width: 420px;
          margin: 0 auto;
          padding: 4rem 0 2rem;
        }

        .search-wrapper {
          margin: 0 auto 1rem;
        }

        .search-wrapper > :global(.search-user > form) {
          font-size: 1.5rem;
        }
      `}</style>
    </div>
  );
}
