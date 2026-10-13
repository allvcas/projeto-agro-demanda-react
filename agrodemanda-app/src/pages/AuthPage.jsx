import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { maskCpf, maskPhone } from '../utils/masks';
import styles from './AuthPage.module.css';

/**
 * Tela de Autenticação — Área do Agricultor
 * Permite que o produtor faça Login ou Crie uma Conta em uma única página dividida por abas.
 */
export default function AuthPage({ defaultTab = 'login' }) {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  // 1. Controle da aba ativa ('login' ou 'register')
  const [activeTab, setActiveTab] = useState(defaultTab);

  // 2. Mensagens de feedback e carregamento
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // 3. Dados do formulário de Login
  const [loginData, setLoginData] = useState({
    identifier: '',
    password: '',
  });

  // 4. Dados do formulário de Cadastro
  const [regData, setRegData] = useState({
    name: '',
    cpf: '',
    phone: '',
    email: '',
    community: '',
    password: '',
  });

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

  // Alterna entre as abas e limpa avisos
  const switchTab = (tab) => {
    setActiveTab(tab);
    setErrorMsg('');
    setSuccessMsg('');
  };

  // Envio do formulário de Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginData.identifier.trim() || !loginData.password) {
      setErrorMsg('Informe seu e-mail ou CPF e sua senha.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const user = await login({
        email: loginData.identifier.trim(),
        password: loginData.password,
      });

      // Redireciona para o painel de admin ou para a tela inicial
      navigate(user?.role === 'admin' ? '/admin' : '/inicio', { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'E-mail, CPF ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  // Envio do formulário de Cadastro
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regData.name.trim() || !regData.email.trim() || !regData.password) {
      setErrorMsg('Preencha os campos obrigatórios (Nome, E-mail e Senha).');
      return;
    }

    if (regData.password.length < 6) {
      setErrorMsg('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      await register({
        username: regData.name.trim(),
        email: regData.email.trim(),
        password: regData.password,
        cpf: regData.cpf.trim(),
        phone: regData.phone.trim(),
        community: regData.community,
      });

      // Ao cadastrar com sucesso, vai para o login com o e-mail já preenchido
      setSuccessMsg('Conta criada com sucesso! Faça seu login.');
      setLoginData((prev) => ({ ...prev, identifier: regData.email.trim() }));
      switchTab('login');
    } catch (err) {
      setErrorMsg(err.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Lado Esquerdo: Banner informativo sobre o sistema rural */}
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

        {/* Lado Direito: Card com as Abas de Entrar / Criar conta */}
        <div className={styles.cardColumn}>
          <div className={styles.authCard}>
            {/* Botões de alternar abas */}
            <div className={styles.cardTabs}>
              <button
                type="button"
                className={`${styles.tabBtn} ${activeTab === 'login' ? styles.tabBtnActive : ''}`}
                onClick={() => switchTab('login')}
              >
                Entrar
              </button>
              <button
                type="button"
                className={`${styles.tabBtn} ${activeTab === 'register' ? styles.tabBtnActive : ''}`}
                onClick={() => switchTab('register')}
              >
                Criar conta
              </button>
            </div>

            <div className={styles.cardBody}>
              {/* Mensagens de Sucesso ou Erro */}
              {successMsg && <div className={styles.successAlert}>{successMsg}</div>}
              {errorMsg && <div className={styles.errorAlert}>{errorMsg}</div>}

              {/* ===== ABA DE LOGIN ===== */}
              {activeTab === 'login' && (
                <form onSubmit={handleLogin} className={styles.form}>
                  <div className={styles.headerTitleGroup}>
                    <h2 className={styles.formTitle}>Bem-vindo de volta</h2>
                    <p className={styles.formSubtitle}>Informe seus dados para entrar.</p>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="login-id" className={styles.label}>E-mail ou CPF</label>
                    <input
                      id="login-id"
                      type="text"
                      className={styles.input}
                      placeholder="Digite seu e-mail ou CPF"
                      value={loginData.identifier}
                      onChange={(e) => setLoginData({ ...loginData, identifier: e.target.value })}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="login-pass" className={styles.label}>Senha</label>
                    <input
                      id="login-pass"
                      type="password"
                      className={styles.input}
                      placeholder="Digite sua senha"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
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

                  <button type="submit" className={styles.submitButton} disabled={loading}>
                    {loading ? 'Entrando...' : 'Entrar na minha conta'}
                  </button>

                  <div className={styles.switchRow}>
                    <span>Ainda não tem cadastro? </span>
                    <button type="button" className={styles.switchLink} onClick={() => switchTab('register')}>
                      Criar conta
                    </button>
                  </div>
                </form>
              )}

              {/* ===== ABA DE CADASTRO ===== */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegister} className={styles.form}>
                  <div className={styles.headerTitleGroup}>
                    <h2 className={styles.formTitle}>Crie sua conta</h2>
                    <p className={styles.formSubtitle}>Preencha somente os dados necessários.</p>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="reg-nome" className={styles.label}>Nome completo</label>
                    <input
                      id="reg-nome"
                      type="text"
                      className={styles.input}
                      placeholder="Digite seu nome"
                      value={regData.name}
                      onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                    />
                  </div>

                  <div className={styles.twoCols}>
                    <div className={styles.fieldGroup}>
                      <label htmlFor="reg-cpf" className={styles.label}>CPF</label>
                      <input
                        id="reg-cpf"
                        type="tel"
                        className={styles.input}
                        placeholder="000.000.000-00"
                        value={regData.cpf}
                        maxLength={14}
                        onChange={(e) => setRegData({ ...regData, cpf: maskCpf(e.target.value) })}
                      />
                    </div>

                    <div className={styles.fieldGroup}>
                      <label htmlFor="reg-tel" className={styles.label}>Telefone</label>
                      <input
                        id="reg-tel"
                        type="tel"
                        className={styles.input}
                        placeholder="(81) 99999-9999"
                        value={regData.phone}
                        maxLength={15}
                        onChange={(e) => setRegData({ ...regData, phone: maskPhone(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="reg-email" className={styles.label}>E-mail</label>
                    <input
                      id="reg-email"
                      type="email"
                      className={styles.input}
                      placeholder="seuemail@exemplo.com"
                      value={regData.email}
                      onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="reg-comunidade" className={styles.label}>Comunidade ou localidade</label>
                    <select
                      id="reg-comunidade"
                      className={styles.select}
                      value={regData.community}
                      onChange={(e) => setRegData({ ...regData, community: e.target.value })}
                    >
                      <option value="">Selecione sua comunidade</option>
                      {ruralCommunities.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="reg-pass" className={styles.label}>Crie uma senha</label>
                    <input
                      id="reg-pass"
                      type="password"
                      className={styles.input}
                      placeholder="Use pelo menos 6 caracteres"
                      value={regData.password}
                      onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                    />
                  </div>

                  <button type="submit" className={styles.submitButton} disabled={loading}>
                    {loading ? 'Criando conta...' : 'Criar minha conta'}
                  </button>

                  <p className={styles.disclaimerText}>
                    Seus dados serão usados somente para o atendimento das solicitações rurais.
                  </p>

                  <div className={styles.switchRow}>
                    <span>Já possui cadastro? </span>
                    <button type="button" className={styles.switchLink} onClick={() => switchTab('login')}>
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
