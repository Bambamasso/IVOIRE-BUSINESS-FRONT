"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { cartApi } from "../services/cartApi";

const CartContext = createContext();

const CART_STORAGE_KEY = "cart";
const TOKEN_STORAGE_KEY = "token";

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fonction utilitaire pour récupérer le token
  const getAuthToken = useCallback(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (!stored) return null;
      try { return JSON.parse(stored); } catch { return stored; }
    }
    return null;
  }, []);

  // Charge le panier depuis l'API (utilisateur connecté)
  const loadCartFromAPI = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await cartApi.getCart();
      if (response.status === "success" && response.cart && response.cart.items) {
        const transformedCart = response.cart.items.map(item => ({
          id: item.id, // ID du CartItem en BDD
          productId: item.product_id,
          title: item.product?.title || item.product?.name,
          price: item.price,
          image: item.product?.media?.[0]?.file_path,
          variant: item.product_variant_id ? {
            id: item.product_variant_id,
            attribut_values: item.variant?.attribut_values || []
          } : null,
          quantity: item.quantity
        }));
        setCart(transformedCart);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement du panier API:", error);
      setCart([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Charge le panier depuis le localStorage (utilisateur non connecté)
  const loadCartFromLocalStorage = useCallback(() => {
    setIsLoading(true);
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Erreur lors du chargement du panier localStorage:", error);
        setCart([]);
      }
    } else {
      setCart([]);
    }
    setIsLoading(false);
  }, []);

  // Vérifie l'état d'authentification et charge le panier approprié au montage
  useEffect(() => {
    const token = getAuthToken();
    const authenticated = !!token;
    setIsAuthenticated(authenticated);

    if (authenticated) {
      loadCartFromAPI();
    } else {
      loadCartFromLocalStorage();
    }
  }, [getAuthToken, loadCartFromAPI, loadCartFromLocalStorage]);

  // Sauvegarde le panier dans le localStorage si non connecté
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart, isLoading, isAuthenticated]);

  // Synchronise le panier local avec l'API lors de la connexion
  const syncCartOnLogin = useCallback(async () => {
    const localCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");

    if (localCart.length > 0) {
      try {
        for (const item of localCart) {
          await cartApi.addToCart(
            item.productId,
            item.variant?.id || null,
            item.quantity
          );
        }
        localStorage.removeItem(CART_STORAGE_KEY);
        console.log("Panier local synchronisé et vidé.");
      } catch (error) {
        console.error("Erreur lors de la synchronisation du panier:", error);
      }
    }
    await loadCartFromAPI(); // Recharge le panier depuis l'API pour avoir la version fusionnée
  }, [loadCartFromAPI]);

  // Ajoute un produit au panier
  const addToCart = useCallback(async (product, variant, quantity) => {
    if (isAuthenticated) {
      try {
        await cartApi.addToCart(product.id, variant?.id || null, quantity);
        await loadCartFromAPI();
        return true;
      } catch (error) {
        alert(error.message || 'Erreur lors de l\'ajout au panier API');
        return false;
      }
    } else {
      const itemId = variant ? `${product.id}-${variant.id}` : product.id;
      setCart(prevCart => {
        const existingItem = prevCart.find(item => item.id === itemId);
        if (existingItem) {
          return prevCart.map(item =>
            item.id === itemId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          const newItem = {
            id: itemId,
            productId: product.id,
            title: product.title || product.name,
            price: variant?.price || product.price,
            image: product.media?.[0]?.file_path,
            variant: variant,
            quantity: quantity
          };
          return [...prevCart, newItem];
        }
      });
      return true;
    }
  }, [isAuthenticated, loadCartFromAPI]);

  // Retire un produit du panier
  const removeFromCart = useCallback(async (itemId) => {
    if (isAuthenticated) {
      try {
        await cartApi.removeItem(itemId);
        await loadCartFromAPI();
      } catch (error) {
        alert('Erreur lors de la suppression du panier API');
      }
    } else {
      setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    }
  }, [isAuthenticated, loadCartFromAPI]);

  // Met à jour la quantité d'un produit
  const updateQuantity = useCallback(async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    if (isAuthenticated) {
      try {
        await cartApi.updateQuantity(itemId, newQuantity);
        await loadCartFromAPI();
      } catch (error) {
        alert(error.message || 'Erreur lors de la mise à jour de la quantité API');
      }
    } else {
      setCart(prevCart => prevCart.map(item =>
        item.id === itemId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  }, [isAuthenticated, loadCartFromAPI, removeFromCart]);

  // Vide le panier
  const clearCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        await cartApi.clearCart();
        setCart([]);
      } catch (error) {
        alert('Erreur lors de la suppression du panier API');
      }
    } else {
      setCart([]);
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, [isAuthenticated]);

  // Calcule le total du panier
  const getTotal = useCallback(() => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price);
      return total + price * item.quantity;
    }, 0);
  }, [cart]);

  // Compte le nombre total d'articles
  const getTotalItems = useCallback(() => {
    return cart.length;
  }, [cart]);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      syncCartOnLogin,
      getTotal,
      getTotalItems,
      isLoading,
      isAuthenticated,
      setIsAuthenticated, // Permet de changer l'état d'authentification depuis l'extérieur
      loadCartFromAPI, // Exposer pour recharger le panier API après login/logout
      loadCartFromLocalStorage, // Exposer pour recharger le panier local après logout
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}