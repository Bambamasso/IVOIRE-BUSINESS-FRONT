"use client";
import { useState, useEffect } from "react";
import AdminLayout from "../layaut";
import ServiceRequestList from "@/components/modal/service_request_list";

import axios from "axios";

export default function ServicesRequestsPage() {
  const [activeTab, setActiveTab] = useState("pending");
  const [counts, setCounts] = useState({});

  const tabs = [
    {
      id: "pending",
      label: "En attente",
      route: "/api/admin/service-requests/pending",
    },
    {
      id: "validated",
      label: "Validées",
      route: "/api/admin/service-requests/validated",
    },
    {
      id: "in-progress",
      label: "En cours",
      route: "/api/admin/service-requests/in-progress",
    },
    {
      id: "completed",
      label: "Terminées",
      route: "/api/admin/service-requests/completed",
    },
    {
      id: "rejected",
      label: "Refusées",
      route: "/api/admin/service-requests/rejected",
    },
  ];

  const currentTab = tabs.find((t) => t.id === activeTab);

  useEffect(() => {
    const fetchCounts = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = JSON.parse(localStorage.getItem("admin_token"));
      // Un seul appel qui renvoie les 3 compteurs.
      try {
        const response = await axios.get(
          `${baseUrl}/api/admin/service-requests/count`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setCounts(response.data?.data || {});
      } catch (err) {
        setCounts({});
      }
    };
    fetchCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                  ? "bg-[#93b86a] text-white shadow-md shadow-[#93b86a]/20"
                  : "text-gray-400 hover:bg-[#e8d393]/10 hover:text-[#e8d393]"
              }`}
            >
              {tab.label.toUpperCase()}{" "}
              {typeof counts[tab.id] !== "undefined" && (
                <span className="ml-1 text-xs font-bold">
                  ({counts[tab.id]})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Appel du composant avec la route dynamique */}
        <ServiceRequestList route={currentTab.route} />
      </div>
    </AdminLayout>
  );
}
