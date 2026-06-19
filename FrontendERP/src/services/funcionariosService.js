const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};

export const funcionariosService = {
    getFuncionarios: async () => {
        const response = await fetch(`${API_URL}/api/funcionarios`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Erro ao buscar funcionários');
        return await response.json();
    },

    getFuncionarioById: async (id) => {
        const response = await fetch(`${API_URL}/api/funcionarios/${id}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Erro ao buscar funcionário');
        return await response.json();
    },

    createFuncionario: async (data) => {
        const response = await fetch(`${API_URL}/api/funcionarios`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Erro ao criar funcionário');
        }
    },

    updateFuncionario: async (id, data) => {
        const response = await fetch(`${API_URL}/api/funcionarios/${id}`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Erro ao atualizar funcionário');
        }
    },

    deleteFuncionario: async (id) => {
        const response = await fetch(`${API_URL}/api/funcionarios/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Erro ao deletar funcionário');
        }
    }
};
