const API_BASE_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = (token) => ({
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

export const unidadeMedidasService = {
    async getUnidades(token) {
        const response = await fetch(`${API_BASE_URL}/api/UnidadeMedidas`, getAuthHeaders(token));
        return response.json();
    },

    async createUnidade(token, data) {
        const response = await fetch(`${API_BASE_URL}/api/UnidadeMedidas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(token).headers
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error("Erro ao criar unidade de medida");
        try {
            return await response.json();
        } catch {
            return { unidade: data.unidade };
        }
    }
};
