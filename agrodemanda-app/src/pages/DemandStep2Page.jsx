import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader/AppHeader';
import { useDemandDraft } from '../context/DemandDraftContext';
import { useAuth } from '../context/AuthContext';
import { submitDemand } from '../services/demandService';
import { categories } from '../data/categories';
import { maskCep, maskPhone } from '../utils/masks';
import styles from './DemandStep2Page.module.css';

/**
 * Passo 2 da Solicitação — "Onde o serviço é necessário?"
 * Coleta os dados de localização e contato do produtor, vinculando o pedido à conta logada.
 */
export default function DemandStep2Page() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { draft, setLocation, resetDraft } = useDemandDraft();

  // Se o usuário tentar acessar a localização sem ter escolhido o serviço no passo 1,
  // voltamos para o passo 1
  const categoryId = draft.category || 'agua';
  const categoryObj = categories.find((c) => c.id === categoryId);
  const categoryLabel = categoryObj ? categoryObj.label : 'Abastecimento de água';

  // Estados dos campos de localização e contato
  const [community, setCommunity] = useState(draft.location?.community || '');
  const [cep, setCep] = useState(draft.location?.cep || '');
  const [reference, setReference] = useState(draft.location?.reference || '');
  const [fullName, setFullName] = useState(draft.location?.name || user?.username || '');
  const [phone, setPhone] = useState(draft.location?.phone || '');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Lista de comunidades rurais de Santa Cruz do Capibaribe
  const ruralCommunities = [
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

  // Voltar para o Passo 1 preservando o que já foi digitado
  const handleBack = () => {
    setLocation({
      community,
      cep,
      reference,
      name: fullName,
      phone,
    });
    navigate('/solicitacao');
  };

  // Envio final da solicitação
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!community) {
      setErrorMsg('Por favor, selecione a comunidade ou bairro.');
      return;
    }

    if (!reference.trim()) {
      setErrorMsg('Por favor, informe um ponto de referência.');
      return;
    }

    if (!fullName.trim()) {
      setErrorMsg('Por favor, digite seu nome.');
      return;
    }

    setErrorMsg('');
    setSubmitting(true);

    try {
      // Envia a demanda ligada ao id e dados da conta do usuário logado
      const result = await submitDemand({
        userId: user?.id,
        userName: fullName.trim(),
        userPhone: phone.trim(),
        userEmail: user?.email,
        category: categoryId,
        description: draft.description || 'Sem descrição informada.',
        location: {
          community,
          cep,
          reference: reference.trim(),
        },
      });

      // Limpa o rascunho
      resetDraft();

      // Redireciona para a tela de Sucesso com o protocolo recebido
      navigate('/solicitacao/sucesso', {
        state: {
          protocol: result.id,
          serviceName: categoryLabel,
        },
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
        {/* Botão de voltar */}
        <button
          type="button"
          className={styles.backLink}
          onClick={handleBack}
        >
          ← Voltar
        </button>

        {/* Título do passo */}
        <div className={styles.headerGroup}>
          <span className={styles.tag}>NOVA SOLICITAÇÃO</span>
          <h1 className={styles.title}>Onde o serviço é necessário?</h1>
          <p className={styles.subtitle}>
            Informe os dados do local para ajudar a equipe a chegar até você.
          </p>
        </div>

        {/* Stepper com as duas etapas concluídas/ativas */}
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

        {/* Card do formulário */}
        <form onSubmit={handleSubmit} className={styles.formCard}>
          {/* Linha com Comunidade e CEP */}
          <div className={styles.formRow}>
            <div className={styles.formCol}>
              <label htmlFor="comunidade" className={styles.fieldLabel}>
                Comunidade ou bairro
              </label>
              <select
                id="comunidade"
                className={styles.selectInput}
                value={community}
                onChange={(e) => {
                  setCommunity(e.target.value);
                  setErrorMsg('');
                }}
              >
                <option value="">Selecione a comunidade</option>
                {ruralCommunities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
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
                value={cep}
                maxLength={9}
                onChange={(e) => setCep(maskCep(e.target.value))}
              />
            </div>
          </div>

          {/* Ponto de Referência */}
          <div className={styles.fieldGroup}>
            <label htmlFor="referencia" className={styles.fieldLabel}>
              Ponto de referência
            </label>
            <input
              id="referencia"
              type="text"
              className={styles.textInput}
              placeholder="Exemplo: depois da igreja, ao lado do açude"
              value={reference}
              onChange={(e) => {
                setReference(e.target.value);
                setErrorMsg('');
              }}
            />
            <span className={styles.helperText}>
              Informe algo conhecido que ajude a equipe a encontrar o local.
            </span>
          </div>

          {/* Seu Nome */}
          <div className={styles.fieldGroup}>
            <label htmlFor="nome" className={styles.fieldLabel}>
              Seu nome
            </label>
            <input
              id="nome"
              type="text"
              className={styles.textInput}
              placeholder="Digite seu nome completo"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setErrorMsg('');
              }}
            />
          </div>

          {/* Telefone */}
          <div className={styles.fieldGroup}>
            <label htmlFor="telefone" className={styles.fieldLabel}>
              Telefone para contato
            </label>
            <input
              id="telefone"
              type="tel"
              className={styles.textInput}
              placeholder="(81) 99999-9999"
              value={phone}
              maxLength={15}
              onChange={(e) => setPhone(maskPhone(e.target.value))}
            />
          </div>

          {/* Resumo verde do serviço solicitado */}
          <div className={styles.serviceSummaryBar}>
            <span className={styles.summaryCheck}>✓</span>
            <span className={styles.summaryText}>
              Serviço solicitado: <strong>{categoryLabel}</strong>
            </span>
          </div>

          {/* Mensagem de erro de validação */}
          {errorMsg && (
            <p className={styles.errorText}>{errorMsg}</p>
          )}

          {/* Botões de navegação */}
          <div className={styles.footerActions}>
            <button
              type="button"
              className={styles.backButton}
              onClick={handleBack}
            >
              Voltar
            </button>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={submitting}
            >
              {submitting ? 'Enviando...' : 'Enviar solicitação'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
