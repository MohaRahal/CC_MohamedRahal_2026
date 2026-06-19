const API_URL = import.meta.env.VITE_API_URL ;

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : ""
    };
};

export const movimentacoesService = {
    getMovimentacoes: async () => {
        const response = await fetch(`${API_URL}/api/movimentacoes`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Erro ao buscar movimentações");
        return await response.json();
    },

    createAjusteManual: async (movimentacaoData) => {
        const response = await fetch(`${API_URL}/api/movimentacoes`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(movimentacaoData),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || "Erro ao criar movimentação");
        }
        return await response.json();
    }
};
