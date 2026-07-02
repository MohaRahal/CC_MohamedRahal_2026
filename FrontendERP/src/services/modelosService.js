const API_BASE_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = (token) => ({
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

export const modelosService = {
    async getModelos(token) {
        const response = await fetch(`${API_BASE_URL}/api/Modelos`, getAuthHeaders(token));
        return response.json();
    },

    async createModelo(token, data) {
        const response = await fetch(`${API_BASE_URL}/api/Modelos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(token).headers
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error("Erro ao criar modelo");
        return response.json();
    }
};
