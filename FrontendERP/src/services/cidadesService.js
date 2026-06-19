const API_BASE_URL = import.meta.env.VITE_API_URL;

export const cidadesService = {
    getCidades: async (token) => {
        const response = await fetch(`${API_BASE_URL}/api/cidades`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
        });
        if (!response.ok) throw new Error("Erro ao buscar cidades");
        return response.json();
    },

    getCidadeById: async (token, codCidade) => {
        const response = await fetch(`${API_BASE_URL}/api/cidades/${codCidade}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
        });
        if (!response.ok) throw new Error("Erro ao buscar cidade");
        return response.json();
    },

    createCidade: async (token, cidadeData) => {
        const response = await fetch(`${API_BASE_URL}/api/cidades`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cidadeData),
        });
        if (!response.ok) throw new Error("Erro ao criar cidade");
        return response.json().catch(() => null);
    },

    updateCidade: async (token, codCidade, cidadeData) => {
        const response = await fetch(`${API_BASE_URL}/api/cidades/${codCidade}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cidadeData),
        });
        if (!response.ok) throw new Error("Erro ao atualizar cidade");
        return true;
    },

    deleteCidade: async (token, codCidade) => {
        const response = await fetch(`${API_BASE_URL}/api/cidades/${codCidade}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error("Erro ao deletar cidade");
        return true;
    }
};
