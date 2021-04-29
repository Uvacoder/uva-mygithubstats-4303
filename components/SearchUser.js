import { useState } from 'react';
import { bool, string } from 'prop-types';
import SearchInput from '~/components/SearchInput';
import UserLinkCard from '~/components/UserLinkCard';
import { KEYCODES } from '~/util/constants';

const { error } = console;

export default function SearchUser({
  autoFocus = false,
  placeholder = 'GitHub user',
}) {
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isUserSelected, setIsUserSelected] = useState(false);
  const [showResults, setShowResults] = useState(false);

  function handleKeyDown(ev) {
    if (ev.keyCode === KEYCODES.ESC) {
      ev.preventDefault();
      document.activeElement.blur();
      setShowResults(false);
    }
  }

  async function handleFormSubmit({ term }) {
    const q = term.trim();

    setSearchResults(null);
    setIsUserSelected(false);

    if (!q) return;

    setIsSearching(true);

    try {
      const res = await fetch(`/api/search?q=${q}`);
      const data = await res.json();
      setSearchResults({
        search: data.search,
        term: q,
      });
    } catch (err) {
      error(err);
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <div
      className="search-user rel"
      onKeyDown={handleKeyDown}
      onFocus={() => setShowResults(true)}
    >
      {Boolean(searchResults?.search) && (
        <div
          className="backdrop-overlay"
          style={{ display: showResults ? 'block' : 'none' }}
          onClick={() => setShowResults(false)}
        />
      )}

      <SearchInput
        placeholder={placeholder}
        loading={isSearching}
        autoFocus={autoFocus}
        reset={isUserSelected}
        onFormSubmit={handleFormSubmit}
        onClearForm={() => setSearchResults(null)}
      />

      <div
        className="search-user__floating-box"
        style={{ display: showResults ? 'block' : 'none' }}
      >
        {Boolean(searchResults?.search?.userCount) && (
          <ul className="results-list">
            {searchResults.search.nodes
              .filter((node) => node.id)
              .map((user) => (
                <li key={user.id}>
                  <UserLinkCard
                    data={user}
                    onClick={() => setIsUserSelected(true)}
                  />
                </li>
              ))}
          </ul>
        )}

        {Boolean(searchResults?.search?.userCount === 0) && (
          <div className="no-results">
            <p className="mb05">
              Your search for{' '}
              <span className="fw500">“{searchResults.term}”</span> didn’t
              return any results.
            </p>
            <p className="secondary-text">
              <i>
                Check the username typing or <br />
                visit{' '}
                <a
                  href={`https://github.com/${searchResults.term}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  GitHub/{searchResults.term}
                </a>{' '}
                to see if the user exists.
              </i>
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        .backdrop-overlay {
          position: fixed;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
        }

        .search-user__floating-box {
          position: absolute;
          top: calc(100% + 4px);
          right: 0;
          width: 100%;
          min-width: 300px;
          background-color: var(--color-accent-1);
          border-radius: 4px;
          border: 1px solid var(--color-input-border);
        }

        .search-user__floating-box:empty {
          visibility: hidden;
        }

        .results-list {
          max-height: 50vh;
          overflow: auto;
          padding: 0.25rem;
          list-style: none;
        }

        .no-results {
          padding: 1rem;
        }
      `}</style>
    </div>
  );
}

SearchUser.propTypes = {
  autoFocus: bool,
  placeholder: string,
};
