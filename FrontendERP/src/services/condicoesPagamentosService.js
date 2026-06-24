const API_BASE_URL = import.meta.env.VITE_API_URL;

export const condicoesPagamentosService = {
    async getCondicoesPagamentos() {
        const response = await fetch(`${API_BASE_URL}/api/CondicoesPagamento`);
        return response.json();
    },

    async getCondicaoPagamento(id) {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        return response.json();
    },

    async createCondicaoPagamento(condicaoPagamento) {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(condicaoPagamento),
        });
        return response.json();
    },

    async updateCondicaoPagamento(id, condicaoPagamento) {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(condicaoPagamento),
        });
        return response.json();
    },

    async deleteCondicaoPagamento(id) {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE',
        });
        return response.json();
    },
};