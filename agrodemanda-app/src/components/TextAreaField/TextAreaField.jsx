import React, { forwardRef } from 'react';
import styles from './TextAreaField.module.css';

const TextAreaField = forwardRef(function TextAreaField(
  {
    id,
    label,
    value,
    onChange,
    onBlur,
    placeholder = 'Ex: Sem iluminação na br-180',
    error,
    maxLength = 500,
    className = '',
    ...props
  },
  ref
) {
  const errorId = error ? `${id}-error` : undefined;
  const currentLength = value ? value.length : 0;

  return (
    <div className={`${styles.fieldGroup} ${className}`}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <div className={`${styles.textareaWrapper} ${error ? styles.wrapperError : ''}`}>
        <textarea
          ref={ref}
          id={id}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={4}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className={styles.textarea}
          {...props}
        />
        {/* Decorative '+' symbol observed in the prototype (divergence/P-09) */}
        <span className={styles.decorativePlus} aria-hidden="true">
          +
        </span>
      </div>
      <div className={styles.metaRow}>
        {error ? (
          <span id={errorId} className={styles.errorMessage} role="alert">
            {error}
          </span>
        ) : <span />}
        <span className={styles.counter}>
          {currentLength}/{maxLength}
        </span>
      </div>
    </div>
  );
});

export default TextAreaField;
