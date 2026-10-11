import React from 'react';
import styles from './Button.module.css';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'pill'
  type = 'button',
  loading = false,
  loadingText,
  disabled = false,
  className = '',
  onClick,
  ...props
}) {
  const isPill = variant === 'pill';

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${styles.button} ${isPill ? styles.pill : styles.primary} ${className}`}
      {...props}
    >
      {loading ? (
        <span className={styles.loadingWrapper}>
          <span className={styles.spinner} aria-hidden="true" />
          <span>{loadingText || 'Carregando...'}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
