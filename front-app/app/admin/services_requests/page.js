"use client";
import { useState } from "react";
import AdminLayout from "../layaut";
import ServiceRequestList from "@/components/modal/service_request_list";

export default function ServicesRequestsPage() {
  const [activeTab, setActiveTab] = useState("pending");

  const tabs = [
    {
      id: "pending",
      label: "En attente",
      route: "/api/admin/service-requests/pending",
      color: "text-orange-500",
    },
    {
      id: "completed",
      label: "Terminées",
      route: "/api/admin/service-requests/completed",
      color: "text-[#93b86a]",
    },
    {
      id: "rejected",
      label: "Refusées",
      route: "/api/admin/service-requests/rejected",
      color: "text-red-500",
    },
  ];
  //   const tabs = [
  //   { id: "pending", label: "En attente", color: "#f97316" }, // Orange pour attente
  //   { id: "completed", label: "Terminées", color: "#93b86a" }, // Ton vert
  //   { id: "rejected", label: "Refusées", color: "#ef4444" },   // Rouge
  // ];

  const currentTab = tabs.find((t) => t.id === activeTab);
  return (
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
        <ServiceRequestList
          route={currentTab.route}
          statusColor={currentTab.color}
        />
      </div>
    </AdminLayout>
  );
}
