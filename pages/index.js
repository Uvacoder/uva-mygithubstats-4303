import { useState } from 'react';
import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

const { log, error } = console;

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  async function handleFormSubmit(ev) {
    ev.preventDefault();

    const q = searchTerm.trim();
    if (!q) return;

    try {
      const res = await fetch(`/api/search?q=${q}`);
      const data = await res.json();
      setSearchResults(data.search.nodes);
    } catch (err) {
      error(err);
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

      <form
        onSubmit={handleFormSubmit}
      >
        <input
          type="text"
          placeholder="ex. 'noeldelgado'"
          className={styles.input}
          value={searchTerm}
          onChange={(ev) => setSearchTerm(ev.target.value)}
        />
      </form>

      <ul className={styles.list}>
        {searchResults.map((user) => {
          return (
            <li key={user.id}>
              <Link href={`/user/${user.login}`}>
                <a>
                  <div>
                    <img
                      src={user.avatarUrl}
                      alt={user.login + ' avatar'}
                      width={40}
                      height={40}
                    />
                  </div>
                  <div>
                    <p><b>{user.login}</b></p>
                    <small>{user.name}</small>
                  </div>
                </a>
              </Link>
            </li>
          );
        })}
      </ul>

    </div>
  )
}
