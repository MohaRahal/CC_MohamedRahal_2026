const API_BASE_URL = import.meta.env.VITE_API_URL;

const requestOptions = (method = 'GET', data) => ({
    method,
    headers: {
        Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '',
        ...(data ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(data ? { body: JSON.stringify(data) } : {}),
});

const ensureOk = async (response, fallback) => {
    if (!response.ok) {
        const message = await response.text();
        if (response.status === 409 || /foreign key|constraint fails|parent row/i.test(message)) {
            throw new Error('Esta marca está sendo usada em modelos ou produtos e não pode ser excluída.');
        }
        throw new Error(message?.replace(/^"|"$/g, '') || fallback);
    }
    if (response.status === 204) return null;
    return response.json().catch(() => null);
};

export const marcasService = {
    async getMarcas() {
        return ensureOk(await fetch(`${API_BASE_URL}/api/Marcas`, requestOptions()), 'Erro ao buscar marcas.');
    },
    async getMarcaById(id) {
        return ensureOk(await fetch(`${API_BASE_URL}/api/Marcas/${id}`, requestOptions()), 'Erro ao buscar marca.');
    },
    async createMarca(data) {
        return ensureOk(await fetch(`${API_BASE_URL}/api/Marcas`, requestOptions('POST', data)), 'Erro ao criar marca.');
    },
    async updateMarca(id, data) {
        return ensureOk(await fetch(`${API_BASE_URL}/api/Marcas/${id}`, requestOptions('PATCH', data)), 'Erro ao atualizar marca.');
    },
    async deleteMarca(id) {
        await ensureOk(await fetch(`${API_BASE_URL}/api/Marcas/${id}`, requestOptions('DELETE')), 'Erro ao excluir marca.');
        return true;
    },
};
