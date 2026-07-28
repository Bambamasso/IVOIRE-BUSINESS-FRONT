"use client";

import AdminLayout from "../layaut";
import { useState, useEffect } from "react";
import OrdersList from "@/components/modal/orders_list";
import axios from "axios";

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("pending");
  const [counts, setCounts] = useState({});

  const tabs = [
    {
      id: "pending",
      label: "En attente",
      route: "/api/admin/orders/orders-pending",
      color: "text-orange-500",
    },
    {
      id: "validated",
      label: "Validées",
      route: "/api/admin/orders/orders-validated",
      color: "text-[#93b86a]",
    },
    {
      id: "delivered",
      label: "Livréees",
      route: "/api/admin/orders/orders-delivered",
      color: "text-red-500",
    },
    {
      id: "canceled",
      label: "Annulées",
      route: "/api/admin/orders/orders-canceled",
      color: "text-red-500",
    },
  ];

  const currentTab = tabs.find((t) => t.id === activeTab);

  // Récupérer le nombre de commandes pour chaque statut
  useEffect(() => {
    const fetchCounts = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = JSON.parse(localStorage.getItem("admin_token"));
      const newCounts = {};
      for (const tab of tabs) {
        try {
          const response = await axios.get(`${baseUrl}${tab.route}?page=1`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          // On suppose que la pagination existe et que le total est dans response.data.data.total
          newCounts[tab.id] = response.data?.data?.total || 0;
        } catch (err) {
          newCounts[tab.id] = 0;
        }
      }
      setCounts(newCounts);
    };
    fetchCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <AdminLayout>
        <div className="space-y-8">
          {/* Navigation des Onglets */}
          <div className="flex gap-4 bg-white p-2 rounded-[24px] shadow-sm border border-gray-100 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl text-xs font-black transition-all ${
                  activeTab === tab.id
                    ? "bg-[#93b86a] text-white shadow-md shadow-[#93b86a]/20"
                    : "text-gray-400 hover:bg-[#e8d393]/10 hover:text-[#e8d393]"
                }`}
              >
                {tab.label.toUpperCase()} {typeof counts[tab.id] !== "undefined" && (
                  <span className="ml-1 text-xs font-bold">({counts[tab.id]})</span>
                )}
              </button>
            ))}
          </div>

          {/* Appel du composant avec la route dynamique */}
          <OrdersList route={currentTab.route} statusColor={currentTab.color} />
        </div>
      </AdminLayout>
    </>
  );
}
