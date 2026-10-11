/* Pure validation functions — return { field: errorMessage } */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin({ email, password }) {
  const errors = {};
  const trimmed = (email || '').trim().toLowerCase();
  if (!trimmed) {
    errors.email = 'Informe seu e-mail ou usuário.';
  } else if (trimmed !== 'admin' && (!EMAIL_RE.test(trimmed) || trimmed.length > 254)) {
    errors.email = 'E-mail inválido.';
  }
  if (!password || !password.trim()) {
    errors.password = 'Informe sua senha.';
  }
  return errors;
}

export function validateRegister({ username, email, password }) {
  const errors = {};
  const uname = (username || '').trim();
  if (!uname) {
    errors.username = 'Informe um nome de usuário (mín. 3 caracteres).';
  } else if (uname.length < 3 || uname.length > 40) {
    errors.username = 'Informe um nome de usuário (mín. 3 caracteres).';
  }
  if (!email || !email.trim()) {
    errors.email = 'Informe seu e-mail.';
  } else if (!EMAIL_RE.test(email.trim()) || email.trim().length > 254) {
    errors.email = 'E-mail inválido.';
  }
  if (!password) {
    errors.password = 'A senha deve ter pelo menos 6 caracteres.';
  } else if (password.length < 6) {
    errors.password = 'A senha deve ter pelo menos 6 caracteres.';
  }
  return errors;
}

export function validateDemand({ category, description, location }) {
  const errors = {};
  if (!category) {
    errors.category = 'Escolha uma categoria.';
  }
  const desc = (description || '').trim();
  const minDesc = category === 'outro' ? 20 : 10;
  if (!desc || desc.length < minDesc) {
    errors.description = `Descreva o problema (mín. ${minDesc} caracteres).`;
  } else if (desc.length > 500) {
    errors.description = 'A descrição deve ter no máximo 500 caracteres.';
  }
  if (!location || !location.state || !location.neighborhood || !location.reference) {
    errors.location = 'Informe a localização.';
  }
  return errors;
}

export function validateLocation({ state, neighborhood, cep, reference }) {
  const errors = {};
  const st = (state || '').trim();
  if (!st || st.length < 2 || st.length > 40 || !/^[a-zA-ZÀ-ú\s]+$/.test(st)) {
    errors.state = 'Informe o estado.';
  }
  const nb = (neighborhood || '').trim();
  if (!nb || nb.length < 2 || nb.length > 80) {
    errors.neighborhood = 'Informe o bairro ou comunidade.';
  }
  const cepDigits = (cep || '').replace(/\D/g, '');
  if (cepDigits && cepDigits.length !== 8) {
    errors.cep = 'CEP inválido. Use 8 números.';
  }
  const ref = (reference || '').trim();
  if (!ref || ref.length < 3 || ref.length > 120) {
    errors.reference = 'Informe um ponto de referência.';
  }
  return errors;
}
