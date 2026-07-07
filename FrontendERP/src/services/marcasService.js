const API_BASE_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = (token) => ({
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

export const marcasService = {
    async getMarcas(token) {
        const response = await fetch(`${API_BASE_URL}/api/Marcas`, getAuthHeaders(token));
        if (!response.ok) throw new Error("Erro ao buscar marcas");
        return response.json();
    },

    async getMarcaById(id) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/Marcas/${id}`, getAuthHeaders(token));
        if (!response.ok) throw new Error("Erro ao buscar marca");
        return response.json();
    },

    async createMarca(data) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/Marcas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(token).headers
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error("Erro ao criar marca");
        return response.json();
    },

    async updateMarca(id, data) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/Marcas/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(token).headers
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error("Erro ao atualizar marca");
        // Verifica se a resposta tem conteúdo antes de fazer json()
        if (response.status === 204 || response.headers.get('content-length') === '0') {
            return { success: true };
        }
        return response.json();
    },

    async deleteMarca(id) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/Marcas/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(token).headers
        });
        if (!response.ok) throw new Error("Erro ao deletar marca");
        return true;
    }
};
