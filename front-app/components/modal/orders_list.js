import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RiEyeLine } from "react-icons/ri";

export default function OrdersList({ route, statusColor }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  //
  const getOrders = async (page = 1) => {
    const token = JSON.parse(localStorage.getItem("admin_token"));
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}${route}?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data?.data.data || [];
      console.log("Commandes chargées :", data);
      setOrders(data);
      setPagination(response.data?.data);
    } catch (err) {
      console.error("Erreur lors du chargement des commandes :", err);
    } finally {
      setLoading(false);
    }
  };

  //
  useEffect(() => {
    getOrders();
  }, [route]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[32px] border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200 text-[10px] font-black uppercase text-gray-500 tracking-widest">
                <th className="px-8 py-6">N° Commande</th>
                <th className="px-6 py-6">Client</th>
                <th className="px-6 py-6 text-center">Statut</th>
                <th className="px-6 py-6">Date</th>
                <th className="px-8 py-6 text-right">Total</th>
                <th className="px-8 py-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="group hover:bg-[#93b86a]/5 transition-colors"
                  >
                    {/* Numéro de commande */}
                    <td className="px-8 py-5">
                      <span className="text-sm font-black text-gray-900">
                        {order.order_number}
                      </span>
                    </td>

                    {/* Client (Nom + Badge léger pour l'email ou tel) */}
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <p className="text-sm font-black text-gray-900 leading-tight">
                          {order.first_name} {order.last_name}
                        </p>
                      </div>
                    </td>

                    {/* Statut avec ton style de badge arrondi */}
                    <td className="px-6 py-5 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          order.status?.code === "validated"
                            ? "bg-[#93b86a]/10 text-[#93b86a]"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {order.status?.name}
                      </span>
                    </td>

                    {/* Date formatée */}
                    <td className="px-6 py-5">
                      <div className="text-xs font-bold text-gray-400">
                        {new Date(order.created_at).toLocaleDateString("fr-FR")}
                      </div>
                    </td>

                    {/* Total en FCFA */}
                    <td className="px-8 py-5 text-right">
                      <span className="text-sm font-black text-gray-900">
                        {new Intl.NumberFormat("fr-FR").format(
                          order.total_amount,
                        )}
                        <span className="text-[10px] ml-1 text-gray-400">
                          FCFA
                        </span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/orders/detail/${order.id}`}
                          className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-[#93b86a] hover:border-[#93b86a] shadow-sm transition-all"
                          title="Voir les détails"
                        >
                          <RiEyeLine size={18} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-8 py-20 text-center text-gray-400 font-bold italic"
                  >
                    Aucune commande trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination style SaaS */}
        {pagination && pagination.last_page > 1 && (
          <div className="p-6 border-t border-gray-200 flex justify-center gap-2 bg-gray-50/30">
            {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(
              (p) => (
                <button
                  key={p}
                  onClick={() => getOrders(p)}
                  className={`w-9 h-9 rounded-xl font-black text-[10px] transition-all ${
                    pagination.current_page === p
                      ? "bg-[#93b86a] text-white shadow-lg shadow-[#93b86a]/20"
                      : "bg-white text-gray-400 border border-gray-200 shadow-sm hover:border-[#93b86a] hover:text-[#93b86a]"
                  }`}
                >
                  {p}
                </button>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}
