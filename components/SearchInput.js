import { useEffect, useRef, useState } from 'react';
import styles from '~/styles/components/SearchInput.module.css'

export default function SearchInput({
  loading = false,
  placeholder = 'Search',
  autoFocus = false,
  onFormSubmit = () => {},
  onClearForm = () => {}
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const inputElement = useRef(null);

  useEffect(() => {
    if (autoFocus) {
      inputElement.current?.focus();
    }
  }, []);

  function submit(ev) {
    ev.preventDefault();
    onFormSubmit({ term: searchTerm });
  }

  function clear() {
    setSearchTerm('');
    onClearForm();
  }

  return (
    <form
      className={styles.form}
      onSubmit={submit}
    >
      <label className={styles.label}>
        <div className={styles.magnifier}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path d="M23.822 20.88l-6.353-6.354c.93-1.465 1.467-3.2 1.467-5.059.001-5.219-4.247-9.467-9.468-9.467s-9.468 4.248-9.468 9.468c0 5.221 4.247 9.469 9.468 9.469 1.768 0 3.421-.487 4.839-1.333l6.396 6.396 3.119-3.12zm-20.294-11.412c0-3.273 2.665-5.938 5.939-5.938 3.275 0 5.94 2.664 5.94 5.938 0 3.275-2.665 5.939-5.94 5.939-3.274 0-5.939-2.664-5.939-5.939z"/>
          </svg>
        </div>
        <input
          type='text'
          autoCapitalize='none'
          ref={inputElement}
          placeholder={placeholder}
          className={styles.input}
          value={searchTerm}
          onChange={(ev) => setSearchTerm(ev.target.value)}
        />
        <div className={styles.controls}>
          <div
            className={styles.loader}
            style={{opacity: loading ? 1 : 0}}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
          {searchTerm && !loading &&
            <button
              type="button"
              className={styles.clearButton}
              onClick={clear}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.151 17.943l-4.143-4.102-4.117 4.159-1.833-1.833 4.104-4.157-4.162-4.119 1.833-1.833 4.155 4.102 4.106-4.16 1.849 1.849-4.1 4.141 4.157 4.104-1.849 1.849z"/>
              </svg>
            </button>
          }
        </div>
      </label>
    </form>
  );
}

