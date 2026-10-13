import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader/AppHeader';
import styles from './DemandSuccessPage.module.css';

/**
 * Tela de Sucesso — Confirmação do recebimento da solicitação.
 * Exibe o número de protocolo (ex: AGR-2026-0184) para o produtor rural acompanhar.
 */
export default function DemandSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Recupera o protocolo gerado passado via navegação (ou fallback para demonstração)
  const protocol = location.state?.protocol || 'AGR-2026-0184';

  return (
    <div className={styles.page}>
      <AppHeader />

      <main className={styles.mainContent}>
        <div className={styles.successCard}>
          {/* Círculo com checkmark verde */}
          <div className={styles.iconCircle}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.checkSvg}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <span className={styles.tag}>SOLICITAÇÃO ENVIADA</span>

          <h1 className={styles.title}>Seu pedido foi recebido!</h1>

          <p className={styles.subtitle}>
            A Secretaria irá analisar sua solicitação e organizar o atendimento.
          </p>

          {/* Caixa tracejada do número do protocolo */}
          <div className={styles.protocolBox}>
            <span className={styles.protocolLabel}>Guarde este número de protocolo</span>
            <div className={styles.protocolCode}>{protocol}</div>
          </div>

          <p className={styles.helperText}>
            Tire uma foto ou anote esse número para acompanhar depois.
          </p>

          {/* Botões de Ação */}
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => navigate('/inicio')}
            >
              Voltar ao início
            </button>

            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => navigate('/acompanhar')}
            >
              Acompanhar pedido
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
