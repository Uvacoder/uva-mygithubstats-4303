import { SearchIcon } from '@heroicons/react/outline';
import { XCircleIcon } from '@heroicons/react/solid';
import { bool, func, string } from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import useDebounce from '~/hooks/useDebounce';
import styles from '~/styles/components/SearchInput.module.css';

export default function SearchInput({
  loading = false,
  placeholder = 'Search',
  autoFocus = false,
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
    if (debouncedSearchTerm) {
      onFormSubmit({ term: searchTerm });
    }
  }, [debouncedSearchTerm]);

  function clear() {
    setSearchTerm('');
    onClearForm();
  }

  return (
    <form
      className={`${styles.form} search-input rel`}
      onSubmit={(ev) => ev.preventDefault()}
    >
      <label className={styles.label}>
        <div className={styles.magnifier}>
          <SearchIcon width={24} height={24} />
        </div>
        <input
          type="text"
          autoCapitalize="none"
          ref={inputElement}
          placeholder={placeholder}
          className={styles.input}
          value={searchTerm}
          onChange={(ev) => setSearchTerm(ev.target.value)}
        />
        <div className={styles.controls}>
          <div className={styles.loader} style={{ opacity: loading ? 1 : 0 }}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          {searchTerm && !loading && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={clear}
            >
              <XCircleIcon width={16} height={16} />
            </button>
          )}
        </div>
      </label>
    </form>
  );
}

SearchInput.propTypes = {
  loading: bool,
  placeholder: string,
  autoFocus: bool,
  onFormSubmit: func,
  onClearForm: func,
};
