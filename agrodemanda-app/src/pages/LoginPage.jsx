import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout/AuthLayout';
import AuthCard from '../components/AuthCard/AuthCard';
import TextField from '../components/TextField/TextField';
import Button from '../components/Button/Button';
import { useAuth } from '../context/AuthContext';
import { validateLogin } from '../utils/validators';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  // Check if redirected from registration
  useEffect(() => {
    if (location.state?.registeredEmail) {
      setEmail(location.state.registeredEmail);
      setSuccessMessage('Conta criada! Faça seu login.');
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setSuccessMessage('');

    const validationErrors = validateLogin({ email, password });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      if (validationErrors.email) {
        emailRef.current?.focus();
      } else if (validationErrors.password) {
        passwordRef.current?.focus();
      }
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const loggedUser = await login({ email, password });
      if (loggedUser?.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        const destination = location.state?.from?.pathname || '/demanda';
        navigate(destination, { replace: true });
      }
    } catch (err) {
      setGeneralError(err.message || 'Erro ao realizar login.');
      setPassword('');
      emailRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <h1 className={styles.title}>Entre</h1>

        {successMessage && (
          <div className={styles.successAlert} role="status">
            {successMessage}
          </div>
        )}

        {generalError && (
          <div className={styles.errorAlert} role="alert">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <TextField
            ref={emailRef}
            id="login-email"
            label="E-mail"
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
            }}
            error={errors.email}
            autoComplete="username"
            placeholder="seu@email.com "
          />

          <TextField
            ref={passwordRef}
            id="login-password"
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
            }}
            error={errors.password}
            autoComplete="current-password"
            placeholder="••••••"
          />

          <div className={styles.buttonWrapper}>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              loadingText="Entrando..."
            >
              ENTRAR
            </Button>
          </div>
        </form>

        <div className={styles.footerText}>
          <span>Não Tem Uma Conta ? </span>
          <Link to="/cadastro" className={styles.signupLink}>
            Cadastre-se
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
