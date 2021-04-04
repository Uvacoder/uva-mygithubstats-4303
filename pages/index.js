import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>GitHub Profile Stats</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <p className={styles.description}>
        Enter GitHub username
      </p>

      <form>
        <input
          type="text"
          placeholder="ex. 'noeldelgado'"
          className={styles.input}
        />
      </form>
    </div>
  )
}
