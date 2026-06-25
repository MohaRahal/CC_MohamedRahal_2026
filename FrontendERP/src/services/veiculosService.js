const API_BASE_URL = import.meta.env.VITE_API_URL;


const getAuthHeaders = (token) => ({
    headers: {
        'Authorization': `Bearer ${token}`
    }
})

export  class veiculosService {
    static async getVeiculos(token) {
        const response = await fetch(`${API_BASE_URL}/api/veiculos`, getAuthHeaders(token));
        if (!response.ok) {
            throw new Error('Erro ao buscar veiculos');
        }
        return response.json();
    }

    static async deleteVeiculo(token, id) {
        const response = await fetch(`${API_BASE_URL}/veiculos/${id}`, {
            ...getAuthHeaders(token),
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Erro ao deletar veiculo');
        }
        return response.json();
    }

    static async createVeiculo(token, veiculo) {
        const response = await fetch(`${API_BASE_URL}/veiculos`, {
            ...getAuthHeaders(token),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(token).headers
            },
            body: JSON.stringify(veiculo)
        });
        if (!response.ok) {
            throw new Error('Erro ao criar veiculo');
        }
        return response.json();
    }

    static async updateVeiculo(token, id, veiculo) {
        const response = await fetch(`${API_BASE_URL}/veiculos/${id}`, {
            ...getAuthHeaders(token),
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders(token).headers
            },
            body: JSON.stringify(veiculo)
        });
        if (!response.ok) {
            throw new Error('Erro ao atualizar veiculo');
        }
        return response.json();
    }
}