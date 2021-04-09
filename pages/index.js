import { useState } from 'react';
import Head from 'next/head'
import SearchInput from '../components/SearchInput';
import UserLinkCard from '../components/UserLinkCard';
import styles from '../styles/Home.module.css'

const { log, error } = console;

export default function Home() {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  async function handleFormSubmit({ term }) {
    const q = term.trim();

    setSearchResults([]);

    if (!q) return;

    setIsSearching(true);

    try {
      const res = await fetch(`/api/search?q=${q}`);
      const data = await res.json();
      setSearchResults(data.search.nodes);
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
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <p className={styles.description}>
        Enter GitHub username
      </p>

      <div className={styles.inputWrapper}>
        <SearchInput
          placeholder="ex. 'noeldelgado'"
          loading={isSearching}
          autoFocus={true}
          onFormSubmit={handleFormSubmit}
          onClearForm={() => setSearchResults([])}
        />
      </div>

      <ul className={styles.searchResultsList}>
        {searchResults.map((user) => {
          return (
            <li key={user.id}>
              <UserLinkCard data={user}/>
            </li>
          );
        })}
      </ul>
    </div>
  )
}
