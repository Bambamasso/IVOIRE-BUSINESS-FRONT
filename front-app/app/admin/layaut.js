"use client";

import axios from "axios";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const adminMenu = [
  { href: "/admin/dashboard", label: "Tableau de bord" },
  { href: "/admin/products", label: "Produits" },
  { href: "/admin/users_manager", label: "Utilisateurs" },
  { href: "/admin/categories", label: "Categories" },
  // { href: "/admin/settings", label: "Paramètres" },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const handleLogout = async (e) => {
    e.preventDefault();
    setIsLoggingOut(true);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const url = baseUrl + "/api/logout";
    const stored = localStorage.getItem("admin_token");
    let token = null;
    if (stored) {
      try {
        token = JSON.parse(stored);
      } catch {
        token = stored;
      }
    }
    if (!token) {
      // Pas de token valide : nettoyer et rediriger
      localStorage.removeItem("admin_token");
      router.push("/admin/login");
      setIsLoggingOut(false);
      return;
    }
    
    try {
      
      const response = await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      
      if (response.data.status === "success") {
        localStorage.removeItem("admin_token");
        router.push("/admin/login");
       
      } else {
        console.error("Erreur lors de la déconnexion");
        localStorage.removeItem("admin_token");
        router.push("/admin/login");
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
      localStorage.removeItem("admin_token");
      router.push("/admin/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex">
        {/* Sidebar */}
        <aside className="hidden md:flex md:w-64 flex-col bg-gray-900 text-gray-100">
          <div className="h-16 flex items-center px-6 border-b border-gray-800">
            <span className="text-lg font-bold">Ivoire Admin</span>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1">
            {adminMenu.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-sm font-medium ${
                    active
                      ? "bg-blue-600 text-white"
                      : "text-gray-200 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="mt-2 w-full text-left px-3 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700 text-white disabled:opacity-60"
              aria-label="Se déconnecter"
            >
              {isLoggingOut ? "Déconnexion..." : "Déconnexion"}
            </button>
          </nav>
          <div className="px-4 py-3 border-t border-gray-800 text-xs text-gray-400">
            {new Date().getFullYear()} Ivoire Business
          </div>
        </aside>

        {/* Partie principale */}
        <div className="flex-1 flex flex-col">
          
          <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 md:px-6">
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                Tableau de bord
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Vue d’ensemble de votre plateforme.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-xs text-gray-500 dark:text-gray-400">
                Admin connecté
              </span>
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                A
              </div>
            </div>
          </header>

          {/* Contenu */}
          <main className="flex-1 px-4 md:px-6 py-4 md:py-6">{children}</main>
        </div>
      </div>
    </>
  );
}
