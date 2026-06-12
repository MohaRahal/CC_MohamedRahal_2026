const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5038";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : ""
    };
};

export const vendasService = {
    getVendas: async () => {
        const response = await fetch(`${API_URL}/api/nfe`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Erro ao buscar vendas/nfe");
        return await response.json();
    }
};
