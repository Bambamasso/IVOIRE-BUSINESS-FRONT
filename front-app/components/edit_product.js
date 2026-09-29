"use client";
import { useState } from "react";
import EditInfoProduct from "./modal/edit_info_product";
import EditVariantProduct from "./edit_variant_product";
import { useProduct } from "../app/context/ProductFormContext";
import axios from "axios";
import toast from "react-hot-toast";

export default function EditProduct({ isOpen, onClose, product}) {
  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(false);
  const { formData = {} } = useProduct();

  if (!isOpen) return null;

  const BaseUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = JSON.parse(localStorage.getItem("admin_token"));

  const variantsCount = (formData?.variants || []).length;

  const tabs = [
    { id: "info", label: "Informations" },
    { id: "variants", label: "Variantes", count: variantsCount },
  ];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description || "",
        price: formData.price,
        category_id: formData.category_id,
      };

      if ((formData?.variants || []).length === 0) {
        payload.stock_quantity = formData.stock_quantity;
      }

      if ((formData?.variants || []).length > 0) {
        payload.variantes = (formData.variants || []).map((v) => ({
          ...(v.serverId ? { id: v.serverId } : {}),
          attribute_values: [v.value_id],
          stock_quantity: v.stock_quantity,
          price: v.price || null,
          sku: v.sku || null,
        }));
      }

      await axios.patch(
        `${BaseUrl}/api/admin/products/${product.id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      onClose();
      toast.success("Produit modifié avec succès !");
      product; // rafraîchir les données du produit après modification
      
    } catch (err) {
      toast.error(
        err?.response?.data?.errors ||
          err.message ||
          "Une erreur est survenue.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex w-full max-w-[540px] flex-col overflow-hidden rounded-4xl border border-slate-200 bg-slate-50 shadow-[0_8px_32px_rgba(30,41,59,0.18)]">
        {/* Header */}
        <div className="flex items-center justify-between bg-slate-50 px-8 pt-6">
          <span className="text-lg font-semibold text-slate-900">
            Modification du produit
          </span>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-sm text-slate-400 transition hover:border-slate-300 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-slate-200 bg-slate-50 px-8 pt-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 rounded-t-xl px-4 py-2 text-sm font-medium transition ${
                activeTab === tab.id
                  ? "bg-lime-100 text-lime-700"
                  : "bg-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="rounded-full bg-lime-600 px-2 py-0.5 text-[11px] leading-none text-white">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="max-h-[60vh] overflow-y-auto bg-slate-50 px-8 py-6">
          {activeTab === "info" && <EditInfoProduct product={product} />}
          {activeTab === "variants" && <EditVariantProduct product={product} />}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2.5 border-t border-slate-200 bg-slate-50 px-8 py-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition ${
              loading
                ? "cursor-not-allowed bg-lime-300"
                : "bg-lime-600 hover:bg-lime-700"
            }`}
          >
            {loading ? "Modification..." : "Modifier le produit"}
          </button>
        </div>
      </div>
    </div>
  );
}
