import React from 'react';
import styles from './AuthLayout.module.css';
import fieldBg from '../../assets/field-bg.jpg';

export default function AuthLayout({ children }) {
  return (
    <main
      className={styles.authContainer}
      style={{ backgroundImage: `url(${fieldBg})` }}
    >
      <div className={styles.overlay} />
      <div className={styles.contentWrapper}>
        {children}
      </div>
    </main>
  );
}
