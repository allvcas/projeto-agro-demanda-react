import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader/AppHeader';
import CategoryGrid from '../components/CategoryGrid/CategoryGrid';
import TextAreaField from '../components/TextAreaField/TextAreaField';
import LocationLink from '../components/LocationLink/LocationLink';
import Button from '../components/Button/Button';
import FeedbackDialog from '../components/FeedbackDialog/FeedbackDialog';
import { useDemandDraft } from '../context/DemandDraftContext';
import { useAuth } from '../context/AuthContext';
import { validateDemand } from '../utils/validators';
import { submitDemand } from '../services/demandService';
import styles from './DemandPage.module.css';

export default function DemandPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { draft, setCategory, setDescription, resetDraft } = useDemandDraft();

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogError, setDialogError] = useState('');

  const descRef = useRef(null);
  const locRef = useRef(null);

  const handleSelectCategory = (catId) => {
    setCategory(catId);
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: null }));
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    if (errors.description) {
      setErrors((prev) => ({ ...prev, description: null }));
    }
  };

  const handleOpenLocation = () => {
    navigate('/demanda/localizacao');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateDemand({
      category: draft.category,
      description: draft.description,
      location: draft.location,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Focus on the first invalid field per spec RF-15
      if (validationErrors.category) {
        // Scroll to category grid
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (validationErrors.description) {
        descRef.current?.focus();
      } else if (validationErrors.location) {
        locRef.current?.focus();
      }
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      await submitDemand({
        userId: user?.id,
        category: draft.category,
        description: draft.description,
        location: draft.location,
      });
      setDialogOpen(true);
    } catch (err) {
      setDialogError(err.message || 'Não foi possível enviar. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    resetDraft();
  };

  return (
    <div className={styles.page}>
      <AppHeader />

      <main className={styles.mainContent}>
        <div className={styles.column}>
          <h2 className={styles.title}>Qual a sua necessidade ?</h2>
          <p className={styles.subtitle}>
            Escolha o tipo de demanda e preencha as informações abaixo.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <CategoryGrid
              selectedCategory={draft.category}
              onSelectCategory={handleSelectCategory}
              error={errors.category}
            />

            <TextAreaField
              ref={descRef}
              id="demand-description"
              label="Descrição do problema"
              value={draft.description}
              onChange={handleDescriptionChange}
              error={errors.description}
              placeholder="Ex: Sem iluminação na br-180"
            />

            <LocationLink
              ref={locRef}
              location={draft.location}
              onClick={handleOpenLocation}
              error={errors.location}
            />

            <div className={styles.submitContainer}>
              <Button
                type="submit"
                variant="pill"
                loading={submitting}
                loadingText="Enviando..."
                className={styles.sendButton}
              >
                ENVIAR
              </Button>
            </div>
          </form>
        </div>
      </main>

      {/* Success Dialog */}
      <FeedbackDialog
        isOpen={dialogOpen}
        title="Sucesso!"
        message="Demanda enviada com sucesso! Sua solicitação foi registrada."
        onClose={handleDialogClose}
        type="success"
      />

      {/* Network / Error Dialog */}
      <FeedbackDialog
        isOpen={!!dialogError}
        title="Atenção"
        message={dialogError}
        onClose={() => setDialogError('')}
        type="error"
      />
    </div>
  );
}
