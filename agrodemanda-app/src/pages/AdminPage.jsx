import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader/AppHeader';
import { getDemands, updateDemandStatus, deleteDemand } from '../services/demandService';
import { categories } from '../data/categories';
import styles from './AdminPage.module.css';

/**
 * Painel da Gestão Pública (Admin)
 * Permite que a Secretaria acompanhe todos os pedidos, altere o status e filtre por comunidade.
 */
export default function AdminPage() {
  const navigate = useNavigate();

  // Estados principais
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todas');
  const [categoryFilter, setCategoryFilter] = useState('todas');
  const [toastMessage, setToastMessage] = useState('');

  // 1. Carrega todas as demandas do sistema ao abrir a tela
  useEffect(() => {
    async function loadData() {
      const data = await getDemands();
      setDemands(data);
      setLoading(false);
    }
    loadData();
  }, []);

  // 2. Altera o status da demanda (Aberta, Em Atendimento, Concluída)
  const handleStatusChange = async (id, newStatus) => {
    const updated = await updateDemandStatus(id, newStatus);
    setDemands(updated);
  };

  // 3. Exclui uma demanda após confirmação simples
  const handleDelete = async (id) => {
    if (window.confirm(`Tem certeza que deseja remover a solicitação ${id}?`)) {
      const updated = await deleteDemand(id);
      setDemands(updated);
      setToastMessage('Solicitação removida com sucesso!');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  // 4. Métricas calculadas para os cards do topo
  const openCount = demands.filter((d) => d.status === 'aberta').length;
  const inProgressCount = demands.filter((d) => d.status === 'em_atendimento').length;
  const completedCount = demands.filter((d) => d.status === 'concluida').length;

  // 5. Filtro dinâmico das demandas
  const filteredDemands = demands.filter((d) => {
    if (statusFilter !== 'todas' && d.status !== statusFilter) return false;
    if (categoryFilter !== 'todas' && d.category !== categoryFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchId = d.id?.toLowerCase().includes(q);
      const matchDesc = d.description?.toLowerCase().includes(q);
      const matchLoc = (d.location?.community || d.location?.neighborhood || '').toLowerCase().includes(q);
      return matchId || matchDesc || matchLoc;
    }
    return true;
  });

  return (
    <div className={styles.adminPage}>
      <AppHeader />

      <main className={styles.mainContainer}>
        {toastMessage && (
          <div className={styles.toastAlert}>
            <span>✓</span> {toastMessage}
          </div>
        )}

        {/* Topo do Painel */}
        <div className={styles.topBar}>
          <div className={styles.titleInfo}>
            <div className={styles.adminBadge}>PAINEL DA GESTÃO PÚBLICA</div>
            <h1 className={styles.pageTitle}>Solicitações da Comunidade Rural</h1>
            <p className={styles.pageSubtitle}>
              Triagem, despacho técnico e acompanhamento de Santa Cruz do Capibaribe
            </p>
          </div>
          <button
            type="button"
            className={styles.newDemandBtn}
            onClick={() => navigate('/solicitacao')}
          >
            + Nova Solicitação
          </button>
        </div>

        {/* 4 Cards de Métricas */}
        <section className={styles.metricsGrid}>
          <div className={`${styles.metricCard} ${styles.metricTotal}`}>
            <span className={styles.metricLabel}>Total</span>
            <span className={styles.metricValue}>{demands.length}</span>
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

        {/* Barra de Busca e Filtros */}
        <section className={styles.filterSection}>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Buscar por protocolo, comunidade, descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
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
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Lista de Chamados */}
        {loading ? (
          <p>Carregando solicitações...</p>
        ) : filteredDemands.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>📂</span>
            <h3>Nenhuma solicitação encontrada</h3>
          </div>
        ) : (
          <div className={styles.demandsList}>
            {filteredDemands.map((demand) => {
              const categoryLabel = categories.find((c) => c.id === demand.category)?.label || demand.category;

              return (
                <article key={demand.id} className={styles.demandCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.headerLeft}>
                      <span className={styles.protocolBadge}>{demand.id}</span>
                      <span className={styles.categoryBadge}>{categoryLabel}</span>
                    </div>
                    <span className={`${styles.statusBadge} ${
                      demand.status === 'aberta'
                        ? styles.statusBadgeOpen
                        : demand.status === 'em_atendimento'
                        ? styles.statusBadgeProgress
                        : styles.statusBadgeDone
                    }`}>
                      {demand.status === 'aberta' ? 'Aberta' : demand.status === 'em_atendimento' ? 'Em Atendimento' : 'Concluída'}
                    </span>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.descriptionText}>
                      <strong>Problema relatado:</strong>
                      <p>{demand.description}</p>
                    </div>

                    <div className={styles.locationBlock}>
                      <div className={styles.locationTitle}>📍 Localização</div>
                      <div className={styles.locationDetails}>
                        <p><strong>Comunidade:</strong> {demand.location?.community || demand.location?.neighborhood || 'Não informado'}</p>
                        {demand.location?.reference && (
                          <p><strong>Referência:</strong> {demand.location.reference}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={styles.cardFooter}>
                    <div className={styles.footerDate}>
                      Registrado em: {new Date(demand.createdAt).toLocaleDateString('pt-BR')}
                    </div>

                    <div className={styles.footerActions}>
                      <div className={styles.actionGroup}>
                        <label htmlFor={`status-${demand.id}`}>Status:</label>
                        <select
                          id={`status-${demand.id}`}
                          value={demand.status}
                          onChange={(e) => handleStatusChange(demand.id, e.target.value)}
                          className={styles.statusActionSelect}
                        >
                          <option value="aberta">Aberta</option>
                          <option value="em_atendimento">Em Atendimento</option>
                          <option value="concluida">Concluída</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(demand.id)}
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
    </div>
  );
}
