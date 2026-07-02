const API_BASE_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = (token) => ({
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

export const gruposService = {
    async getGrupos(token) {
        const response = await fetch(`${API_BASE_URL}/api/Grupos`, getAuthHeaders(token));
        return response.json();
    },

    async createGrupo(token, data) {
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
    }
};
