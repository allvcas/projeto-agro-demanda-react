import React, { forwardRef } from 'react';
import styles from './LocationLink.module.css';

const LocationLink = forwardRef(function LocationLink(
  { location, onClick, error, className = '' },
  ref
) {
  // If location filled, summary = "Bairro · Ponto de referência"
  const hasLocation = location && location.neighborhood && location.reference;
  const displayText = hasLocation
    ? `${location.neighborhood} · ${location.reference}`
    : 'Localização';

  return (
    <div className={`${styles.container} ${className}`}>
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        className={`${styles.locationBtn} ${error ? styles.btnError : ''} ${hasLocation ? styles.btnFilled : ''}`}
        aria-label={hasLocation ? `Localização definida: ${displayText}. Clique para alterar` : 'Definir localização'}
      >
        <span className={styles.pinIcon} aria-hidden="true">
          📍
        </span>
        <span className={styles.text} title={displayText}>
          {displayText}
        </span>
        <span className={styles.chevron} aria-hidden="true">
          &gt;
        </span>
      </button>
      {error && (
        <span className={styles.errorMessage} role="alert">
          {error}
        </span>
      )}
    </div>
  );
});

export default LocationLink;
