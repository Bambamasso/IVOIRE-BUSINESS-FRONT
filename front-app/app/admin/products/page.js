"use client";
import { useState, useEffect } from "react";
import AdminLayout from "../layaut";
import ProductForm from "@/components/product_form";
import { RiAddLine, RiSearchLine, RiEyeLine } from "react-icons/ri";
import ProductList from "@/components/modal/product_list";

import axios from "axios";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [handelOpenModal, setHandleOpenModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [refreshFlag, setRefreshFlag] = useState(0);
  const tabs = [
    {
      id: "all",
      label: "Tous",
      route: "/api/admin/products",
      color: "text-orange-500",
    },
    {
      id: "available",
      label: "Disponibles",
      route: "/api/admin/products/available",
      color: "text-[#93b86a]",
    },
    {
      id: "out-of-stock",
      label: "En rupture",
      route: "/api/admin/products/out-of-stock",
      color: "text-red-500",
    },
  ];


  const currentTab = tabs.find((t) => t.id === activeTab);

  // Fonction pour forcer le rafraîchissement de ProductList
  const fetchProducts = () => {
    setRefreshFlag((prev) => prev + 1);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header de section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Catalogue Produits
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              Gérez votre inventaire et vos prix.
            </p>
          </div>
          <button
            onClick={() => setHandleOpenModal(true)}
            className="flex items-center gap-2 bg-[#93b86a] text-white px-6 py-3 rounded-2xl font-black text-xs shadow-lg shadow-[#93b86a]/20 hover:scale-105 transition-transform"
          >
            <RiAddLine size={18} />
            AJOUTER
          </button>
        </div>

        {/* Barre d'outils (Recherche) */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center">
          <div className="relative flex-1 max-w-md">
            <RiSearchLine
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Rechercher un produit, une catégorie..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#93b86a] transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>


        <ProductForm
          isOpen={handelOpenModal}
          onClose={() => setHandleOpenModal(false)}
          refresh={fetchProducts}
        />

        <div className="space-y-8">
          {/* Navigation des Onglets */}
          <div className="flex gap-4 bg-white p-2 rounded-[24px] shadow-sm border border-gray-100 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl text-xs font-black transition-all ${
                  activeTab === tab.id
                    ? "bg-[#93b86a] text-white shadow-md shadow-[#93b86a]/20" /* Utilisation du vert principal */
                    : "text-gray-400 hover:bg-[#e8d393]/10 hover:text-[#e8d393]"
                }`}
              >
                {tab.label.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Appel du composant avec la route dynamique */}
           <ProductList
                  route={currentTab.route}
                  statusColor={currentTab.color}
                  refreshFlag={refreshFlag}
                /> 
        </div>
      </div>
    </AdminLayout>
  );
}
