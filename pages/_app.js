import RateLimit from '../components/RateLimit';

import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <div className="app-wrapper">
      <main className="app-main">
        <Component {...pageProps} />
      </main>
      <footer className="app-footer">
        [global footer]
      </footer>
      <RateLimit/>
    </div>
  )
}

export default MyApp
