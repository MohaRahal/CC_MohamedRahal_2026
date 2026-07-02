const API_BASE_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = (token) => ({
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

export const marcasService = {
    async getMarcas(token) {
        const response = await fetch(`${API_BASE_URL}/api/Marcas`, getAuthHeaders(token));
        return response.json();
    },

    async createMarca(token, data) {
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
    }
};
