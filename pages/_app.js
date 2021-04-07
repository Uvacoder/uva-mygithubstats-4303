import RateLimit from '../components/RateLimit';

import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <div className="app-wrapper">
      <main className="app-main">
        <Component {...pageProps} />
      </main>
      <footer className="app-footer">
        <p>View the <a href="https://github.com/noeldelgado/gh-profile-stats" rel="noopener noreferrer" target="_blank">source on Github</a></p>
      </footer>
      <RateLimit/>
    </div>
  )
}

export default MyApp
