const API_URL = import.meta.env.VITE_API_URL;


const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : ""
    };
};

export const produtosService = {
    
    getProdutos: async () => {
        const response = await fetch(`${API_URL}/api/produtos`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Erro ao buscar produtos");
        return await response.json();
    },

    
    getProdutoById: async (id) => {
        const response = await fetch(`${API_URL}/api/produtos/${id}`, {
            method: "GET",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Erro ao buscar produto");
        return await response.json();
    },

   
    createProduto: async (produtoData) => {
        const response = await fetch(`${API_URL}/api/produtos`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(produtoData),
        });
        if (!response.ok) throw new Error("Erro ao criar produto");
        
      
        try {
            return await response.json();
        } catch {
            return true;
        }
    },

   
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
            return true; 
        }
    },

   
    deleteProduto: async (id) => {
        const response = await fetch(`${API_URL}/api/produtos/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error("Erro ao deletar produto");
        return true;
    }
};
