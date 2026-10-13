import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import styles from './AppHeader.module.css';
import MenuDrawer from '../MenuDrawer/MenuDrawer';
import { useAuth } from '../../context/AuthContext';

export default function AppHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className={styles.header}>
        {/* Logo AgroDemanda */}
        <Link to="/inicio" className={styles.logoLink}>
          <div className={styles.emblem} aria-hidden="true">
            <svg viewBox="0 0 40 40" className={styles.emblemSvg} fill="none">
              <circle cx="20" cy="20" r="19" fill="#153E25" />
              {/* Sprout / Folhinha */}
              <path
                d="M19 28V18M19 18C19 14.5 16 12 12.5 12C12.5 15.5 15 18 19 18ZM19 18C19 13.5 22.5 11 26.5 11C26.5 15 23 18 19 18Z"
                stroke="#A8D5BA"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className={styles.titleGroup}>
            <span className={styles.title}>AgroDemanda</span>
            <span className={styles.slogan}>Santa Cruz do Capibaribe</span>
          </div>
        </Link>

        {/* Links de navegação do topo */}
        <nav className={styles.navLinks}>
          <NavLink
            to="/inicio"
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem
            }
          >
            Início
          </NavLink>

          <NavLink
            to="/solicitacao"
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem
            }
          >
            Nova solicitação
          </NavLink>

          <NavLink
            to="/acompanhar"
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem
            }
          >
            Acompanhar
          </NavLink>

          {/* Admin link se aplicável */}
          {(user?.role === 'admin' || user?.username === 'admin') && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem
              }
            >
              Painel Admin
            </NavLink>
          )}

          {/* Botão Sair sutil */}
          <button
            type="button"
            onClick={handleLogout}
            className={styles.logoutButton}
            title="Sair da conta"
          >
            Sair
          </button>
        </nav>

        {/* Botão do menu para mobile */}
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

