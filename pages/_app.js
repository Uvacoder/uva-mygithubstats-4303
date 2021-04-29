import Header from '~/components/Header';
import Footer from '~/components/Footer';

import '~/styles/globals.css';
import '~/styles/vendor-overrides/react-tooltip.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Header hideSearch={pageProps.hideHeaderSearch} />
      <main className="app-main">
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  );
}

export default MyApp;
