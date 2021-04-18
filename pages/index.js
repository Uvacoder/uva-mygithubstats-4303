import { useState } from 'react';
import Head from 'next/head'
import SearchInput from '~/components/SearchInput';
import UserLinkCard from '~/components/UserLinkCard';
import styles from '~/styles/Home.module.css'

const { log, error } = console;

const internals = {
  reSpace: new RegExp(/\s/g),
};

export default function Home() {
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  async function handleFormSubmit({ term }) {
    const q = term.replace(internals.reSpace, '');

    setSearchResults(null);

    if (!q) return;

    setIsSearching(true);

    try {
      const res = await fetch(`/api/search?q=${q}`);
      const data = await res.json();
      setSearchResults({
        search: data.search,
        term: q
      });
    } catch (err) {
      error(err);
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>GitHub Profile Stats</title>
        <meta name='description' content='gh-profile-stats displays different statistics for GitHub users'/>
      </Head>

      <p className={styles.description}>
        Enter GitHub username
      </p>

      <div className={styles.inputWrapper}>
        <SearchInput
          placeholder="e.g. 'noeldelgado'"
          loading={isSearching}
          autoFocus={true}
          onFormSubmit={handleFormSubmit}
          onClearForm={() => setSearchResults(null)}
        />
      </div>

      {Boolean(searchResults?.search?.userCount) && (
        <ul className={styles.searchResultsList}>
          {searchResults.search.nodes.map((user) => {
            return (
              <li key={user.id}>
                <UserLinkCard data={user}/>
              </li>
            );
          })}
        </ul>
      )}

      {Boolean(searchResults?.search?.userCount === 0) && (
        <div className={styles.noSearchResults}>
          <p className='mb05'>
            Your search for “{searchResults.term}” didn’t return any results.
          </p>
          <p className='secondary-text'>
            <i>
              Check the username typing or <br/>visit
              {' '}
              <a
                href={`https://github.com/${searchResults.term}`}
                rel='noopener noreferrer'
                target='_blank'>GitHub/{searchResults.term}
              </a>
              {' '}
              to see if the user exists.
            </i>
          </p>
        </div>
      )}
    </div>
  )
}
