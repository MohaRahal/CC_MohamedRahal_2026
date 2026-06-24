const API_BASE_URL = import.meta.env.VITE_API_URL;


export const formasPagamentoService = {
    getFormasPagamento: async (token) => {
        const response = await fetch(`${API_BASE_URL}/api/FormasPagamento`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        return response.json();
    },
    createFormaPagamento: async (token, data) => {
        const response = await fetch(`${API_BASE_URL}/api/FormasPagamento`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Erro ao criar forma de pagamento");
        return response.json().catch(() => null);
    },
    deleteFormaPagamento: async (token, id) => {
        const response = await fetch(`${API_BASE_URL}/api/FormasPagamento/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error("Erro ao excluir forma de pagamento");
        return response.json().catch(() => null);
    },
    updateFormaPagamento: async (token, id, data) => {
        const response = await fetch(`${API_BASE_URL}/api/FormasPagamento/${id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Erro ao atualizar forma de pagamento");
        return response.json().catch(() => null);
    }

};
