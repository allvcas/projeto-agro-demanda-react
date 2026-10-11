import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout/AuthLayout';
import AuthCard from '../components/AuthCard/AuthCard';
import TextField from '../components/TextField/TextField';
import Button from '../components/Button/Button';
import { useAuth } from '../context/AuthContext';
import { validateRegister } from '../utils/validators';
import styles from './RegisterPage.module.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    const validationErrors = validateRegister({ username, email, password });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      if (validationErrors.username) {
        usernameRef.current?.focus();
      } else if (validationErrors.email) {
        emailRef.current?.focus();
      } else if (validationErrors.password) {
        passwordRef.current?.focus();
      }
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await register({ username, email, password });
      navigate('/login', {
        state: { registeredEmail: email.trim() },
        replace: true,
      });
    } catch (err) {
      if (err.field === 'email') {
        setErrors((prev) => ({ ...prev, email: err.message }));
        emailRef.current?.focus();
      } else {
        setGeneralError(err.message || 'Erro ao realizar cadastro.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <h1 className={styles.title}>Criar Conta</h1>

        {generalError && (
          <div className={styles.errorAlert} role="alert">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <TextField
            ref={usernameRef}
            id="register-username"
            label="Usuário"
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (errors.username) setErrors((prev) => ({ ...prev, username: null }));
            }}
            error={errors.username}
            autoComplete="username"
            placeholder="Seu nome"
          />

          <TextField
            ref={emailRef}
            id="register-email"
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
            }}
            error={errors.email}
            autoComplete="email"
            placeholder="seu@email.com"
          />

          <TextField
            ref={passwordRef}
            id="register-password"
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
            }}
            error={errors.password}
            autoComplete="new-password"
            placeholder="Mínimo 6 caracteres"
          />

          <div className={styles.buttonWrapper}>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              loadingText="Cadastrando..."
            >
              CADASTRE-SE
            </Button>
          </div>
        </form>

        <div className={styles.footerText}>
          <span>Já Tem Uma Conta ? </span>
          <Link to="/login" className={styles.loginLink}>
            Entre
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
