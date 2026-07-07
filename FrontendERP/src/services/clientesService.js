const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : ""
    };
};

export const clientesService = {
    getClientes: async () => {
        const response = await fetch(`${API_URL}/api/clientes`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Erro ao buscar clientes");
        return await response.json();
    },
    getClienteById: async (id) => {
        const response = await fetch(`${API_URL}/api/clientes/${id}`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Erro ao buscar cliente");
        return await response.json();
    },
    createCliente: async (data) => {
        const response = await fetch(`${API_URL}/api/clientes`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error("Erro ao criar cliente");
        try {
            return await response.json();
        } catch {
            return true;
        }
    },
    updateCliente: async (id, data) => {
        const response = await fetch(`${API_URL}/api/clientes/${id}`, {
            method: "PATCH",
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error("Erro ao atualizar cliente");
        if (response.status !== 204) {
            return await response.json();
        }
        return true;
    },
    deleteCliente: async (id) => {
        const response = await fetch(`${API_URL}/api/clientes/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Erro ao excluir cliente");
        return true;
    }
};
