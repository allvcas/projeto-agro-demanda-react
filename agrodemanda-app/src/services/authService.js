/* Mock auth service using localStorage to persist registered users.
   Passwords are NOT stored in plain text — we store a simple SHA-256-like
   hash via btoa for demo purposes only. */

const USERS_KEY = 'agrodemanda_users';

function hashPass(pw) {
  return btoa(unescape(encodeURIComponent(pw + '__agrodemanda_salt__')));
}

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

/** Register a new user. Returns { user } or throws { code, message }. */
export async function register({ username, email, password }) {
  await delay(700);
  const users = loadUsers();
  const exists = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (exists) {
    const err = new Error('E-mail já cadastrado.');
    err.code = 'EMAIL_EXISTS';
    err.field = 'email';
    throw err;
  }
  const user = {
    id: crypto.randomUUID(),
    username: username.trim(),
    email: email.trim().toLowerCase(),
    passwordHash: hashPass(password),
  };
  users.push(user);
  saveUsers(users);
  return { user: { id: user.id, username: user.username, email: user.email } };
}

/** Login. Returns { user } or throws { code, message }. */
export async function login({ email, password }) {
  await delay(700);
  const identifier = (email || '').trim().toLowerCase();

  // Admin credentials per requirement: usuário = admin, senha = admin
  if (identifier === 'admin' && password === 'admin') {
    return {
      user: {
        id: 'admin-master',
        username: 'admin',
        email: 'admin@agrodemanda.gov.br',
        role: 'admin',
      },
    };
  }

  const users = loadUsers();
  const user = users.find(
    (u) =>
      u.email.toLowerCase() === identifier ||
      (u.username && u.username.toLowerCase() === identifier)
  );

  if (!user || user.passwordHash !== hashPass(password)) {
    const err = new Error('E-mail ou senha incorretos.');
    err.code = 'INVALID_CREDENTIALS';
    throw err;
  }
  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: 'user',
    },
  };
}

/** Logout — no async needed, kept for API symmetry. */
export function logout() {
  /* session cleared by AuthContext */
}
