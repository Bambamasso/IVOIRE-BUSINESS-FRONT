"use client";

import axios from "axios";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
// Import des icônes
import { PiPackageLight } from "react-icons/pi";
import { MdRequestPage } from "react-icons/md";
import {
  RiDashboardFill,
  RiUserLine,
  RiSettings4Line,
  RiArrowRightSLine,
  RiLogoutBoxRLine,
  RiNotification3Line,
} from "react-icons/ri";

const adminMenu = [
  { href: "/admin/dashboard", label: "Tableau de bord", icon: RiDashboardFill },
  { href: "/admin/products", label: "Produits", icon: PiPackageLight },
  { href: "/admin/orders", label: "Commandes", icon: RiSettings4Line },
  {
    href: "/admin/services_requests",
    label: "Demande de services",
    icon: MdRequestPage,
  },
  // { href: "/admin/users_manager", label: "Utilisateurs", icon: RiUserLine },
];

const settingsSubMenu = [
  { href: "/admin/categories", label: "Catégories" },
  { href: "/admin/services", label: "Services" },
   { href: "/admin/projects", label: "Projets" },
  { href: "/admin/silder", label: "Bannières" },
 
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  // États de sécurité
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // 1. VERIFICATION DE L'AUTHENTIFICATION AU MONTAGE
  useEffect(() => {
    const checkAuth = () => {
      const stored = localStorage.getItem("admin_token");
      if (!stored) {
        router.replace("/admin/login");
      } else {
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  // État pour ouvrir/fermer le menu paramètres
  const [isSettingsOpen, setIsSettingsOpen] = useState(
    pathname.includes("/admin/categories") ||
    pathname.includes("/admin/services"),
  );

  // Titre dynamique
  const currentPageTitle = useMemo(() => {
    const allItems = [...adminMenu, ...settingsSubMenu];
    const current = allItems.find((item) => pathname.startsWith(item.href));
    return current ? current.label : "Administration";
  }, [pathname]);

  // 2. LOGIQUE DE DÉCONNEXION RENFORCÉE
  const handleLogout = async (e) => {
    e.preventDefault();
    setIsLoggingOut(true);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const stored = localStorage.getItem("admin_token");
    let token = null;

    try {
      token = stored ? JSON.parse(stored) : null;
    } catch {
      token = stored;
    }

    try {
      if (token) {
        await axios.post(
          `${baseUrl}/api/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          },
        );
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion API", error);
    } finally {
      localStorage.removeItem("admin_token");
      window.location.href = "/admin/login";
    }
  };

  // Affichage d'un écran de chargement neutre pour éviter de voir le dashbord sans accès
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#93b86a] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium animate-pulse">
            Vérification de l'accès...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950 flex font-sans text-gray-900">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-72 flex-col bg-gray-900 text-gray-100 shadow-xl border-r border-gray-800">
        <div className="h-20 flex items-center px-8 border-b border-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#93b86a] rounded-lg flex items-center justify-center">
              <span className="font-black text-white">I</span>
            </div>
            <span className="text-xl font-bold tracking-tight uppercase">
              Ivoire <span className="text-[#93b86a]">Admin</span>
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <p className="px-4 text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-4">
            Menu Principal
          </p>

          {adminMenu.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                  active
                    ? "bg-[#93b86a]/10 text-[#93b86a] border-l-4 border-[#93b86a]"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={22}
                    className={
                      active ? "text-[#93b86a]" : "group-hover:text-white"
                    }
                  />
                  <span className="font-medium text-[15px]">{item.label}</span>
                </div>
                {active && <RiArrowRightSLine size={16} />}
              </Link>
            );
          })}

          <div className="pt-4">
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`group flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200 ${
                isSettingsOpen
                  ? "text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <RiSettings4Line size={22} />
                <span className="font-medium text-[15px]">Paramètres</span>
              </div>
              <RiArrowRightSLine
                size={16}
                className={`transition-transform duration-300 ${isSettingsOpen ? "rotate-90" : ""}`}
              />
            </button>

            <div
              className={`mt-2 ml-9 space-y-1 overflow-hidden transition-all duration-300 ${
                isSettingsOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {settingsSubMenu.map((subItem) => {
                const subActive = pathname === subItem.href;
                return (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    className={`block px-4 py-2 text-sm rounded-lg transition-colors ${
                      subActive
                        ? "text-[#93b86a] font-bold"
                        : "text-gray-500 hover:text-gray-200"
                    }`}
                  >
                    {subItem.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        <div className="px-4 py-6 border-t border-gray-800">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 disabled:opacity-50"
          >
            <RiLogoutBoxRLine size={20} />
            {isLoggingOut ? "Déconnexion..." : "Se déconnecter"}
          </button>
          <div className="mt-6 px-4 text-[11px] text-gray-500 text-center uppercase tracking-widest">
            © {new Date().getFullYear()} • Ivoire Business
          </div>
        </div>
      </aside>

      {/* Main Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-8 sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
              {currentPageTitle}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Espace de gestion sécurisé
            </p>
          </div>

          <div className="flex items-center gap-6">
            <button className="p-2 text-gray-400 hover:text-[#93b86a] transition-colors relative">
              <RiNotification3Line size={24} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-10 w-[1px] bg-gray-200"></div>
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                  Admin Principal
                </p>
                <p className="text-[11px] text-[#93b86a] font-bold uppercase tracking-tighter">
                  Super Utilisateur
                </p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-[#93b86a] shadow-lg shadow-[#93b86a]/30 text-white flex items-center justify-center text-lg font-black border-2 border-white">
                A
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#F8FAFC] dark:bg-gray-950 p-8">
          <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
