"use client";

import AdminLayout from "../layaut";
import { useState } from "react";
import OrdersList from "@/components/modal/orders_list";

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("pending");

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
  //

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
                    ? "bg-[#93b86a] text-white shadow-md shadow-[#93b86a]/20" /* Utilisation du vert principal */
                    : "text-gray-400 hover:bg-[#e8d393]/10 hover:text-[#e8d393]"
                }`}
              >
                {tab.label.toUpperCase()}
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
