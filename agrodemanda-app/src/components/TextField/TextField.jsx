import React, { forwardRef } from 'react';
import styles from './TextField.module.css';

const TextField = forwardRef(function TextField(
  {
    id,
    label,
    type = 'text',
    value,
    onChange,
    onBlur,
    placeholder,
    error,
    disabled = false,
    autoComplete,
    className = '',
    ...props
  },
  ref
) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={`${styles.fieldGroup} ${className}`}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={errorId}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        {...props}
      />
      {error && (
        <span id={errorId} className={styles.errorMessage} role="alert">
          {error}
        </span>
      )}
    </div>
  );
});

export default TextField;
