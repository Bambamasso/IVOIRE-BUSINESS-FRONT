"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../layaut";
import axios from "axios";
import Link from "next/link";
import {
  RiShoppingBag3Line,
  RiFileList3Line,
  RiTimeLine,
  RiAlertLine,
  RiMoneyDollarCircleLine,
} from "react-icons/ri";

const STATUS_COLORS = {
  pending: "bg-amber-100 text-amber-700",
  validated: "bg-blue-100 text-blue-700",
  delivered: "bg-[#93b86a]/10 text-[#93b86a]",
  cancelled: "bg-red-100 text-red-600",
  "in-progress": "bg-blue-100 text-blue-700",
  completed: "bg-[#93b86a]/10 text-[#93b86a]",
};

function formatFCFA(amount) {
  return `${Number(amount || 0).toLocaleString("fr-FR")} FCFA`;
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Dasboard() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [stats, setStats] = useState({
    products: { total: 0, out_of_stock: 0 },
    orders: { total: 0, revenue: 0 },
    services: { pending: 0 },
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentServiceRequests, setRecentServiceRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("admin_token"));
        const response = await axios.get(`${baseUrl}/api/admin/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        const { stats, recent_orders, recent_service_requests } =
          response.data.data;
        setStats(stats);
        setRecentOrders(recent_orders || []);
        setRecentServiceRequests(recent_service_requests || []);
      } catch (error) {
        console.error("Erreur lors du chargement du tableau de bord :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [baseUrl]);

  const kpis = [
    {
      label: "Nombre total de produits",
      value: stats.products.total,
      icon: RiShoppingBag3Line,
      color: "text-[#93b86a]",
    },
    {
      label: "Nombre total de commandes",
      value: stats.orders.total,
      icon: RiFileList3Line,
      color: "text-[#e8d393]",
    },
    {
      label: "Demandes de service en attente",
      value: stats.services.pending,
      icon: RiTimeLine,
      color: "text-amber-500",
    },
    {
      label: "Produits en rupture de stock",
      value: stats.products.out_of_stock,
      icon: RiAlertLine,
      color: "text-red-500",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div
                key={kpi.label}
                className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {kpi.label}
                  </span>
                  <Icon className={kpi.color} size={20} />
                </div>
                <h3 className={`text-2xl font-bold ${kpi.color}`}>
                  {loading ? "—" : kpi.value}
                </h3>
              </div>
            );
          })}
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Chiffre d&apos;affaires (commandes payées)
            </span>
            <RiMoneyDollarCircleLine className="text-[#93b86a]" size={20} />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mt-1">
            {loading ? "—" : formatFCFA(stats.orders.revenue)}
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900">
                Dernières commandes
              </h3>
              <Link
                href="/admin/orders"
                className="text-xs font-bold text-[#93b86a] hover:underline"
              >
                Voir tout
              </Link>
            </div>
            {loading ? (
              <p className="text-sm text-gray-400">Chargement...</p>
            ) : recentOrders.length === 0 ? (
              <p className="text-sm text-gray-400">
                Aucune commande pour le moment.
              </p>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {order.first_name} {order.last_name}
                      </p>
                      <p className="text-xs text-gray-400 font-medium">
                        {order.order_number} • {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">
                        {formatFCFA(order.total_amount)}
                      </p>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          STATUS_COLORS[order.status?.code] ||
                          "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {order.status?.name || "—"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900">
                Dernières demandes de service
              </h3>
              <Link
                href="/admin/services_requests"
                className="text-xs font-bold text-[#93b86a] hover:underline"
              >
                Voir tout
              </Link>
            </div>
            {loading ? (
              <p className="text-sm text-gray-400">Chargement...</p>
            ) : recentServiceRequests.length === 0 ? (
              <p className="text-sm text-gray-400">
                Aucune demande pour le moment.
              </p>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentServiceRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {request.full_name}
                      </p>
                      <p className="text-xs text-gray-400 font-medium">
                        {request.service?.name} •{" "}
                        {formatDate(request.created_at)}
                      </p>
                    </div>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        STATUS_COLORS[request.status?.code] ||
                        "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {request.status?.name || "—"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
