const API_URL = import.meta.env.VITE_API_URL;

// Pega o token JWT do localStorage para enviar nas requisições protegidas
const getAuthHeaders = () => {
    const token = localStorage.getItem("token"); // Certifique-se de que o Login salva como 'token'
    return {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : ""
    };
};

export const produtosService = {
    // Listar todos os produtos
    getProdutos: async () => {
        const response = await fetch(`${API_URL}/api/produtos`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Erro ao buscar produtos");
        return await response.json();
    },

    // Buscar um produto específico
    getProdutoById: async (id) => {
        const response = await fetch(`${API_URL}/api/produtos/${id}`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Erro ao buscar produto");
        return await response.json();
    },

    // Criar um novo produto
    createProduto: async (produtoData) => {
        const response = await fetch(`${API_URL}/api/produtos`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(produtoData),
        });
        if (!response.ok) throw new Error("Erro ao criar produto");
        
        // Se a API retornar um objeto JSON com o produto criado, ele retorna aqui
        try {
            return await response.json();
        } catch {
            return true;
        }
    },

    // Atualizar produto existente (uso PATCH ou PUT conforme sua API)
    updateProduto: async (id, produtoData) => {
        const response = await fetch(`${API_URL}/api/produtos/${id}`, {
            method: "PATCH",
            headers: getAuthHeaders(),
            body: JSON.stringify(produtoData),
        });
        if (!response.ok) throw new Error("Erro ao atualizar produto");
        try {
            return await response.json();
        } catch {
            return true; // Para quando a API retorna 204 No Content
        }
    },

    // Deletar um produto
    deleteProduto: async (id) => {
        const response = await fetch(`${API_URL}/api/produtos/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Erro ao deletar produto");
        return true;
    }
};
