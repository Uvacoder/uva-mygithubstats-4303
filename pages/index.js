import Head from 'next/head';
import SearchUser from '~/components/SearchUser';

const { error } = console;

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>GitHub Profile Stats</title>
        <meta
          name="description"
          content="gh-profile-stats: different statistics for GitHub users"
        />
      </Head>

      <p className="fw500 mb05">Search user</p>

      <div className="search-wrapper">
        <SearchUser autoFocus={true} placeholder="e.g. noeldelgado" />
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
