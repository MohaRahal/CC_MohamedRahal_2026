const API_BASE_URL = import.meta.env.VITE_API_URL;

export const condicoesPagamentosService = {
    getCondicoesPagamentos: async (token) => {
        const response = await fetch(`${API_BASE_URL}/api/CondicoesPagamento`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        return response.json();
    },
    getCondicaoPagamento: async (token, id) => {
        const response = await fetch(`${API_BASE_URL}/api/CondicoesPagamento/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        return response.json();
    },
    createCondicaoPagamento: async (token, data) => {
        const response = await fetch(`${API_BASE_URL}/api/CondicoesPagamento`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Erro ao criar condição de pagamento");
        return response.json().catch(() => null);
    },
    updateCondicaoPagamento: async (token, id, data) => {
        const response = await fetch(`${API_BASE_URL}/api/CondicoesPagamento/${id}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Erro ao atualizar condição de pagamento");
        return response.ok;
    },
    deleteCondicoesPagamento: async (token, id) => {
        const response = await fetch(`${API_BASE_URL}/api/CondicoesPagamento/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error("Erro ao excluir condição de pagamento");
        return response.ok;
    }
};