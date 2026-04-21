// components/ProductForm.jsx
"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useProduct } from "../app/context/ProductFormContext";
import GeneralInfo from "./modal/info_product";
import VariantManager from "./modal/variante_product";
import ImageGallery from "./modal/media_product";
import axios from "axios";

export default function ProductForm({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(false);
  const { formData, totalStock } = useProduct();

  if (!isOpen) return null;

  const tabs = [
    { id: "info", label: "Informations" },
    { id: "variants", label: "Variantes", count: formData.variants.length },
    { id: "images", label: "Photos", count: formData.images.length },
  ];
  const BaseUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = JSON.parse(localStorage.getItem("admin_token"));
  const handleSubmit = async () => {
    if (!formData.title) return alert("Le nom du produit est requis.");
    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description || "");
      data.append("price", formData.price);
      data.append("category_id", formData.category_id);

      // Correction ici : On envoie 0 ou la valeur, pas une string vide

      if (formData.variants.length === 0) {
        data.append("stock_quantity", formData.stock_quantity);
      }

      // CORRECTION MAJEURE : Envoyer les variantes au format array pour PHP
      formData.variants.forEach((v, index) => {
        data.append(`variantes[${index}][attribute_values][]`, v.value_id);
        data.append(`variantes[${index}][stock_quantity]`, v.stock_quantity);
        data.append(`variantes[${index}][price]`, v.price || "");
      });

      // Images
      formData.images.forEach((f) => data.append("files[]", f));

      const response = await axios.post(`${BaseUrl}/api/products`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Produit enregistré avec succès !");

      onClose();
    } catch (err) {
       console.error("Erreur lors de l'enregistrement :", err);
      toast.error(
        err?.response?.data?.message ||
          err.message ||
          "Une erreur est survenue.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
        padding: 16,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 720,
          background: "#fff",
          borderRadius: 24,
          boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px 28px 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 600, color: "#111827" }}>
            Nouveau produit
          </span>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "1.5px solid #e5e7eb",
              background: "#fff",
              cursor: "pointer",
              fontSize: 16,
              color: "#9ca3af",
            }}
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 4,
            padding: "16px 28px 0",
            borderBottom: "1.5px solid #f3f4f6",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "8px 16px",
                borderRadius: "12px 12px 0 0",
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: activeTab === tab.id ? "#e8f5da" : "transparent",
                color: activeTab === tab.id ? "#6a8f49" : "#9ca3af",
              }}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  style={{
                    background: "#93b86a",
                    color: "#fff",
                    borderRadius: 20,
                    padding: "1px 7px",
                    fontSize: 11,
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Body */}
        <div
          style={{ padding: "24px 28px", overflowY: "auto", maxHeight: "60vh" }}
        >
          {activeTab === "info" && <GeneralInfo />}
          {activeTab === "variants" && <VariantManager />}
          {activeTab === "images" && <ImageGallery />}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "18px 28px",
            borderTop: "1.5px solid #f3f4f6",
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "10px 20px",
              borderRadius: 12,
              border: "1.5px solid #e5e7eb",
              background: "#fff",
              color: "#4b5563",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: "10px 24px",
              borderRadius: 12,
              border: "none",
              background: loading ? "#b5d48e" : "#93b86a",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Enregistrement..." : "Enregistrer le produit"}
          </button>
        </div>
      </div>
    </div>
  );
}
