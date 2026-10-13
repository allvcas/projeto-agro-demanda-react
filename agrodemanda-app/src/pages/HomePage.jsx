import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader/AppHeader';
import styles from './HomePage.module.css';

/**
 * Tela Inicial (Início) — Exibida logo após o usuário fazer login.
 * Apresenta o objetivo do sistema e orienta o produtor rural em 3 passos simples.
 */
export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <AppHeader />

      <main className={styles.mainContent}>
        {/* Seção Principal (Hero) */}
        <section className={styles.heroSection}>
          <div className={styles.heroLeft}>
            <span className={styles.tag}>ATENDIMENTO RURAL DO MUNICÍPIO</span>
            
            <h1 className={styles.heroTitle}>
              A demanda da comunidade na palma da mão.
            </h1>
            
            <p className={styles.heroSubtitle}>
              Solicite apoio para sua propriedade ou comunidade sem precisar se deslocar até a cidade.
            </p>

            <div className={styles.heroButtons}>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={() => navigate('/solicitacao')}
              >
                <span className={styles.buttonIcon}>+</span>
                Fazer uma solicitação
              </button>

              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => navigate('/acompanhar')}
              >
                <span className={styles.searchIcon}>🔍</span>
                Acompanhar pedido
              </button>
            </div>
          </div>

          {/* Card em destaque na direita */}
          <div className={styles.heroRight}>
            <div className={styles.featuredCard}>
              <div className={styles.cardIcon}>
                <svg viewBox="0 0 24 24" fill="none" className={styles.sproutSvg}>
                  <path
                    d="M12 21V12M12 12C12 8.5 9 6 5.5 6C5.5 9.5 8 12 12 12ZM12 12C12 7.5 15.5 5 19.5 5C19.5 9 16 12 12 12Z"
                    stroke="#A8D5BA"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h2 className={styles.featuredCardTitle}>
                Atendimento mais perto de você
              </h2>

              <p className={styles.featuredCardText}>
                Informe o que a sua comunidade precisa. A Secretaria recebe, organiza e encaminha o serviço.
              </p>
            </div>
          </div>
        </section>

        {/* Seção "Como Funciona" com 3 passos simples */}
        <section className={styles.howItWorksSection}>
          <span className={styles.sectionTag}>COMO FUNCIONA</span>
          <h2 className={styles.sectionTitle}>Resolva em três passos simples</h2>

          <div className={styles.stepsGrid}>
            {/* Passo 1 */}
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepInfo}>
                <h3 className={styles.stepTitle}>Escolha o assunto</h3>
                <p className={styles.stepDesc}>
                  Indique se precisa de água, estrada, preparo do solo ou outro serviço.
                </p>
              </div>
            </div>

            {/* Passo 2 */}
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepInfo}>
                <h3 className={styles.stepTitle}>Informe o local</h3>
                <p className={styles.stepDesc}>
                  Digite a comunidade e um ponto de referência fácil de encontrar.
                </p>
              </div>
            </div>

            {/* Passo 3 */}
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepInfo}>
                <h3 className={styles.stepTitle}>Guarde o protocolo</h3>
                <p className={styles.stepDesc}>
                  Use o número recebido para acompanhar o andamento do pedido.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
