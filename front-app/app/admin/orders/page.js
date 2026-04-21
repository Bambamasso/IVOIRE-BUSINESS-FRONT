"use client";

import { RiEyeLine } from "react-icons/ri";
import AdminLayout from "../layaut";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const token = JSON.parse(localStorage.getItem("admin_token"));
    try {
      const getOrders = async () => {
        const response = await axios.get(`${baseUrl}/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data?.data || [];
         console.log("Commandes chargées :", data);
        setOrders(data);
      };
      getOrders();
    } catch (err) {
      console.error("Erreur lors du chargement des commandes :", err);
    }
  }, []);

  const formatOrderDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <>
      <AdminLayout>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Commande
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                    Total
                  </th>

                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50/80 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900 dark:text-white">
                         {order.order_number} 
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm px-2.5 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400 font-medium">
                    {order.first_name} {order.last_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#93b86a]">
                      {formatOrderDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ">
                         {order.status.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ">
                         {new Intl.NumberFormat("fr-FR").format(order.total_amount)}
                        FCFA
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <Link
                          href={`orders/detail/${order.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="Voir"
                        >
                          <RiEyeLine size={18} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {orders.length === 0 && (
            <div className="py-12 text-center text-gray-500 font-medium italic">
              Aucune commande trouvée pour le moment.
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  );
}
