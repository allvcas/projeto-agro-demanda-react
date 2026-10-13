import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader/AppHeader';
import { useDemandDraft } from '../context/DemandDraftContext';
import { useAuth } from '../context/AuthContext';
import { submitDemand } from '../services/demandService';
import { categories } from '../data/categories';
import { maskCep, maskPhone } from '../utils/masks';
import styles from './DemandStep2Page.module.css';

// Lista das comunidades rurais do município
const RURAL_COMMUNITIES = [
  'Magana',
  'Poço Fundo',
  'Pará',
  'Cacimba de Baixo',
  'Barra da Cruz',
  'Carrapicho',
  'Lagoa do Barbosa',
  'Serra da Cachoeira',
  'Bandeira',
  'Outra comunidade rural...',
];

/**
 * Passo 2 da Solicitação — "Onde o serviço é necessário?"
 * Coleta os dados de localização e contato do produtor, vinculando o pedido à conta logada.
 */
export default function DemandStep2Page() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { draft, setLocation, resetDraft } = useDemandDraft();

  // Identifica o nome do serviço escolhido no Passo 1
  const categoryId = draft.category || 'agua';
  const categoryObj = categories.find((c) => c.id === categoryId);
  const categoryLabel = categoryObj ? categoryObj.label : 'Abastecimento de água';

  // 1. Estado único com os dados do formulário
  const [form, setForm] = useState({
    community: draft.location?.community || '',
    cep: draft.location?.cep || '',
    reference: draft.location?.reference || '',
    name: draft.location?.name || user?.username || '',
    phone: draft.location?.phone || '',
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Função auxiliar para atualizar qualquer campo do formulário
  const updateField = (field, val) => {
    setForm((prev) => ({ ...prev, [field]: val }));
    setErrorMsg('');
  };

  // Botão Voltar: salva o rascunho e retorna ao Passo 1 sem perder o que digitou
  const handleBack = () => {
    setLocation(form);
    navigate('/solicitacao');
  };

  // Envio final da solicitação
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.community) {
      setErrorMsg('Por favor, selecione a comunidade ou bairro.');
      return;
    }
    if (!form.reference.trim()) {
      setErrorMsg('Por favor, informe um ponto de referência.');
      return;
    }
    if (!form.name.trim()) {
      setErrorMsg('Por favor, digite seu nome.');
      return;
    }

    setSubmitting(true);
    try {
      // Envia a solicitação vinculada ao usuário da sessão
      const result = await submitDemand({
        userId: user?.id,
        userName: form.name.trim(),
        userPhone: form.phone.trim(),
        userEmail: user?.email,
        category: categoryId,
        description: draft.description || 'Sem descrição informada.',
        location: {
          community: form.community,
          cep: form.cep,
          reference: form.reference.trim(),
        },
      });

      // Limpa o rascunho e vai para a tela de Sucesso
      resetDraft();
      navigate('/solicitacao/sucesso', {
        state: { protocol: result.id },
      });
    } catch (err) {
      setErrorMsg('Erro ao registrar a solicitação. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <AppHeader />

      <main className={styles.mainContent}>
        {/* Botão Voltar */}
        <button type="button" className={styles.backLink} onClick={handleBack}>
          ← Voltar
        </button>

        {/* Cabeçalho */}
        <div className={styles.headerGroup}>
          <span className={styles.tag}>NOVA SOLICITAÇÃO</span>
          <h1 className={styles.title}>Onde o serviço é necessário?</h1>
          <p className={styles.subtitle}>
            Informe os dados do local para ajudar a equipe a chegar até você.
          </p>
        </div>

        {/* Stepper com ambas as etapas ativas */}
        <div className={styles.stepperContainer}>
          <div className={`${styles.stepItem} ${styles.stepActive}`}>
            <span className={styles.stepLabel}>1. Pedido</span>
            <div className={styles.stepLineActive}></div>
          </div>
          <div className={`${styles.stepItem} ${styles.stepActive}`}>
            <span className={styles.stepLabel}>2. Localização</span>
            <div className={styles.stepLineActive}></div>
          </div>
        </div>

        {/* Formulário de Localização e Contato */}
        <form onSubmit={handleSubmit} className={styles.formCard}>
          {/* Comunidade e CEP */}
          <div className={styles.formRow}>
            <div className={styles.formCol}>
              <label htmlFor="comunidade" className={styles.fieldLabel}>
                Comunidade ou bairro
              </label>
              <select
                id="comunidade"
                className={styles.selectInput}
                value={form.community}
                onChange={(e) => updateField('community', e.target.value)}
              >
                <option value="">Selecione a comunidade</option>
                {RURAL_COMMUNITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className={styles.formColSmall}>
              <label htmlFor="cep" className={styles.fieldLabel}>
                CEP <span className={styles.optional}>(se souber)</span>
              </label>
              <input
                id="cep"
                type="tel"
                className={styles.textInput}
                placeholder="00000-000"
                value={form.cep}
                maxLength={9}
                onChange={(e) => updateField('cep', maskCep(e.target.value))}
              />
            </div>
          </div>

          {/* Ponto de Referência */}
          <div className={styles.fieldGroup}>
            <label htmlFor="referencia" className={styles.fieldLabel}>Ponto de referência</label>
            <input
              id="referencia"
              type="text"
              className={styles.textInput}
              placeholder="Exemplo: depois da igreja, ao lado do açude"
              value={form.reference}
              onChange={(e) => updateField('reference', e.target.value)}
            />
            <span className={styles.helperText}>
              Informe algo conhecido que ajude a equipe a encontrar o local.
            </span>
          </div>

          {/* Seu Nome */}
          <div className={styles.fieldGroup}>
            <label htmlFor="nome" className={styles.fieldLabel}>Seu nome</label>
            <input
              id="nome"
              type="text"
              className={styles.textInput}
              placeholder="Digite seu nome completo"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
            />
          </div>

          {/* Telefone */}
          <div className={styles.fieldGroup}>
            <label htmlFor="telefone" className={styles.fieldLabel}>Telefone para contato</label>
            <input
              id="telefone"
              type="tel"
              className={styles.textInput}
              placeholder="(81) 99999-9999"
              value={form.phone}
              maxLength={15}
              onChange={(e) => updateField('phone', maskPhone(e.target.value))}
            />
          </div>

          {/* Resumo verde do serviço */}
          <div className={styles.serviceSummaryBar}>
            <span className={styles.summaryCheck}>✓</span>
            <span className={styles.summaryText}>
              Serviço solicitado: <strong>{categoryLabel}</strong>
            </span>
          </div>

          {errorMsg && <p className={styles.errorText}>{errorMsg}</p>}

          {/* Botões do Rodapé */}
          <div className={styles.footerActions}>
            <button type="button" className={styles.backButton} onClick={handleBack}>
              Voltar
            </button>
            <button type="submit" className={styles.submitButton} disabled={submitting}>
              {submitting ? 'Enviando...' : 'Enviar solicitação'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
