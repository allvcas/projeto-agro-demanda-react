import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader/AppHeader';
import { useDemandDraft } from '../context/DemandDraftContext';
import styles from './DemandStep1Page.module.css';

/**
 * Passo 1 da Solicitação — "Do que você precisa?"
 * O usuário escolhe o tipo de serviço e escreve uma descrição simples do problema.
 */
export default function DemandStep1Page() {
  const navigate = useNavigate();
  const { draft, setCategory, setDescription } = useDemandDraft();

  // Estados locais para controlar seleção e erros de validação
  const [selectedService, setSelectedService] = useState(draft.category || 'agua');
  const [problemDescription, setProblemDescription] = useState(draft.description || '');
  const [errorMessage, setErrorMessage] = useState('');

  // Lista dos 6 serviços disponíveis no município
  const services = [
    {
      id: 'agua',
      title: 'Abastecimento de água',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.serviceIcon}>
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      ),
    },
    {
      id: 'estrada',
      title: 'Estradas rurais',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.serviceIcon}>
          <path d="M4 19L8 5M20 19L16 5M12 5V8M12 12V14M12 18V21" />
        </svg>
      ),
    },
    {
      id: 'solo',
      title: 'Preparo do solo',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.serviceIcon}>
          <circle cx="7" cy="17" r="3" />
          <circle cx="17" cy="15" r="4" />
          <path d="M7 14h5l3-4h4" />
          <path d="M10 10V6" />
        </svg>
      ),
    },
    {
      id: 'plantio',
      title: 'Sementes e plantio',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.serviceIcon}>
          <path d="M12 22v-9" />
          <path d="M12 13a5 5 0 0 0-5-5 5 5 0 0 1 5-5 5 5 0 0 1 5 5 5 5 0 0 0-5 5z" />
        </svg>
      ),
    },
    {
      id: 'iluminacao',
      title: 'Iluminação pública',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.serviceIcon}>
          <path d="M9 18h6M10 22h4" />
          <path d="M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6h8c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7z" />
        </svg>
      ),
    },
    {
      id: 'outro',
      title: 'Outro assunto',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.serviceIcon}>
          <circle cx="5" cy="12" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="19" cy="12" r="1.5" />
        </svg>
      ),
    },
  ];

  // Salva no contexto de rascunho e avança para a etapa de localização
  const handleContinue = (e) => {
    e.preventDefault();

    if (!selectedService) {
      setErrorMessage('Por favor, selecione um serviço.');
      return;
    }

    if (!problemDescription.trim()) {
      setErrorMessage('Por favor, descreva brevemente a necessidade.');
      return;
    }

    // Salva o rascunho para não perder os dados
    setCategory(selectedService);
    setDescription(problemDescription);

    // Navega para o Passo 2: Localização
    navigate('/solicitacao/localizacao');
  };

  return (
    <div className={styles.page}>
      <AppHeader />

      <main className={styles.mainContent}>
        {/* Botão de voltar para a tela inicial */}
        <button
          type="button"
          className={styles.backLink}
          onClick={() => navigate('/inicio')}
        >
          ← Voltar
        </button>

        {/* Título e descrição do passo */}
        <div className={styles.headerGroup}>
          <span className={styles.tag}>NOVA SOLICITAÇÃO</span>
          <h1 className={styles.title}>Do que você precisa?</h1>
          <p className={styles.subtitle}>
            Escolha um assunto e conte brevemente o que está acontecendo.
          </p>
        </div>

        {/* Indicador de progresso (Stepper) */}
        <div className={styles.stepperContainer}>
          <div className={`${styles.stepItem} ${styles.stepActive}`}>
            <span className={styles.stepLabel}>1. Pedido</span>
            <div className={styles.stepLineActive}></div>
          </div>
          <div className={styles.stepItem}>
            <span className={styles.stepLabelMuted}>2. Localização</span>
            <div className={styles.stepLineInactive}></div>
          </div>
        </div>

        {/* Card do formulário */}
        <form onSubmit={handleContinue} className={styles.formCard}>
          <h2 className={styles.sectionLabel}>Selecione o tipo de serviço</h2>

          {/* Grid de botões com os 6 serviços */}
          <div className={styles.servicesGrid}>
            {services.map((service) => {
              const isSelected = selectedService === service.id;
              return (
                <button
                  key={service.id}
                  type="button"
                  className={`${styles.serviceTile} ${isSelected ? styles.serviceTileSelected : ''}`}
                  onClick={() => {
                    setSelectedService(service.id);
                    setErrorMessage('');
                  }}
                >
                  <div className={styles.tileLeft}>
                    {service.icon}
                    <span className={styles.serviceName}>{service.title}</span>
                  </div>

                  {/* Ícone de check quando selecionado */}
                  {isSelected && (
                    <span className={styles.checkIcon} aria-hidden="true">✓</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Campo de descrição */}
          <div className={styles.descContainer}>
            <label htmlFor="necessidade" className={styles.sectionLabel}>
              Descreva a necessidade
            </label>
            <textarea
              id="necessidade"
              className={styles.textarea}
              rows={4}
              value={problemDescription}
              onChange={(e) => {
                setProblemDescription(e.target.value);
                setErrorMessage('');
              }}
              placeholder="Exemplo: a estrada está com muitos buracos e dificulta a passagem."
            />
            <span className={styles.helperText}>
              Não precisa usar palavras difíceis. Conte do seu jeito.
            </span>
          </div>

          {/* Mensagem de validação se houver */}
          {errorMessage && (
            <p className={styles.errorText}>{errorMessage}</p>
          )}

          {/* Botão de avançar para a localização */}
          <div className={styles.footerActions}>
            <button type="submit" className={styles.continueButton}>
              Continuar &gt;
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
