import { data } from "react-router-dom";

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
            throw new Error('Este grupo está sendo usado em produtos e não pode ser excluído.');
        }
        throw new Error(message?.replace(/^"|"$/g, '') || fallback);
    }
    if (response.status === 204) return null;
    return response.json().catch(() => null);
};

export const gruposService = {
    async getGrupos() {
        return ensureOk(await fetch(`${API_BASE_URL}/api/Grupos`, requestOptions()), 'Erro ao buscar grupos.');
    },
    async getGrupoById(id) {
        return ensureOk(await fetch(`${API_BASE_URL}/api/Grupos/${id}`, requestOptions()), 'Erro ao buscar grupo.');
    },
    async createGrupo(data) {
        return ensureOk(await fetch(`${API_BASE_URL}/api/Grupos`, requestOptions('POST', data)), 'Erro ao criar grupo.');
    },
    async updateGrupo(id, data) {
        return ensureOk(await fetch(`${API_BASE_URL}/api/Grupos/${id}`, requestOptions('PATCH', data)), 'Erro ao atualizar grupo.');
    },
    async deleteGrupo(id) {
        await ensureOk(await fetch(`${API_BASE_URL}/api/Grupos/${id}`, requestOptions('DELETE', data)), 'Erro ao excluir grupo.');
        return true;
    },
};
