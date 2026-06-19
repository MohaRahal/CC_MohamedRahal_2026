const API_BASE_URL = import.meta.env.VITE_API_URL;

export const estadosService = {
    getEstados: async (token) => {
        const response = await fetch(`${API_BASE_URL}/api/estados`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
        });
        if (!response.ok) throw new Error("Erro ao buscar estados");
        return response.json();
    },

    getEstadoById: async (token, codEstado) => {
        const response = await fetch(`${API_BASE_URL}/api/estados/${codEstado}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
        });
        if (!response.ok) throw new Error("Erro ao buscar estado");
        return response.json();
    },

    createEstado: async (token, estadoData) => {
        const response = await fetch(`${API_BASE_URL}/api/estados`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(estadoData),
        });
        if (!response.ok) throw new Error("Erro ao criar estado");
        return response.json().catch(() => null);
    },

    updateEstado: async (token, codEstado, estadoData) => {
        const response = await fetch(`${API_BASE_URL}/api/estados/${codEstado}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(estadoData),
        });
        if (!response.ok) throw new Error("Erro ao atualizar estado");
        return true;
    },

    deleteEstado: async (token, codEstado) => {
        const response = await fetch(`${API_BASE_URL}/api/estados/${codEstado}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error("Erro ao deletar estado");
        return true;
    }
};
