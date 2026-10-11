import React from 'react';
import styles from './CategoryTile.module.css';

export default function CategoryTile({
  id,
  label,
  icon,
  isSelected,
  onSelect,
  tabIndex,
  onKeyDown,
}) {
  const isOther = id === 'outro';

  const renderIcon = () => {
    switch (icon) {
      case 'health':
        // Cruz da Saúde
        return (
          <svg viewBox="0 0 24 24" className={styles.iconSvg} aria-hidden="true">
            <path
              d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3z"
              fill="currentColor"
            />
          </svg>
        );
      case 'water':
        // Gota de Água
        return (
          <svg viewBox="0 0 24 24" className={styles.iconSvg} aria-hidden="true">
            <path
              d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
              fill="currentColor"
            />
          </svg>
        );
      case 'road':
        // Estrada em perspectiva
        return (
          <svg viewBox="0 0 24 24" className={styles.iconSvg} aria-hidden="true">
            <path
              d="M4 22 L9 2 L11 2 L7 22 Z M17 22 L13 2 L15 2 L20 22 Z M11.5 6 H12.5 V9 H11.5 Z M11.5 13 H12.5 V17 H11.5 Z"
              fill="currentColor"
            />
          </svg>
        );
      case 'light':
        // Lâmpada
        return (
          <svg viewBox="0 0 24 24" className={styles.iconSvg} aria-hidden="true">
            <path
              d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm-3 18v1c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9z"
              fill="currentColor"
            />
          </svg>
        );
      case 'plant':
        // Planta dentro de círculo
        return (
          <svg viewBox="0 0 24 24" className={styles.iconSvg} aria-hidden="true">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
            <path
              d="M12 18 V11 M12 11 Q 8 8 7 12 Q 10 14 12 11 M12 13 Q 16 10 17 14 Q 14 16 12 13"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        );
      case 'other':
      default:
        // Reticências (...)
        return (
          <div className={styles.ellipsis} aria-hidden="true">
            <span>•</span>
            <span>•</span>
            <span>•</span>
          </div>
        );
    }
  };

  return (
    <div
      role="radio"
      aria-checked={isSelected}
      tabIndex={tabIndex}
      onClick={() => onSelect(id)}
      onKeyDown={onKeyDown}
      className={`${styles.tile} ${isSelected ? styles.selected : ''}`}
    >
      {isSelected && (
        <span className={styles.checkBadge} aria-hidden="true">
          ✓
        </span>
      )}
      <div className={styles.iconContainer}>{renderIcon()}</div>
      <span className={`${styles.label} ${isOther ? styles.otherLabel : ''}`}>
        {label}
      </span>
    </div>
  );
}
