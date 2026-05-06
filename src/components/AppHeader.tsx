import React from 'react';
import styles from './AppHeader.module.css';

export default function AppHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.cross}>✦ ✦ ✦</div>
      <h1 className={styles.title}>Reconciliation</h1>
      <div className={styles.subtitle}>A companion for the Sacrament of Penance</div>
    </header>
  );
}
