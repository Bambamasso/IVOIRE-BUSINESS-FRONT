"use client";
"use client";
import { useEffect, useState } from "react";
import AdminLayout from "../layaut";
import axios from "axios";

export default function Dasboard() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [orders, setOrders] = useState(0);
  const [products, setProducts] = useState(0);
  const [servicesRequest, setServicesRequest] = useState(0);
  const [loading, setLoading] = useState(true);
  const stats = async () => {
    const token = JSON.parse(localStorage.getItem("admin_token"));
    const response = await axios.get(`${baseUrl}/api/admin/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    const orders = response.data.data.stats.orders.total;
    const products = response.data.data.stats.products.total;
    const servicesRequest = response.data.data.stats.services.total;
    setOrders(orders);
    setProducts(products);
    setServicesRequest(servicesRequest);
    //  setDashboardData(response.data);
    //  console.log(response.data.data.stats.orders.total);
    //  console.log(orders);

    try {
    } catch (error) {}
  };

  useEffect(() => {
    stats();
  });
  return (
    <>
      <AdminLayout>
        <div className="space-y-8">
          {/* Cartes de KPI épurées - harmonisées avec AdminLayout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Nombre total de produits
              </span>
              <h3 className="text-2xl font-bold mt-1 text-[#93b86a]">
                {products}
              </h3>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Nombre total de commandes
              </span>
              <h3 className="text-2xl font-bold mt-1 text-[#e8d393]">{orders}</h3>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Nombre total de demandes de service
              </span>
              <h3 className="text-2xl font-bold mt-1 text-[#93b86a]">{servicesRequest}</h3>
            </div>
            {/* <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Chiffre d'Affaires
              </span>
              <h3 className="text-2xl font-bold mt-1 text-gray-900">4 890 000 FCFA</h3>
            </div> */}
          </div>

          {/* Zone Graphique (Doughnut) & Info - harmonisée */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-base font-bold mb-1 text-gray-900">
                  Répartition des Revenus
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Proportion entre produits et devis validés.
                </p>
              </div>

              {/* Emplacement pour le Doughnut chart */}
              <div className="h-48 bg-white rounded-lg border border-dashed border-gray-200 flex items-center justify-center text-sm text-gray-400">
                [ Intégrer le composant Doughnut ici ]
              </div>
            </div>

            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-2">
                Notes rapides
              </h3>
              <p className="text-sm text-gray-500">
                Espace réservé pour ajouter des widgets, graphiques ou listes
                récentes.
              </p>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
