import React, { useEffect } from 'react';
import styles from './FeedbackDialog.module.css';
import Button from '../Button/Button';

export default function FeedbackDialog({
  isOpen,
  title = 'Sucesso!',
  message,
  onClose,
  type = 'success', // 'success' | 'error'
}) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-desc"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.iconCircle}>
          {type === 'success' ? '✓' : '!'}
        </div>
        <h2 id="dialog-title" className={styles.title}>
          {title}
        </h2>
        <p id="dialog-desc" className={styles.message}>
          {message}
        </p>
        <div className={styles.buttonWrapper}>
          <Button variant="pill" onClick={onClose} autoFocus>
            OK
          </Button>
        </div>
      </div>
    </div>
  );
}
