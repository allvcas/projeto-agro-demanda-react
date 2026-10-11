/* Demand service with mock persistence and admin capabilities */

const DEMANDS_KEY = 'agrodemanda_demands';

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

// Initial realistic seed demands for Santa Cruz do Capibaribe rural communities
const initialDemands = [
  {
    id: 'DEM-8421',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    userId: 'user-1',
    category: 'estrada',
    status: 'aberta',
    description: 'Trecho com erosão e buracos profundos após as chuvas, dificultando o escoamento da produção leiteira.',
    location: {
      state: 'Pernambuco',
      neighborhood: 'Magana',
      cep: '55190-000',
      reference: 'Próximo ao sítio de Seu Zé do Leite',
    },
  },
  {
    id: 'DEM-8420',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // 18 hours ago
    userId: 'user-2',
    category: 'agua',
    status: 'em_atendimento',
    description: 'Chafariz comunitário com bomba queimada há 4 dias. Famílias sem abastecimento na localidade.',
    location: {
      state: 'Pernambuco',
      neighborhood: 'Lagoa do Barbosa',
      cep: '55190-000',
      reference: 'Ao lado da escola municipal rural',
    },
  },
  {
    id: 'DEM-8419',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 1.5 days ago
    userId: 'user-3',
    category: 'iluminacao',
    status: 'aberta',
    description: 'Postes com lâmpadas apagadas no acesso principal da comunidade, deixando o cruzamento perigoso.',
    location: {
      state: 'Pernambuco',
      neighborhood: 'Barra da Cruz',
      cep: '55190-000',
      reference: 'Entrada da BR-104 sentido vila',
    },
  },
  {
    id: 'DEM-8418',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(), // 2.5 days ago
    userId: 'user-4',
    category: 'agricultura',
    status: 'concluida',
    description: 'Solicitação de trator com arado para preparo de solo das famílias cadastradas no CAF para plantio de milho.',
    location: {
      state: 'Pernambuco',
      neighborhood: 'Cacimba de Baixo',
      cep: '55190-000',
      reference: 'Associação Comunitária dos Produtores',
    },
  },
  {
    id: 'DEM-8417',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 90).toISOString(),
    userId: 'user-5',
    category: 'saude',
    status: 'aberta',
    description: 'Agendamento de atendimento com técnico de vacinação para animais e orientação para o rebanho caprino.',
    location: {
      state: 'Pernambuco',
      neighborhood: 'Carrapicho',
      cep: '55190-000',
      reference: 'Galpão comunitário',
    },
  },
];

function loadDemands() {
  try {
    const raw = localStorage.getItem(DEMANDS_KEY);
    if (!raw) {
      localStorage.setItem(DEMANDS_KEY, JSON.stringify(initialDemands));
      return initialDemands;
    }
    return JSON.parse(raw);
  } catch {
    return initialDemands;
  }
}

function saveDemands(demands) {
  try {
    localStorage.setItem(DEMANDS_KEY, JSON.stringify(demands));
  } catch {
    /* ignore */
  }
}

/** Submit a new demand */
export async function submitDemand({ userId, category, description, location }) {
  await delay(700);
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const id = `DEM-${randomNum}`;
  const demand = {
    id,
    createdAt: new Date().toISOString(),
    userId: userId || 'anon',
    category,
    status: 'aberta', // 'aberta' | 'em_atendimento' | 'concluida'
    description,
    location,
  };

  const demands = loadDemands();
  demands.unshift(demand);
  saveDemands(demands);
  return { id };
}

/** Get all demands for admin view */
export async function getDemands() {
  await delay(300);
  return loadDemands();
}

/** Update demand status */
export async function updateDemandStatus(id, newStatus) {
  await delay(200);
  const demands = loadDemands();
  const updated = demands.map((d) => (d.id === id ? { ...d, status: newStatus } : d));
  saveDemands(updated);
  return updated;
}

/** Delete/remove a demand */
export async function deleteDemand(id) {
  await delay(200);
  const demands = loadDemands();
  const updated = demands.filter((d) => d.id !== id);
  saveDemands(updated);
  return updated;
}
