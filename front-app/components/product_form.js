// components/ProductForm.jsx
"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useProduct } from "../app/context/ProductFormContext";
import GeneralInfo from "./modal/info_product";
import VariantManager from "./modal/variante_product";
import ImageGallery from "./modal/media_product";
import axios from "axios";

export default function ProductForm({ isOpen, onClose , refresh}) {
  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(false);
  const { formData = {}, totalStock } = useProduct();

  if (!isOpen) return null;

  const variantsCount = (formData?.variants || []).length;
  const imagesCount = (formData?.images || []).length;
  const tabs = [
    { id: "info", label: "Informations" },
    { id: "variants", label: "Variantes", count: variantsCount },
    { id: "images", label: "Photos", count: imagesCount },
  ];
  const BaseUrl = process.env.NEXT_PUBLIC_API_URL;
  const handleSubmit = async () => {
    if (loading) return; // évite les doubles soumissions

    const variants = formData?.variants || [];
    const images = formData?.images || [];

    // Garde-fous côté client pour un message clair immédiat
    if (!formData.title?.trim()) {
      toast.error("Le nom du produit est obligatoire.");
      return;
    }
    if (!formData.category_id) {
      toast.error("La catégorie est obligatoire.");
      return;
    }
    if (images.length === 0) {
      toast.error("Veuillez ajouter au moins une image.");
      return;
    }

    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem("admin_token"));
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description || "");
      data.append("price", formData.price || "");
      data.append("category_id", formData.category_id);

      // Stock principal uniquement s'il n'y a pas de variantes
      if (variants.length === 0) {
        data.append("stock_quantity", formData.stock_quantity || "0");
      }

      // Variantes au format tableau attendu par PHP
      variants.forEach((v, index) => {
        data.append(`variantes[${index}][attribute_values][]`, v.value_id);
        data.append(`variantes[${index}][stock_quantity]`, v.stock_quantity ?? 0);
        data.append(`variantes[${index}][price]`, v.price || "");
      });

      // Images
      images.forEach((f) => data.append("files[]", f));

      await axios.post(`${BaseUrl}/api/admin/products`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Produit enregistré avec succès !");
      onClose();
      if (refresh) refresh();
    } catch (err) {
      const apiError = err?.response?.data?.errors;
      toast.error(
        (typeof apiError === "string" ? apiError : null) ||
          err?.response?.data?.message ||
          err.message ||
          "Une erreur est survenue.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4">
      <div className="flex w-full max-w-[540px] flex-col overflow-hidden rounded-4xl border border-slate-200 bg-slate-50 shadow-[0_8px_32px_rgba(30,41,59,0.18)]">
        {/* Header */}
        <div className="flex items-center justify-between bg-slate-50 px-8 pt-6">
          <span className="text-lg font-semibold text-slate-900">
            Nouveau produit
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
          {activeTab === "info" && <GeneralInfo />}
          {activeTab === "variants" && <VariantManager />}
          {activeTab === "images" && <ImageGallery />}
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
            {loading ? "Enregistrement..." : "Enregistrer le produit"}
          </button>
        </div>
      </div>
    </div>
  );
}
