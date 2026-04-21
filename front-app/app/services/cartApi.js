import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;


const getAuthToken = () => {
  if (typeof window !== "undefined" && window.localStorage) {
    const token = localStorage.getItem("token");
    return token ? JSON.parse(token) : null;
  }
  return null;
};

if (typeof window !== "undefined") {
  console.log("Token:", getAuthToken());
}

const getHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const cartApi = {
  // Récupérer le panier (SEULEMENT pour utilisateurs connectés)
  async getCart() {
    try {
      const response = await axios.get(`${API_URL}/api/users/carts`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Erreur getCart:", error);
      throw error;
    }
  },

  // Ajouter un produit
  async addToCart(productId, variantId, quantity) {
    try {
      const response = await axios.post(
        `${API_URL}/api/users/carts`,
        {
          product_id: productId,
          product_variant_id: variantId,
          quantity: quantity,
        },
        {
          headers: getHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erreur addToCart:", error);
      throw error;
    }
  },

  // Mettre à jour la quantité
  async updateQuantity(itemId, quantity) {
    try {
      const response = await axios.put(
        `${API_URL}/api/users/carts/${itemId}`,
        { quantity },
        {
          headers: getHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erreur updateQuantity:", error);
      throw error;
    }
  },

  // Supprimer un item
  async removeItem(itemId) {
    try {
      const response = await axios.delete(
        `${API_URL}/api/users/carts/${itemId}`,
        {
          headers: getHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erreur removeItem:", error);
      throw error;
    }
  },

  // Vider le panier
  async clearCart() {
    try {
      const response = await axios.delete(
        `${API_URL}/api/users/carts/clear`,
        {
          headers: getHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erreur clearCart:", error);
      throw error;
    }
  },
};
