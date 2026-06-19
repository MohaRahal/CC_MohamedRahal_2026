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
    }
};
