const API_BASE_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = (token) => ({
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

export const gruposService = {
    async getGrupos(token) {
        const response = await fetch(`${API_BASE_URL}/api/Grupos`, getAuthHeaders(token));
        if (!response.ok) throw new Error("Erro ao buscar grupos");
        return response.json();
    },

    async getGrupoById(id) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/Grupos/${id}`, getAuthHeaders(token));
        if (!response.ok) throw new Error("Erro ao buscar grupo");
        return response.json();
    },

    async createGrupo(data) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/Grupos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(token).headers
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error("Erro ao criar grupo");
        return response.json();
    },

    async updateGrupo(id, data) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/Grupos/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(token).headers
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error("Erro ao atualizar grupo");
        return response.json();
    },

    async deleteGrupo(id) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/Grupos/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(token).headers
        });
        if (!response.ok) throw new Error("Erro ao deletar grupo");
        return true;
    }
};
