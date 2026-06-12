const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5038";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : ""
    };
};

export const usersService = {
    getUsers: async () => {
        const response = await fetch(`${API_URL}/api/users`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Erro ao buscar usuários");
        return await response.json();
    },

    createUser: async (userData) => {
        const response = await fetch(`${API_URL}/api/users`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || "Erro ao criar usuário");
        }
        return await response.json();
    },

    updateUser: async (id, userData) => {
        const response = await fetch(`${API_URL}/api/users/${id}`, {
            method: "PATCH",
            headers: getAuthHeaders(),
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || "Erro ao atualizar usuário");
        }
    },

    deleteUser: async (id) => {
        const response = await fetch(`${API_URL}/api/users/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || "Erro ao deletar usuário");
        }
    }
};
