import React, { useState } from 'react';
import styles from './AppHeader.module.css';
import MenuDrawer from '../MenuDrawer/MenuDrawer';

export default function AppHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.leftGroup}>
          {/* Emblem: Circular with sky and green hill */}
          <div className={styles.emblem} aria-hidden="true">
            <svg viewBox="0 0 40 40" className={styles.emblemSvg}>
              <circle cx="20" cy="20" r="20" fill="#4ea8de" />
              {/* Sun / clouds */}
              <circle cx="28" cy="14" r="5" fill="#fefae0" />
              {/* Green hill */}
              <path
                d="M -2 34 Q 14 18 42 28 L 42 42 L -2 42 Z"
                fill="#2d6a4f"
              />
              <path
                d="M -2 40 Q 18 24 42 34 L 42 42 L -2 42 Z"
                fill="#52b788"
              />
            </svg>
          </div>
          <div className={styles.titleGroup}>
            <h1 className={styles.title}>DEMANDAS RURAIS</h1>
            <p className={styles.slogan}>Facilitando melhorias para comunidade</p>
          </div>
        </div>

        <button
          type="button"
          className={styles.menuButton}
          onClick={() => setIsMenuOpen(true)}
          aria-label="Abrir menu"
        >
          <span className={styles.menuIcon} aria-hidden="true">☰</span>
        </button>
      </header>

      <MenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
