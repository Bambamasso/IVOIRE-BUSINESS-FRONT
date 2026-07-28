"use client";
import AdminLayout from "@/app/admin/layaut";
import * as React from "react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
// Importation des React Icons
import {
  IoArrowBack,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoTrash,
  IoPerson,
  IoCall,
  IoLocation,
  IoCube,
  IoBicycle,
  IoCard,
} from "react-icons/io5";
import toast from "react-hot-toast";
import CancelOrder from "@/components/modal/cancel_order";

export default function OrderDetailPage({ params }) {
  const { id } = React.use(params);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [openCancelModal, setOpenCancelModal] = useState(false);

  // Fonction pour charger la commande
  const fetchOrder = useCallback(async () => {
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem("admin_token"));
      const response = await axios.get(`${baseUrl}/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data?.data || null;
      setOrder(data);
      console.log("Détails de la commande :", data.status.name);
    } catch (error) {
      console.error("Erreur lors du chargement :", error);
      toast.error("Impossible de charger la commande.");
    } finally {
      setLoading(false);
    }
  }, [baseUrl, id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const getStatusStyle = (name) => {
    switch (name) {
      case "En attente":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Validée":
        return "bg-green-100 text-green-700 border-green-200";
      case "Livrée":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Annulée":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Actions
  const handleAction = async (endpoint, successMessage) => {
    const loadingToast = toast.loading("Mise à jour en cours...");
    try {
      const token = JSON.parse(localStorage.getItem("admin_token"));
      const response = await axios.patch(
        `${baseUrl}/api/admin/orders/${endpoint}/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        toast.success(successMessage, { id: loadingToast });
        fetchOrder();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Une erreur est survenue", {
        id: loadingToast,
      });
    }
  };

  if (loading && !order)
    return (
      <AdminLayout>
        <div className="p-10 text-center font-bold">Chargement...</div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto p-6 bg-[#f8fafc] min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/orders"
              className="p-3 bg-white hover:shadow-md rounded-2xl text-gray-600 transition-all"
            >
              <IoArrowBack size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-gray-900">
                Commande #{order?.order_number || "-"}
              </h1>
              <p className="text-xs text-gray-400 font-bold uppercase mt-1">
                {order?.created_at
                  ? new Date(order.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-"}
              </p>
            </div>
          </div>
          {/* Badge de Paiement */}
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest ${order?.payment_status?.name === "Payé" ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-gray-50 text-gray-400 border-gray-100"}`}
          >
            <IoCard size={14} /> {order?.payment_status?.name || "Impayé"}
          </div>
          {/* Badge de Statut Commande */}
          <div
            className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider border ${getStatusStyle(order?.status?.name)}`}
          >
            {order?.status?.name}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* COLONNE GAUCHE : Panier */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex items-center gap-3">
                <div className="p-2 bg-[#f4f7f0] rounded-lg text-[#93b86a]">
                  <IoCube size={20} />
                </div>
                <h3 className="font-bold text-gray-800">Articles commandés</h3>
              </div>

              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-[10px] text-gray-400 uppercase font-black tracking-widest border-b border-gray-50">
                        <th className="pb-4">Produit</th>
                        <th className="pb-4 text-center">Qté</th>
                        <th className="pb-4 text-right">Prix Unitaire</th>
                        <th className="pb-4 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {order?.order_items?.map((item, index) => (
                        <tr key={index} className="group">
                          <td className="py-5">
                            <div className="font-bold text-gray-900 group-hover:text-[#93b86a] transition-colors">
                              {item.product?.name || item.product?.title}
                            </div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase">
                              ID:{" "}
                              {item.product_variant_id?.slice(0, 8) ||
                                "Standard"}
                            </div>
                          </td>
                          <td className="py-5 text-center font-bold text-gray-600">
                            x{item.quantity}
                          </td>
                          <td className="py-5 text-right text-gray-500">
                            {parseInt(item.unit_price).toLocaleString()} F
                          </td>
                          <td className="py-5 text-right font-black text-gray-900">
                            {parseInt(item.total_price).toLocaleString()} F
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totaux */}
              <div className="bg-[#fcfdfb] p-8 border-t border-gray-100">
                <div className="max-w-xs ml-auto space-y-3">
                  <div className="flex justify-between text-sm text-gray-500 font-medium">
                    <span>Livraison ({order?.municipality?.name})</span>
                    <span className="text-gray-900">
                      {parseInt(
                        order?.municipality?.shipping_fee || 0,
                      ).toLocaleString()}{" "}
                      F
                    </span>
                  </div>
                  <div className="flex justify-between text-xl font-black pt-3 border-t border-gray-200">
                    <span className="text-gray-900">Total</span>
                    <span className="text-[#93b86a]">
                      {parseInt(
                        order?.total_amount +
                          (order?.municipality?.shipping_fee || 0) || 0,
                      ).toLocaleString()}{" "}
                      FCFA
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COLONNE DROITE : Client & Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8">
              <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                Client
              </h3>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#f4f7f0] flex items-center justify-center text-[#93b86a]">
                    <IoPerson size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase">
                      Nom complet
                    </p>
                    <p className="text-sm font-bold text-gray-800">
                      {order?.first_name} {order?.last_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#f4f7f0] flex items-center justify-center text-[#93b86a]">
                    <IoCall size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase">
                      Téléphone
                    </p>
                    <p className="text-sm font-bold text-gray-800">
                      {order?.phone_number}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#f4f7f0] flex items-center justify-center text-[#93b86a] shrink-0">
                    <IoLocation size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase">
                      Adresse
                    </p>
                    <p className="text-sm font-bold text-gray-800">
                      {order?.city?.name}, {order?.municipality?.name},{" "}
                      {order?.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions conditionnelles basées sur order.status.name */}
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 space-y-4">
              <h3 className="font-bold text-gray-800 mb-2">Actions</h3>

              {/* Si En attente */}
             
              {order.status.name === "En attente" && (
                
                <div className="space-y-3">
                  
                  <button
                    onClick={() =>
                      handleAction("validate", "Commande validée !")
                    }
                    className="w-full flex items-center justify-center gap-3 py-4 bg-[#93b86a] text-white rounded-2xl font-black text-sm hover:scale-[1.02] transition-all shadow-lg shadow-[#93b86a]/20"
                  >
                    <IoCheckmarkCircle size={20} /> VALIDER
                  </button>
                  <button
                    onClick={() => {
                      setOpenCancelModal(true);
                    }}
                    className="w-full flex items-center justify-center gap-3 py-4 border-2 border-amber-100 text-amber-600 rounded-2xl font-black text-sm hover:bg-amber-50 transition-all"
                  >
                    <IoCloseCircle size={20} /> ANNULER
                  </button>
                </div>
              )}

              {/* Si Validée */}
              {order?.status?.name === "Validé(e)" && (
                <button
                  onClick={() => handleAction("deliver", "Commande livrée !")}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-blue-500 text-white rounded-2xl font-black text-sm hover:scale-[1.02] transition-all shadow-lg shadow-blue-200"
                >
                MARQUER COMME LIVRÉE
                </button>
              )}

              {/* Si Livrée ou Annulée */}
              {(order?.status?.name === "Livrée" ||
                order?.status?.name === "Annulé(e)") && (
                <div className="py-4 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
                    Traitement Terminé
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
      <CancelOrder
        openCancelModal={openCancelModal}
        onClose={() => setOpenCancelModal(false)}
        orderId={order?.id}
        onRefresh={fetchOrder}
      />
    </AdminLayout>
  );
}
