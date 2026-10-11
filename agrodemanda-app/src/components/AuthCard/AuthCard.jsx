import React from 'react';
import styles from './AuthCard.module.css';

export default function AuthCard({ children, className = '' }) {
  return (
    <div className={`${styles.card} ${className}`}>
      {children}
    </div>
  );
}
