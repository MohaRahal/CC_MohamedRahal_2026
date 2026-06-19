const API_BASE_URL = import.meta.env.VITE_API_URL;

export const cargosService = {
    getCargos: async (token) => {
        const response = await fetch(`${API_BASE_URL}/api/cargos`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
        });
        if (!response.ok) throw new Error("Erro ao buscar cargos");
        return response.json();
    },

    getCargoById: async (token, id) => {
        const response = await fetch(`${API_BASE_URL}/api/cargos/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
        });
        if (!response.ok) throw new Error("Erro ao buscar cargo");
        return response.json();
    },

    createCargo: async (token, cargoData) => {
        const response = await fetch(`${API_BASE_URL}/api/cargos`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cargoData),
        });
        if (!response.ok) throw new Error("Erro ao criar cargo");
        return response.json().catch(() => null);
    },

    updateCargo: async (token, id, cargoData) => {
        const response = await fetch(`${API_BASE_URL}/api/cargos/${id}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cargoData),
        });
        if (!response.ok) throw new Error("Erro ao atualizar cargo");
        return true;
    },

    deleteCargo: async (token, id) => {
        const response = await fetch(`${API_BASE_URL}/api/cargos/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error("Erro ao deletar cargo");
        return true;
    }
};
