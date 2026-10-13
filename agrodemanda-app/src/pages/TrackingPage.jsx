import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader/AppHeader';
import { useAuth } from '../context/AuthContext';
import { getDemandsByUser, getDemandById } from '../services/demandService';
import { categories } from '../data/categories';
import styles from './TrackingPage.module.css';

/**
 * Componente de Card Individual de Solicitação
 */
function DemandCard({ demand }) {
  const category = categories.find((c) => c.id === demand.category)?.label || demand.category;
  const dateFormatted = new Date(demand.createdAt).toLocaleDateString('pt-BR');

  // Cores de status amigáveis
  const statusClasses = {
    concluida: styles.statusDone,
    em_atendimento: styles.statusProgress,
    aberta: styles.statusOpen,
  };

  const statusLabels = {
    concluida: 'Concluída',
    em_atendimento: 'Em atendimento',
    aberta: 'Em análise',
  };

  return (
    <div className={styles.demandCard}>
      <div className={styles.cardHeader}>
        <div className={styles.protocolBadge}>{demand.id}</div>
        <span className={`${styles.statusBadge} ${statusClasses[demand.status] || styles.statusOpen}`}>
          {statusLabels[demand.status] || 'Em análise'}
        </span>
      </div>

      <h3 className={styles.cardCategory}>{category}</h3>
      <p className={styles.cardDesc}>{demand.description}</p>

      <div className={styles.cardMeta}>
        <span>📍 {demand.location?.community || 'Zona Rural'}</span>
        {demand.location?.reference && <span>• Ref: {demand.location.reference}</span>}
        <span>• {dateFormatted}</span>
      </div>
    </div>
  );
}

/**
 * Tela de Acompanhamento — Lista pedidos do usuário e permite busca por protocolo
 */
export default function TrackingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [demands, setDemands] = useState([]);
  const [searchCode, setSearchCode] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(true);

  // Carrega as solicitações do usuário logado
  useEffect(() => {
    async function fetchDemands() {
      if (user?.id) {
        const list = await getDemandsByUser(user.id);
        setDemands(list);
      }
      setLoading(false);
    }
    fetchDemands();
  }, [user]);

  // Busca rápida por código de protocolo
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchCode.trim()) {
      setHasSearched(false);
      setSearchResult(null);
      return;
    }

    setHasSearched(true);
    const found = await getDemandById(searchCode.trim());
    setSearchResult(found);
  };

  return (
    <div className={styles.page}>
      <AppHeader />

      <main className={styles.mainContent}>
        <div className={styles.headerGroup}>
          <span className={styles.tag}>CONSULTA & HISTÓRICO</span>
          <h1 className={styles.title}>Acompanhar solicitações</h1>
          <p className={styles.subtitle}>
            Acompanhe os pedidos da sua conta (<strong>{user?.username || 'Produtor'}</strong>) ou consulte por protocolo.
          </p>
        </div>

        {/* Busca por protocolo */}
        <form onSubmit={handleSearch} className={styles.searchBar}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Digite o código do protocolo (ex: AGR-2026-0184)"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
          />
          <button type="submit" className={styles.searchButton}>🔍 Buscar</button>
          {hasSearched && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={() => {
                setSearchCode('');
                setHasSearched(false);
              }}
            >
              Limpar busca
            </button>
          )}
        </form>

        {/* Resultado de Busca ou Lista de Pedidos */}
        <div className={styles.sectionBlock}>
          <h2 className={styles.sectionTitle}>
            {hasSearched ? 'Resultado da busca' : 'Suas solicitações registradas'}
          </h2>

          {loading ? (
            <p className={styles.loadingText}>Carregando...</p>
          ) : hasSearched ? (
            searchResult ? (
              <DemandCard demand={searchResult} />
            ) : (
              <p className={styles.emptyText}>Nenhuma solicitação encontrada com esse código.</p>
            )
          ) : demands.length > 0 ? (
            <div className={styles.demandsList}>
              {demands.map((d) => (
                <DemandCard key={d.id} demand={d} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyContainer}>
              <div className={styles.emptyIcon}>📋</div>
              <h3 className={styles.emptyTitle}>Nenhuma solicitação encontrada</h3>
              <p className={styles.emptySubtitle}>Você ainda não enviou pedidos com esta conta.</p>
              <button
                type="button"
                className={styles.newDemandBtn}
                onClick={() => navigate('/solicitacao')}
              >
                + Fazer uma solicitação
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
