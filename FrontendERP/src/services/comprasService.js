const API_URL = import.meta.env.VITE_API_URL;

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '',
});

async function handle(response, fallback) {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message?.replace(/^"|"$/g, '') || fallback);
  }
  if (response.status === 204) return null;
  return response.json().catch(() => null);
}

export const comprasService = {
  listar: async () => handle(await fetch(`${API_URL}/api/compras`, { headers: headers() }), 'Erro ao carregar compras.'),
  buscar: async ({ numNfe, serie, modelo, codForn }) => handle(
    await fetch(`${API_URL}/api/compras/${numNfe}/${serie}/${modelo}/${codForn}`, { headers: headers() }),
    'Erro ao carregar a compra.',
  ),
  criar: async (data) => handle(await fetch(`${API_URL}/api/compras`, {
    method: 'POST', headers: headers(), body: JSON.stringify(data),
  }), 'Erro ao salvar a compra.'),
  excluir: async ({ numNfe, serie, modelo, codForn }) => handle(
    await fetch(`${API_URL}/api/compras/${numNfe}/${serie}/${modelo}/${codForn}`, {
      method: 'DELETE', headers: headers(),
    }),
    'Erro ao excluir a compra.',
  ),
};
