const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : ""
    };
};

export const fornecedoresService = {
    getFornecedores: async () => {
        const response = await fetch(`${API_URL}/api/fornecedores`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Erro ao buscar fornecedores");
        return await response.json();
    },
    getFornecedorById: async (id) => {
        const response = await fetch(`${API_URL}/api/fornecedores/${id}`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Erro ao buscar fornecedor");
        return await response.json();
    },
    createFornecedor: async (data) => {
        const response = await fetch(`${API_URL}/api/fornecedores`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error("Erro ao criar fornecedor");
        
        // Tratar caso a resposta venha vazia (201 Created ou 204 No Content sem corpo JSON)
        try {
            return await response.json();
        } catch {
            return true;
        }
    },
    updateFornecedor: async (id, data) => {
        const response = await fetch(`${API_URL}/api/fornecedores/${id}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error("Erro ao atualizar fornecedor");
        // PUT usually returns 204 No Content, so we don't return response.json() unconditionally.
        if (response.status !== 204) {
            return await response.json();
        }
        return true;
    },
    deleteFornecedor: async (id) => {
        const response = await fetch(`${API_URL}/api/fornecedores/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Erro ao excluir fornecedor");
        return true;
    }
};
