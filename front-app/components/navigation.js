"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useCart } from "../app/context/CartContext";
import Link from "next/link";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { CiSearch } from "react-icons/ci";
import axios from "axios";
import { useRouter } from "next/navigation";
import { CiUser } from "react-icons/ci";
import { SlBasket } from "react-icons/sl";

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    isAuthenticated,
    setIsAuthenticated,
    getTotalItems,
    syncCartOnLogin,
    loadCartFromLocalStorage,
  } = useCart();

  useEffect(() => {
    setIsClient(true);
    const storedToken = localStorage.getItem("token");
    setIsAuthenticated(!!storedToken);

    // Pousse un état dans l'historique pour bloquer le retour après logout
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        window.history.pushState(null, "", window.location.href);
        router.replace("/login");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [router, setIsAuthenticated]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const handleLogout = async () => {
    const storedToken = localStorage.getItem("token");
    let token = null;
    if (storedToken) {
      try {
        token = JSON.parse(storedToken);
      } catch {
        token = storedToken;
      }
    }

    if (!token) {
      setIsAuthenticated(false);
      localStorage.removeItem("token");
      localStorage.removeItem("cart"); // S'assurer que le panier local est vidé
      loadCartFromLocalStorage(); // Recharger le panier local vide
      router.push("/login");
      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const url = baseUrl + "/api/logout";

    try {
      const response = await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      if (response.data.status === "success") {
        localStorage.removeItem("token");
        localStorage.removeItem("cart");
        setIsAuthenticated(false);
        loadCartFromLocalStorage();
        router.replace("/");
      } else {
        console.error("Erreur lors de la déconnexion");
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
      // En cas d’erreur, on nettoie quand même le front
      localStorage.removeItem("token");
      localStorage.removeItem("cart");
      setIsAuthenticated(false);
      loadCartFromLocalStorage();
      router.replace("/");
    }
  };

  const cartItemCount = getTotalItems();

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Intellect I-B */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image src="/images/Logo.png" alt="Logo Intellect Ivoire-Business" width={120} height={40} style={{objectFit:'contain'}} />
            </Link>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-8 flex-1 ml-12">
            <Link
              href="#about"
              className="text-gray-600 hover:text-[#93b86a] font-medium transition-colors"
            >
              À Propos
            </Link>
            {/* <Link
              href="/services"
              className="text-gray-600 hover:text-[#93b86a] font-medium transition-colors"
            >
              Services
            </Link> */}
            <Link
              href="/home/contact"
              className="text-gray-600 hover:text-[#93b86a] font-medium transition-colors"
            >
              Contact
            </Link>

            {/* Barre de recherche stylisée */}
            <form onSubmit={handleSearch} className="relative flex-1 max-w-xs">
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 focus-within:border-[#93b86a] transition-all">
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none text-sm text-gray-700 w-full"
                />
                <button
                  type="submit"
                  className="text-gray-400 hover:text-[#93b86a]"
                >
                  <CiSearch size={20} />
                </button>
              </div>
            </form>
          </div>

          {/* Actions à droite */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Panier avec ton Doré #e8d393 */}
            <Link
              href="/vente/cart"
              className="relative text-gray-700 hover:text-[#93b86a] transition-all p-2"
            >
              <SlBasket size={24} />
              {isClient && cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#e8d393] text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                  {cartItemCount > 9 ? "9+" : cartItemCount}
                </span>
              )}
            </Link>

            {/* Connexion / Profil
            {isClient &&
              (!isAuthenticated ? (
                <Link
                  href="/login"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-[#93b86a]"
                >
                  <CiUser size={22} />
                  <span>Connexion</span>
                </Link>
              ) : (
                <div className="flex items-center gap-4">
                  <Link
                    href="/profil"
                    className="text-gray-700 hover:text-[#93b86a]"
                  >
                    <CiUser size={24} />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-xs font-bold text-red-500 uppercase tracking-wider"
                  >
                    Déconnexion
                  </button>
                </div>
              ))} */}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="p-2 text-[#93b86a]">
              {isOpen ? <HiX size={28} /> : <HiMenuAlt3 size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Design Chaleureux */}
      <div
        className={`md:hidden bg-white border-t border-gray-100 transition-all duration-300 ${isOpen ? "max-h-screen pb-6" : "max-h-0 overflow-hidden"}`}
      >
        <div className="px-4 pt-4 space-y-4">
          <Link
            href="/a-propos"
            onClick={toggleMenu}
            className="block text-lg font-medium text-gray-800"
          >
            À Propos
          </Link>
          <Link
            href="/services"
            onClick={toggleMenu}
            className="block text-lg font-medium text-gray-800"
          >
            Services
          </Link>
          <Link
            href="/contact"
            onClick={toggleMenu}
            className="block text-lg font-medium text-gray-800"
          >
            Contact
          </Link>
          <Link
            href="/cart"
            onClick={toggleMenu}
            className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
          >
            <span className="font-medium">Mon Panier</span>
            <span className="bg-[#e8d393] text-white px-3 py-1 rounded-full text-xs">
              {cartItemCount} articles
            </span>
          </Link>
          {/* {!isAuthenticated && (
            <Link
              href="/login"
              onClick={toggleMenu}
              className="block w-full text-center py-3 bg-[#93b86a] text-white rounded-xl font-bold"
            >
              Se connecter
            </Link>
          )} */}
        </div>
      </div>
    </nav>
  );
}
