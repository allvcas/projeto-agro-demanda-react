import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader/AppHeader';
import { useDemandDraft } from '../context/DemandDraftContext';
import styles from './DemandStep1Page.module.css';

// 6 Serviços disponíveis no município
const SERVICES = [
  { id: 'agua', title: 'Abastecimento de água', icon: '💧' },
  { id: 'estrada', title: 'Estradas rurais', icon: '🛣️' },
  { id: 'solo', title: 'Preparo do solo', icon: '🚜' },
  { id: 'plantio', title: 'Sementes e plantio', icon: '🌱' },
  { id: 'iluminacao', title: 'Iluminação pública', icon: '💡' },
  { id: 'outro', title: 'Outro assunto', icon: '💬' },
];

/**
 * Passo 1 da Solicitação — "Do que você precisa?"
 * O cidadão seleciona o serviço rural e digita o que está acontecendo.
 */
export default function DemandStep1Page() {
  const navigate = useNavigate();
  const { draft, setCategory, setDescription } = useDemandDraft();

  // Estados: serviço selecionado e texto digitado
  const [selectedService, setSelectedService] = useState(draft.category || 'agua');
  const [description, setDesc] = useState(draft.description || '');
  const [error, setError] = useState('');

  // Salva no rascunho e avança para a localização (Passo 2)
  const handleContinue = (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Por favor, descreva brevemente a necessidade.');
      return;
    }

    setCategory(selectedService);
    setDescription(description);
    navigate('/solicitacao/localizacao');
  };

  return (
    <div className={styles.page}>
      <AppHeader />

      <main className={styles.mainContent}>
        {/* Botão voltar */}
        <button type="button" className={styles.backLink} onClick={() => navigate('/inicio')}>
          ← Voltar
        </button>

        {/* Cabeçalho do Passo */}
        <div className={styles.headerGroup}>
          <span className={styles.tag}>NOVA SOLICITAÇÃO</span>
          <h1 className={styles.title}>Do que você precisa?</h1>
          <p className={styles.subtitle}>
            Escolha um assunto e conte brevemente o que está acontecendo.
          </p>
        </div>

        {/* Indicador de progresso (Passo 1 ativo) */}
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

        {/* Formulário */}
        <form onSubmit={handleContinue} className={styles.formCard}>
          <h2 className={styles.sectionLabel}>Selecione o tipo de serviço</h2>

          {/* Grid com os 6 cards de serviços */}
          <div className={styles.servicesGrid}>
            {SERVICES.map((s) => {
              const isSelected = selectedService === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  className={`${styles.serviceTile} ${isSelected ? styles.serviceTileSelected : ''}`}
                  onClick={() => {
                    setSelectedService(s.id);
                    setError('');
                  }}
                >
                  <div className={styles.tileLeft}>
                    <span style={{ fontSize: '18px' }}>{s.icon}</span>
                    <span className={styles.serviceName}>{s.title}</span>
                  </div>
                  {isSelected && <span className={styles.checkIcon}>✓</span>}
                </button>
              );
            })}
          </div>

          {/* Campo de Descrição */}
          <div className={styles.descContainer}>
            <label htmlFor="necessidade" className={styles.sectionLabel}>
              Descreva a necessidade
            </label>
            <textarea
              id="necessidade"
              className={styles.textarea}
              rows={4}
              placeholder="Exemplo: a estrada está com muitos buracos e dificulta a passagem."
              value={description}
              onChange={(e) => {
                setDesc(e.target.value);
                setError('');
              }}
            />
            <span className={styles.helperText}>
              Não precisa usar palavras difíceis. Conte do seu jeito.
            </span>
          </div>

          {error && <p className={styles.errorText}>{error}</p>}

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
