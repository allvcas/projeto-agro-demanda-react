import React, { useEffect, useRef } from 'react';
import styles from './MenuDrawer.module.css';
import { useAuth } from '../../context/AuthContext';
import { useDemandDraft } from '../../context/DemandDraftContext';
import { useNavigate } from 'react-router-dom';

export default function MenuDrawer({ isOpen, onClose }) {
  const { logout, user } = useAuth();
  const { resetDraft } = useDemandDraft();
  const navigate = useNavigate();
  const drawerRef = useRef(null);

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

  const handleNewDemand = () => {
    resetDraft();
    navigate('/demanda');
    onClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose();
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.drawer}
        ref={drawerRef}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Menu principal"
      >
        <div className={styles.header}>
          <span className={styles.userGreeting}>
            Olá, <strong>{user?.username || 'Produtor'}</strong>
          </span>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Fechar menu"
          >
            ✕
          </button>
        </div>

        <nav className={styles.nav}>
          <button
            type="button"
            className={styles.menuItem}
            onClick={handleNewDemand}
          >
            <span>📝</span> Nova Demanda
          </button>
          {/* Admin panel option only visible to administrator (username: admin) */}
          {(user?.role === 'admin' || user?.username === 'admin') && (
            <button
              type="button"
              className={styles.menuItem}
              onClick={() => {
                navigate('/admin');
                onClose();
              }}
            >
              <span>📊</span> Painel do Administrador
            </button>
          )}
          <button
            type="button"
            className={`${styles.menuItem} ${styles.logoutItem}`}
            onClick={handleLogout}
          >
            <span>🚪</span> Sair
          </button>
        </nav>
      </div>
    </div>
  );
}
