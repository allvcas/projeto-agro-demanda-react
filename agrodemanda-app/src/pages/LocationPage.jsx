import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader/AppHeader';
import TextField from '../components/TextField/TextField';
import Button from '../components/Button/Button';
import { useDemandDraft } from '../context/DemandDraftContext';
import { validateLocation } from '../utils/validators';
import { maskCep } from '../utils/masks';
import styles from './LocationPage.module.css';

export default function LocationPage() {
  const navigate = useNavigate();
  const { draft, setLocation } = useDemandDraft();

  const [stateVal, setStateVal] = useState(draft.location?.state || '');
  const [neighborhood, setNeighborhood] = useState(draft.location?.neighborhood || '');
  const [cep, setCep] = useState(draft.location?.cep || '');
  const [reference, setReference] = useState(draft.location?.reference || '');
  const [errors, setErrors] = useState({});

  const stateRef = useRef(null);
  const neighborhoodRef = useRef(null);
  const cepRef = useRef(null);
  const referenceRef = useRef(null);

  // Keep partial draft updated so returning via back button preserves typed values (RF-13, RF-14)
  useEffect(() => {
    setLocation({
      state: stateVal,
      neighborhood,
      cep,
      reference,
    });
  }, [stateVal, neighborhood, cep, reference, setLocation]);

  const handleBack = () => {
    navigate('/demanda');
  };

  const handleCepChange = (e) => {
    const masked = maskCep(e.target.value);
    setCep(masked);
    if (errors.cep) {
      setErrors((prev) => ({ ...prev, cep: null }));
    }
  };

  const handlePronto = (e) => {
    e.preventDefault();

    const validationErrors = validateLocation({
      state: stateVal,
      neighborhood,
      cep,
      reference,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Focus first error
      if (validationErrors.state) {
        stateRef.current?.focus();
      } else if (validationErrors.neighborhood) {
        neighborhoodRef.current?.focus();
      } else if (validationErrors.cep) {
        cepRef.current?.focus();
      } else if (validationErrors.reference) {
        referenceRef.current?.focus();
      }
      return;
    }

    setErrors({});
    setLocation({
      state: stateVal.trim(),
      neighborhood: neighborhood.trim(),
      cep: cep.trim(),
      reference: reference.trim(),
    });

    navigate('/demanda');
  };

  return (
    <div className={styles.page}>
      <AppHeader />

      <main className={styles.mainContent}>
        {/* Centered panel with blue border */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.titleWithIcon}>
              <span className={styles.pinIcon} aria-hidden="true">📍</span>
              <h2 className={styles.title}>Localização</h2>
            </div>
            {/* Control '<' on the right per prototype D.4 & D-02 */}
            <button
              type="button"
              className={styles.backButton}
              onClick={handleBack}
              aria-label="Voltar para a demanda"
            >
              &lt;
            </button>
          </div>

          <form onSubmit={handlePronto} noValidate className={styles.form}>
            <TextField
              ref={stateRef}
              id="loc-state"
              label="Estado"
              value={stateVal}
              onChange={(e) => {
                setStateVal(e.target.value);
                if (errors.state) setErrors((prev) => ({ ...prev, state: null }));
              }}
              error={errors.state}
              placeholder="Ex: Pernambuco"
            />

            <TextField
              ref={neighborhoodRef}
              id="loc-neighborhood"
              label="Bairro"
              value={neighborhood}
              onChange={(e) => {
                setNeighborhood(e.target.value);
                if (errors.neighborhood) setErrors((prev) => ({ ...prev, neighborhood: null }));
              }}
              error={errors.neighborhood}
              placeholder="Ex: Magana"
            />

            <TextField
              ref={cepRef}
              id="loc-cep"
              label="CEP"
              type="tel"
              value={cep}
              onChange={handleCepChange}
              error={errors.cep}
              placeholder="00000-000"
              maxLength={9}
            />

            <TextField
              ref={referenceRef}
              id="loc-reference"
              label="Ponto de referência"
              value={reference}
              onChange={(e) => {
                setReference(e.target.value);
                if (errors.reference) setErrors((prev) => ({ ...prev, reference: null }));
              }}
              error={errors.reference}
              placeholder="Ex: Próximo à igreja matriz"
            />

            <div className={styles.submitContainer}>
              <Button
                type="submit"
                variant="pill"
                className={styles.prontoButton}
              >
                PRONTO
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
