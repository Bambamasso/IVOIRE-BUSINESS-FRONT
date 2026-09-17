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
  IoPerson,
  IoCall,
  IoLocation,
  IoCube,
  IoCard,
  IoCash,
  IoReceipt,
  IoBicycle,
} from "react-icons/io5";
import toast from "react-hot-toast";
import CancelOrder from "@/components/modal/cancel_order";

const labelCls = "text-[10px] font-bold uppercase tracking-widest text-gray-400";

export default function OrderDetailPage({ params }) {
  const { id } = React.use(params);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [openCancelModal, setOpenCancelModal] = useState(false);

  const fmt = (n) => new Intl.NumberFormat("fr-FR").format(n || 0);

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
      case "Validé(e)":
        return "bg-[#93b86a]/15 text-[#93b86a] border-[#93b86a]/20";
      case "Livrée":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Annulé(e)":
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

      if (response.data.status === "success") {
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
        <div className="flex items-center justify-center py-32">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#93b86a] border-t-transparent" />
        </div>
      </AdminLayout>
    );

  const itemsCount = order?.order_items?.length || 0;
  const paymentLabel =
    order?.payment_method === "online" ? "Paiement en ligne" : "Paiement à la livraison";

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Barre d'actions (tout à gauche) */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition-colors hover:text-gray-900"
          >
            <IoArrowBack size={18} /> Retour aux commandes
          </Link>
        </div>

        {/* Bandeau commande — large, aligné à gauche, façon fiche produit */}
        <div className="overflow-hidden rounded-3xl bg-linear-to-br from-[#7fa359] to-[#93b86a] text-white shadow-lg shadow-[#93b86a]/20">
          <div className="flex flex-col gap-8 p-8 lg:flex-row lg:items-center">
            {/* Visuel principal */}
            <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl border-4 border-white/20 bg-white/10 flex items-center justify-center text-white/50">
              <IoCube size={40} />
            </div>

            {/* Identité */}
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/70">
                {order?.created_at
                  ? new Date(order.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-"}
              </span>
              <h1 className="mt-1 text-3xl font-black leading-tight">
                Commande #{order?.order_number || "-"}
              </h1>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                  <IoCheckmarkCircle size={13} />
                  {order?.status?.name}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                  <IoCard size={13} />
                  {order?.payment_status?.name || "Impayé"}
                </span>
              </div>
            </div>

            {/* Faits clés */}
            <div className="flex flex-wrap gap-6 border-t border-white/15 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <Fact
                icon={IoCash}
                label="Total commande"
                value={
                  <>
                    {fmt(order?.total_amount)}
                    <span className="ml-1 text-xs font-medium text-white/60">FCFA</span>
                  </>
                }
              />
              <Fact
                icon={IoReceipt}
                label="Articles"
                value={
                  <>
                    {itemsCount}
                    <span className="ml-1 text-xs font-medium text-white/60">
                      art.
                    </span>
                  </>
                }
              />
            </div>
          </div>
        </div>

        {/* Bande de statistiques */}
        <div className="grid grid-cols-1 gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:grid-cols-3">
          <Kpi
            icon={IoLocation}
            value={order?.municipality?.name || "-"}
            label="Commune de livraison"
          />
          <Kpi
            icon={IoBicycle}
            value={`${fmt(order?.municipality?.shipping_fee)} F`}
            label="Frais de livraison"
          />
          <Kpi icon={IoCard} value={paymentLabel} label="Mode de paiement" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* COLONNE GAUCHE : Panier */}
          <div className="lg:col-span-2 space-y-6">
            <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className={labelCls}>Articles commandés</h2>
                <span className="rounded-full bg-[#93b86a]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#93b86a]">
                  {itemsCount} article{itemsCount > 1 ? "s" : ""}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-[10px] text-gray-400 uppercase font-black tracking-widest border-b border-gray-100">
                      <th className="pb-4">Produit</th>
                      <th className="pb-4 text-center">Qté</th>
                      <th className="pb-4 text-right">Prix Unitaire</th>
                      <th className="pb-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {order?.order_items?.map((item) => (
                      <tr key={item.id} className="group">
                        <td className="py-5">
                          <div className="font-bold text-gray-900 group-hover:text-[#93b86a] transition-colors">
                            {item.product?.title || "Produit supprimé"}
                          </div>
                          <div className="text-[10px] font-bold text-gray-400 uppercase">
                            {item.variant?.attribut_values?.length
                              ? item.variant.attribut_values
                                  .map((v) => v.value)
                                  .join(" / ")
                              : "Standard"}
                          </div>
                        </td>
                        <td className="py-5 text-center font-bold text-gray-600">
                          x{item.quantity}
                        </td>
                        <td className="py-5 text-right text-gray-500">
                          {fmt(item.unit_price)} F
                        </td>
                        <td className="py-5 text-right font-black text-gray-900">
                          {fmt(item.total_price)} F
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totaux */}
              <div className="mt-6 border-t border-gray-100 pt-6">
                <div className="max-w-xs ml-auto space-y-3">
                  <div className="flex justify-between text-sm text-gray-500 font-medium">
                    <span>Livraison ({order?.municipality?.name})</span>
                    <span className="text-gray-900">
                      {fmt(order?.municipality?.shipping_fee)} F
                    </span>
                  </div>
                  <div className="flex justify-between text-xl font-black pt-3 border-t border-gray-200">
                    <span className="text-gray-900">Total</span>
                    <span className="text-[#93b86a]">
                      {fmt(order?.total_amount)} FCFA
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* COLONNE DROITE : Client & Actions (reste à sa place) */}
          <div className="space-y-6">
            <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className={`${labelCls} mb-6`}>Client</h2>
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#f4f7f0] flex items-center justify-center text-[#93b86a]">
                    <IoPerson size={18} />
                  </div>
                  <div>
                    <p className={labelCls}>Nom complet</p>
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
                    <p className={labelCls}>Téléphone</p>
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
                    <p className={labelCls}>Adresse</p>
                    <p className="text-sm font-bold text-gray-800">
                      {[order?.city?.name, order?.municipality?.name, order?.address]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Actions conditionnelles basées sur order.status.name */}
            <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm space-y-4">
              <h2 className={labelCls}>Actions</h2>

              {order?.status?.name === "En attente" && (
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

              {order?.status?.name === "Validé(e)" && (
                <button
                  onClick={() => handleAction("deliver", "Commande livrée !")}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-blue-500 text-white rounded-2xl font-black text-sm hover:scale-[1.02] transition-all shadow-lg shadow-blue-200"
                >
                  MARQUER COMME LIVRÉE
                </button>
              )}

              {order?.status?.name === "Livrée" && (
                <div className="py-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
                    Commande livrée avec succès
                  </p>
                </div>
              )}

              {order?.status?.name === "Annulé(e)" && (
                <div className="py-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
                    Aucune action possible
                  </p>
                </div>
              )}
            </section>
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

function Fact({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">
          {label}
        </p>
        <p className="text-lg font-black leading-tight">{value}</p>
      </div>
    </div>
  );
}

function Kpi({ icon: Icon, value, label }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#93b86a]/10 text-[#93b86a]">
        <Icon size={22} />
      </div>
      <div>
        <p className="text-lg font-black text-gray-900 leading-tight">{value}</p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          {label}
        </p>
      </div>
    </div>
  );
}
