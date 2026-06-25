const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};

export const transportadoresService = {
    getTransportadores: async () => {
        const response = await fetch(`${API_URL}/api/transportadores`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Erro ao buscar transportadores');
        return await response.json();
    },

    getTransportadorById: async (id) => {
        const response = await fetch(`${API_URL}/api/transportadores/${id}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Erro ao buscar transportador');
        return await response.json();
    },

    createTransportador: async (data) => {
        const response = await fetch(`${API_URL}/api/transportadores`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Erro ao criar transportador');
        }
        try {
            return await response.json();
        } catch {
            return null;
        }
    },

    updateTransportador: async (id, data) => {
        const response = await fetch(`${API_URL}/api/transportadores/${id}`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Erro ao atualizar transportador');
        }
    },

    deleteTransportador: async (id) => {
        const response = await fetch(`${API_URL}/api/transportadores/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Erro ao excluir transportador');
        }
    }
};