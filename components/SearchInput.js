import { SearchIcon } from '@heroicons/react/outline';
import { XCircleIcon } from '@heroicons/react/solid';
import { bool, func, string } from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import Loader from '~/components/Loader';
import useDebounce from '~/hooks/useDebounce';

export default function SearchInput({
  loading = false,
  placeholder = 'Search',
  autoFocus = false,
  reset = false,
  onFormSubmit = () => {},
  onClearForm = () => {},
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const inputElement = useRef(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (autoFocus) {
      inputElement.current?.focus();
    }
  }, []);

  useEffect(() => {
    if (reset) {
      clearForm();
    }
  }, [reset]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      onFormSubmit({ term: searchTerm });
    }
  }, [debouncedSearchTerm]);

  function clearForm() {
    setSearchTerm('');
    onClearForm();
  }

  return (
    <>
      <form className="search-input rel" onSubmit={(ev) => ev.preventDefault()}>
        <label className="flex aic br4 tertiary-text">
          <div className="search-icon-wrapper">
            <SearchIcon width={24} height={24} className="block" />
          </div>
          <input
            type="text"
            autoCapitalize="none"
            ref={inputElement}
            placeholder={placeholder}
            className="search-input-field"
            value={searchTerm}
            onChange={(ev) => setSearchTerm(ev.target.value)}
          />
          <div className="controls flex aic">
            <div
              className="control-loader flex jcc"
              style={{ visibility: loading ? 'visible' : 'hidden' }}
            >
              <Loader size={'1em'} />
            </div>
            {searchTerm && !loading && (
              <button
                type="button"
                className="control-clear-btn flex aic jcc"
                onClick={clearForm}
              >
                <XCircleIcon width={16} height={16} />
              </button>
            )}
          </div>
        </label>
      </form>

      <style jsx>{`
        label {
          background-color: var(--color-accent-1);
          box-shadow: 0 0 0 1px var(--color-border);
        }
        label:hover {
          box-shadow: 0 0 1px 1px var(--color-state-focus-outline);
        }
        label:focus-within {
          box-shadow: 0 0 1px 2px var(--color-state-focus-outline);
        }

        .search-icon-wrapper {
          padding: 0 0.5em;
        }
        .search-icon-wrapper > :global(svg) {
          width: 1em;
          height: 1em;
        }

        .search-input-field {
          width: 100%;
          height: 2em;
          padding: 0.5rem 0;
          border: none;
          outline: none;
        }

        .controls {
          min-width: 2em;
          height: 2em;
        }
        .control-loader {
          pointer-events: none;
          position: absolute;
          width: 2em;
          height: 2em;
        }
        .control-clear-btn {
          min-width: 2em;
          min-height: 2em;
          border: none;
          background-color: rgb(0 0 0 / 0);
          color: inherit;
          border-radius: 0;
        }
        .control-clear-btn > :global(svg) {
          width: 1em;
          height: 1em;
          display: inline-block;
          margin: 0 auto;
        }
      `}</style>
    </>
  );
}

SearchInput.propTypes = {
  loading: bool,
  placeholder: string,
  autoFocus: bool,
  reset: bool,
  onFormSubmit: func,
  onClearForm: func,
};
