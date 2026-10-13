import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { maskCpf, maskPhone } from '../utils/masks';
import styles from './AuthPage.module.css';

/**
 * Tela de Autenticação — Área do Agricultor
 * Reúne Login ("Entrar") e Cadastro ("Criar conta") em uma interface limpa, dividida por abas.
 */
export default function AuthPage({ defaultTab = 'login' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();

  // Define qual aba está ativa ('login' ou 'register')
  const [activeTab, setActiveTab] = useState(
    location.pathname === '/cadastro' || defaultTab === 'register' ? 'register' : 'login'
  );

  // Sincroniza a aba se o usuário navegar entre /login e /cadastro
  useEffect(() => {
    if (location.pathname === '/cadastro') {
      setActiveTab('register');
    } else if (location.pathname === '/login') {
      setActiveTab('login');
    }
  }, [location.pathname]);

  // --- Estados do Formulário de Login ---
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // --- Estados do Formulário de Cadastro ---
  const [regName, setRegName] = useState('');
  const [regCpf, setRegCpf] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCommunity, setRegCommunity] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Mensagens de feedback
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Lista de comunidades rurais
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

  // Alterna entre abas e atualiza a URL sem recarregar a página
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setErrorMsg('');
    setSuccessMsg('');
    if (tab === 'login') {
      window.history.replaceState(null, '', '/login');
    } else {
      window.history.replaceState(null, '', '/cadastro');
    }
  };

  // --- Ação de Login ---
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!loginIdentifier.trim()) {
      setErrorMsg('Informe seu e-mail ou CPF.');
      return;
    }
    if (!loginPassword) {
      setErrorMsg('Informe sua senha.');
      return;
    }

    setLoading(true);
    try {
      const loggedUser = await login({
        email: loginIdentifier.trim(),
        password: loginPassword,
      });

      if (loggedUser?.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/inicio', { replace: true });
      }
    } catch (err) {
      setErrorMsg(err.message || 'E-mail, CPF ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  // --- Ação de Cadastro ---
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regName.trim()) {
      setErrorMsg('Informe seu nome completo.');
      return;
    }
    if (!regEmail.trim()) {
      setErrorMsg('Informe seu e-mail.');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setErrorMsg('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await register({
        username: regName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        cpf: regCpf.trim(),
        phone: regPhone.trim(),
        community: regCommunity,
      });

      // Sucesso no cadastro: muda para a aba de login e preenche o identificador
      setLoginIdentifier(regEmail.trim());
      setSuccessMsg('Conta criada com sucesso! Faça seu login para continuar.');
      handleTabChange('login');
    } catch (err) {
      setErrorMsg(err.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Coluna da Esquerda: Informações e Apresentação */}
        <div className={styles.infoColumn}>
          <div className={styles.emblem}>
            <svg viewBox="0 0 24 24" fill="none" className={styles.sproutSvg}>
              <path
                d="M12 21V12M12 12C12 8.5 9 6 5.5 6C5.5 9.5 8 12 12 12ZM12 12C12 7.5 15.5 5 19.5 5C19.5 9 16 12 12 12Z"
                stroke="#A8D5BA"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <span className={styles.tag}>ÁREA DO AGRICULTOR</span>

          <h1 className={styles.heroTitle}>
            Seu atendimento rural em um só lugar.
          </h1>

          <p className={styles.heroSubtitle}>
            Entre para registrar necessidades da sua propriedade, guardar seus protocolos e acompanhar cada atendimento.
          </p>

          <ul className={styles.featureList}>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span>
              <span>Cadastro simples e rápido</span>
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span>
              <span>Histórico das suas solicitações</span>
            </li>
            <li className={styles.featureItem}>
              <span className={styles.checkIcon}>✓</span>
              <span>Informações do atendimento em um só lugar</span>
            </li>
          </ul>
        </div>

        {/* Coluna da Direita: Card com Abas de Login e Cadastro */}
        <div className={styles.cardColumn}>
          <div className={styles.authCard}>
            {/* Abas no Topo do Card */}
            <div className={styles.cardTabs}>
              <button
                type="button"
                className={`${styles.tabBtn} ${activeTab === 'login' ? styles.tabBtnActive : ''}`}
                onClick={() => handleTabChange('login')}
              >
                Entrar
              </button>
              <button
                type="button"
                className={`${styles.tabBtn} ${activeTab === 'register' ? styles.tabBtnActive : ''}`}
                onClick={() => handleTabChange('register')}
              >
                Criar conta
              </button>
            </div>

            {/* Conteúdo Interno do Card */}
            <div className={styles.cardBody}>
              {/* Alertas */}
              {successMsg && (
                <div className={styles.successAlert}>{successMsg}</div>
              )}
              {errorMsg && (
                <div className={styles.errorAlert}>{errorMsg}</div>
              )}




              {/* ===== ABA: ENTRAR ===== */}
              {activeTab === 'login' && (
                <form onSubmit={handleLoginSubmit} className={styles.form}>
                  <div className={styles.headerTitleGroup}>
                    <h2 className={styles.formTitle}>Bem-vindo de volta</h2>
                    <p className={styles.formSubtitle}>Informe seus dados para entrar.</p>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="login-id" className={styles.label}>
                      E-mail ou CPF
                    </label>
                    <input
                      id="login-id"
                      type="text"
                      className={styles.input}
                      placeholder="Digite seu e-mail ou CPF"
                      value={loginIdentifier}
                      onChange={(e) => {
                        setLoginIdentifier(e.target.value);
                        setErrorMsg('');
                      }}
                      autoComplete="username"
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="login-pass" className={styles.label}>
                      Senha
                    </label>
                    <input
                      id="login-pass"
                      type="password"
                      className={styles.input}
                      placeholder="Digite sua senha"
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        setErrorMsg('');
                      }}
                      autoComplete="current-password"
                    />
                  </div>

                  <div className={styles.forgotRow}>
                    <button
                      type="button"
                      className={styles.forgotLink}
                      onClick={() => alert('Procure a Secretaria de Agricultura para redefinição de senha.')}
                    >
                      Esqueci minha senha
                    </button>
                  </div>

                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={loading}
                  >
                    {loading ? 'Entrando...' : 'Entrar na minha conta'}
                  </button>

                  <div className={styles.switchRow}>
                    <span>Ainda não tem cadastro? </span>
                    <button
                      type="button"
                      className={styles.switchLink}
                      onClick={() => handleTabChange('register')}
                    >
                      Criar conta
                    </button>
                  </div>
                </form>
              )}

              {/* ===== ABA: CRIAR CONTA ===== */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegisterSubmit} className={styles.form}>
                  <div className={styles.headerTitleGroup}>
                    <h2 className={styles.formTitle}>Crie sua conta</h2>
                    <p className={styles.formSubtitle}>Preencha somente os dados necessários.</p>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="reg-nome" className={styles.label}>
                      Nome completo
                    </label>
                    <input
                      id="reg-nome"
                      type="text"
                      className={styles.input}
                      placeholder="Digite seu nome"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                    />
                  </div>

                  <div className={styles.twoCols}>
                    <div className={styles.fieldGroup}>
                      <label htmlFor="reg-cpf" className={styles.label}>
                        CPF
                      </label>
                      <input
                        id="reg-cpf"
                        type="tel"
                        className={styles.input}
                        placeholder="000.000.000-00"
                        value={regCpf}
                        maxLength={14}
                        onChange={(e) => setRegCpf(maskCpf(e.target.value))}
                      />
                    </div>

                    <div className={styles.fieldGroup}>
                      <label htmlFor="reg-tel" className={styles.label}>
                        Telefone
                      </label>
                      <input
                        id="reg-tel"
                        type="tel"
                        className={styles.input}
                        placeholder="(81) 99999-9999"
                        value={regPhone}
                        maxLength={15}
                        onChange={(e) => setRegPhone(maskPhone(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="reg-email" className={styles.label}>
                      E-mail
                    </label>
                    <input
                      id="reg-email"
                      type="email"
                      className={styles.input}
                      placeholder="seuemail@exemplo.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="reg-comunidade" className={styles.label}>
                      Comunidade ou localidade
                    </label>
                    <select
                      id="reg-comunidade"
                      className={styles.select}
                      value={regCommunity}
                      onChange={(e) => setRegCommunity(e.target.value)}
                    >
                      <option value="">Selecione sua comunidade</option>
                      {ruralCommunities.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="reg-pass" className={styles.label}>
                      Crie uma senha
                    </label>
                    <input
                      id="reg-pass"
                      type="password"
                      className={styles.input}
                      placeholder="Use pelo menos 6 caracteres"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={loading}
                  >
                    {loading ? 'Criando conta...' : 'Criar minha conta'}
                  </button>

                  <p className={styles.disclaimerText}>
                    Seus dados serão usados somente para o atendimento das solicitações rurais.
                  </p>

                  <div className={styles.switchRow}>
                    <span>Já possui cadastro? </span>
                    <button
                      type="button"
                      className={styles.switchLink}
                      onClick={() => handleTabChange('login')}
                    >
                      Entrar
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
