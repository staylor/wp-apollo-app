import React from 'react';
import styles from './Error.scss';

export default function Error() {
  return (
    <article>
      <header>
        <h1 className={styles.title}>Not Found</h1>
      </header>
      <p>Sorry not sorry.</p>
    </article>
  );
}
