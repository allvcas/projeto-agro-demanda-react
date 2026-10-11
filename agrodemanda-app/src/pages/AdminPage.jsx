import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader/AppHeader';
import { getDemands, updateDemandStatus, deleteDemand } from '../services/demandService';
import { categories } from '../data/categories';
import styles from './AdminPage.module.css';

export default function AdminPage() {
  const navigate = useNavigate();
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todas');
  const [categoryFilter, setCategoryFilter] = useState('todas');
  const [statusUpdating, setStatusUpdating] = useState(null);

  // Delete modal state
  const [demandToDelete, setDemandToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getDemands();
        setDemands(data);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleStatusChange = async (demandId, newStatus) => {
    setStatusUpdating(demandId);
    try {
      const updated = await updateDemandStatus(demandId, newStatus);
      setDemands(updated);
    } finally {
      setStatusUpdating(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!demandToDelete) return;
    setIsDeleting(true);
    try {
      const updated = await deleteDemand(demandToDelete.id);
      setDemands(updated);
      setDemandToDelete(null);
      setToastMessage('Solicitação removida com sucesso!');
      setTimeout(() => setToastMessage(''), 3000);
    } finally {
      setIsDeleting(false);
    }
  };

  // Metrics
  const totalCount = demands.length;
  const openCount = demands.filter((d) => d.status === 'aberta').length;
  const inProgressCount = demands.filter((d) => d.status === 'em_atendimento').length;
  const completedCount = demands.filter((d) => d.status === 'concluida').length;

  // Filtered demands
  const filteredDemands = demands.filter((d) => {
    // Status filter
    if (statusFilter !== 'todas' && d.status !== statusFilter) {
      return false;
    }
    // Category filter
    if (categoryFilter !== 'todas' && d.category !== categoryFilter) {
      return false;
    }
    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchId = d.id?.toLowerCase().includes(q);
      const matchDesc = d.description?.toLowerCase().includes(q);
      const matchNeighborhood = d.location?.neighborhood?.toLowerCase().includes(q);
      const matchReference = d.location?.reference?.toLowerCase().includes(q);
      return matchId || matchDesc || matchNeighborhood || matchReference;
    }
    return true;
  });

  const getCategoryLabel = (catId) => {
    const found = categories.find((c) => c.id === catId);
    return found ? found.label : catId;
  };

  const getCategoryIcon = (catId) => {
    switch (catId) {
      case 'saude': return '➕';
      case 'agua': return '💧';
      case 'estrada': return '🛣️';
      case 'iluminacao': return '💡';
      case 'agricultura': return '🌱';
      default: return '📋';
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className={styles.adminPage}>
      <AppHeader />

      <main className={styles.mainContainer}>
        {toastMessage && (
          <div className={styles.toastAlert} role="status">
            <span>✓</span> {toastMessage}
          </div>
        )}

        <div className={styles.topBar}>
          <div className={styles.titleInfo}>
            <div className={styles.adminBadge}>PAINEL DA GESTÃO PÚBLICA</div>
            <h1 className={styles.pageTitle}>Solicitações Abertas da Comunidade</h1>
            <p className={styles.pageSubtitle}>
              Triagem, despacho técnico e gerenciamento para Santa Cruz do Capibaribe e distritos rurais
            </p>
          </div>
          <button
            type="button"
            className={styles.newDemandBtn}
            onClick={() => navigate('/demanda')}
          >
            + Nova Solicitação
          </button>
        </div>

        {/* Metrics Cards */}
        <section className={styles.metricsGrid}>
          <div className={`${styles.metricCard} ${styles.metricTotal}`}>
            <span className={styles.metricLabel}>Total de Solicitações</span>
            <span className={styles.metricValue}>{totalCount}</span>
          </div>
          <div className={`${styles.metricCard} ${styles.metricOpen}`}>
            <span className={styles.metricLabel}>Abertas / Pendentes</span>
            <span className={styles.metricValue}>{openCount}</span>
          </div>
          <div className={`${styles.metricCard} ${styles.metricProgress}`}>
            <span className={styles.metricLabel}>Em Atendimento</span>
            <span className={styles.metricValue}>{inProgressCount}</span>
          </div>
          <div className={`${styles.metricCard} ${styles.metricCompleted}`}>
            <span className={styles.metricLabel}>Concluídas</span>
            <span className={styles.metricValue}>{completedCount}</span>
          </div>
        </section>

        {/* Search & Filters */}
        <section className={styles.filterSection}>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon} aria-hidden="true">🔍</span>
            <input
              type="text"
              placeholder="Buscar por protocolo, comunidade, descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            {searchTerm && (
              <button
                type="button"
                className={styles.clearSearchBtn}
                onClick={() => setSearchTerm('')}
                aria-label="Limpar busca"
              >
                ✕
              </button>
            )}
          </div>

          <div className={styles.filterRow}>
            <div className={styles.filterGroup}>
              <label htmlFor="filter-status">Status:</label>
              <select
                id="filter-status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="todas">Todos os Status</option>
                <option value="aberta">Abertas</option>
                <option value="em_atendimento">Em Atendimento</option>
                <option value="concluida">Concluídas</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="filter-category">Categoria:</label>
              <select
                id="filter-category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="todas">Todas as Categorias</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Demand Cards List */}
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner} />
            <p>Carregando solicitações...</p>
          </div>
        ) : filteredDemands.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>📂</span>
            <h3>Nenhuma solicitação encontrada</h3>
            <p>Tente ajustar os filtros ou o termo de busca pesquisado.</p>
          </div>
        ) : (
          <div className={styles.demandsList}>
            {filteredDemands.map((demand) => {
              const statusClass =
                demand.status === 'aberta'
                  ? styles.statusBadgeOpen
                  : demand.status === 'em_atendimento'
                  ? styles.statusBadgeProgress
                  : styles.statusBadgeDone;

              const statusLabel =
                demand.status === 'aberta'
                  ? 'Aberta'
                  : demand.status === 'em_atendimento'
                  ? 'Em Atendimento'
                  : 'Concluída';

              return (
                <article key={demand.id} className={styles.demandCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.headerLeft}>
                      <span className={styles.protocolBadge}>{demand.id}</span>
                      <span className={styles.categoryBadge}>
                        <span aria-hidden="true">{getCategoryIcon(demand.category)}</span>{' '}
                        {getCategoryLabel(demand.category)}
                      </span>
                    </div>
                    <span className={`${styles.statusBadge} ${statusClass}`}>
                      {statusLabel}
                    </span>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.descriptionText}>
                      <strong>Problema relatado:</strong>
                      <p>{demand.description}</p>
                    </div>

                    <div className={styles.locationBlock}>
                      <div className={styles.locationTitle}>
                        <span aria-hidden="true">📍</span> Localização do Campo
                      </div>
                      <div className={styles.locationDetails}>
                        <p>
                          <strong>Comunidade / Bairro:</strong> {demand.location?.neighborhood || 'Não informado'}
                        </p>
                        <p>
                          <strong>Ponto de referência:</strong> {demand.location?.reference || 'Não informado'}
                        </p>
                        <p className={styles.subLocation}>
                          {demand.location?.state && `Estado: ${demand.location.state}`}
                          {demand.location?.cep && ` · CEP: ${demand.location.cep}`}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={styles.cardFooter}>
                    <div className={styles.footerDate}>
                      Registrado em: {formatDate(demand.createdAt)}
                    </div>

                    <div className={styles.footerActions}>
                      <div className={styles.actionGroup}>
                        <label htmlFor={`status-select-${demand.id}`}>
                          Alterar status:
                        </label>
                        <select
                          id={`status-select-${demand.id}`}
                          value={demand.status}
                          disabled={statusUpdating === demand.id}
                          onChange={(e) => handleStatusChange(demand.id, e.target.value)}
                          className={styles.statusActionSelect}
                        >
                          <option value="aberta">Aberta</option>
                          <option value="em_atendimento">Em Atendimento</option>
                          <option value="concluida">Concluída</option>
                        </select>
                      </div>

                      {/* Remove / Delete Button */}
                      <button
                        type="button"
                        className={styles.deleteBtn}
                        onClick={() => setDemandToDelete(demand)}
                        title="Remover solicitação"
                        aria-label={`Remover solicitação ${demand.id}`}
                      >
                        🗑️ Excluir
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Confirmation Modal to Delete Demand */}
      {demandToDelete && (
        <div
          className={styles.modalBackdrop}
          onClick={() => !isDeleting && setDemandToDelete(null)}
        >
          <div
            className={styles.modalDialog}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
          >
            <div className={styles.modalIcon}>⚠️</div>
            <h3 id="delete-modal-title" className={styles.modalTitle}>
              Remover Solicitação
            </h3>
            <p className={styles.modalDesc}>
              Tem certeza que deseja apagar a solicitação{' '}
              <strong>{demandToDelete.id}</strong>? Essa ação é definitiva e removerá o registro do sistema.
            </p>
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.modalCancelBtn}
                onClick={() => setDemandToDelete(null)}
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={styles.modalDeleteBtn}
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Removendo...' : 'Sim, Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
