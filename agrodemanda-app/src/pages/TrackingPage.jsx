import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader/AppHeader';
import { useAuth } from '../context/AuthContext';
import { getDemandsByUser, getDemandById } from '../services/demandService';
import { categories } from '../data/categories';
import styles from './TrackingPage.module.css';

/**
 * Tela de Acompanhamento — Mostra todos os pedidos vinculados à conta do usuário logado
 * e permite consultar pelo código de protocolo.
 */
export default function TrackingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [userDemands, setUserDemands] = useState([]);
  const [searchCode, setSearchCode] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(true);

  // Carrega as demandas vinculadas à conta do usuário logado
  useEffect(() => {
    async function fetchDemands() {
      setLoading(true);
      try {
        if (user?.id) {
          const list = await getDemandsByUser(user.id);
          setUserDemands(list);
        }
      } catch (err) {
        console.error('Erro ao buscar demandas:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDemands();
  }, [user]);

  // Função para pesquisar por código de protocolo avulso
  const handleSearchProtocol = async (e) => {
    e.preventDefault();
    if (!searchCode.trim()) {
      setSearchResult(null);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const found = await getDemandById(searchCode.trim());
      setSearchResult(found);
    } finally {
      setLoading(false);
    }
  };

  // Helper para nome da categoria
  const getCategoryTitle = (catId) => {
    const found = categories.find((c) => c.id === catId);
    return found ? found.label : catId;
  };

  // Helper para formatar data amigável
  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return 'Data recente';
    }
  };

  // Helper para cor do status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'concluida':
        return <span className={`${styles.statusBadge} ${styles.statusDone}`}>Concluída</span>;
      case 'em_atendimento':
        return <span className={`${styles.statusBadge} ${styles.statusProgress}`}>Em atendimento</span>;
      default:
        return <span className={`${styles.statusBadge} ${styles.statusOpen}`}>Em análise</span>;
    }
  };

  return (
    <div className={styles.page}>
      <AppHeader />

      <main className={styles.mainContent}>
        {/* Cabeçalho da página */}
        <div className={styles.headerGroup}>
          <span className={styles.tag}>CONSULTA & HISTÓRICO</span>
          <h1 className={styles.title}>Acompanhar solicitações</h1>
          <p className={styles.subtitle}>
            Acompanhe o andamento dos pedidos vinculados à sua conta (<strong>{user?.username || 'Produtor'}</strong>) ou consulte pelo código de protocolo.
          </p>
        </div>

        {/* Barra de pesquisa rápida por protocolo */}
        <form onSubmit={handleSearchProtocol} className={styles.searchBar}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Digite o código do protocolo (ex: AGR-2026-0184)"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
          />
          <button type="submit" className={styles.searchButton}>
            🔍 Buscar
          </button>
          {hasSearched && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={() => {
                setSearchCode('');
                setSearchResult(null);
                setHasSearched(false);
              }}
            >
              Limpar busca
            </button>
          )}
        </form>

        {/* Exibição do resultado de busca pontual */}
        {hasSearched && (
          <div className={styles.sectionBlock}>
            <h2 className={styles.sectionTitle}>Resultado da busca</h2>
            {searchResult ? (
              <div className={styles.demandCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.protocolBadge}>{searchResult.id}</div>
                  {getStatusBadge(searchResult.status)}
                </div>

                <h3 className={styles.cardCategory}>
                  {getCategoryTitle(searchResult.category)}
                </h3>

                <p className={styles.cardDesc}>{searchResult.description}</p>

                <div className={styles.cardMeta}>
                  <span>📍 {searchResult.location?.community || searchResult.location?.neighborhood || 'Zona Rural'}</span>
                  {searchResult.location?.reference && (
                    <span>• Ref: {searchResult.location.reference}</span>
                  )}
                  <span>• {formatDate(searchResult.createdAt)}</span>
                </div>
              </div>
            ) : (
              <p className={styles.emptyText}>
                Nenhuma solicitação encontrada com o protocolo <strong>"{searchCode}"</strong>.
              </p>
            )}
          </div>
        )}

        {/* Lista das solicitações vinculadas à conta do usuário */}
        {!hasSearched && (
          <div className={styles.sectionBlock}>
            <h2 className={styles.sectionTitle}>Suas solicitações registradas</h2>

            {loading ? (
              <p className={styles.loadingText}>Carregando suas solicitações...</p>
            ) : userDemands.length > 0 ? (
              <div className={styles.demandsList}>
                {userDemands.map((demand) => (
                  <div key={demand.id} className={styles.demandCard}>
                    <div className={styles.cardHeader}>
                      <div className={styles.protocolBadge}>{demand.id}</div>
                      {getStatusBadge(demand.status)}
                    </div>

                    <h3 className={styles.cardCategory}>
                      {getCategoryTitle(demand.category)}
                    </h3>

                    <p className={styles.cardDesc}>{demand.description}</p>

                    <div className={styles.cardMeta}>
                      <span>📍 {demand.location?.community || demand.location?.neighborhood || 'Zona Rural'}</span>
                      {demand.location?.reference && (
                        <span>• Ref: {demand.location.reference}</span>
                      )}
                      <span>• Enviado em {formatDate(demand.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyContainer}>
                <div className={styles.emptyIcon}>📋</div>
                <h3 className={styles.emptyTitle}>Nenhuma solicitação encontrada</h3>
                <p className={styles.emptySubtitle}>
                  Você ainda não enviou pedidos com esta conta. Clique abaixo para fazer sua primeira solicitação.
                </p>
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
        )}
      </main>
    </div>
  );
}
