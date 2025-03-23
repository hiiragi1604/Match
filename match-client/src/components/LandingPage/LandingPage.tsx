import React, { useRef } from 'react';
import "./LandingPage.module.scss";

export const LandingPage = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    inputRef.current?.focus();
  };

  return (
    <div className={styles.containerWrapper}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>Match with Your Future</h1>
          <form className={styles.searchBar}>
            <input
              ref={inputRef}
              type="search"
              name="search"
              pattern=".*\S.*"
              required
            />
            <button 
              className={styles.searchBtn} 
              type="submit"
              onClick={handleSearchClick}
            >
              <span>Search</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}