// components/modal/info_product.jsx
"use client";
import axios from "axios";
import { useProduct } from "../../app/context/ProductFormContext";
import { useEffect, useState } from "react";

export default function GeneralInfo() {
  const [categories, setCategories] = useState([]);
  const { formData, setFormData, totalStock } = useProduct();
  const hasVariants = formData.variants.length > 0;
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("admin_token"));
    const getCategories = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        
        const response = await axios.get(`${baseUrl}/api/categories`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];

        setCategories(data);
      } catch (error) {
        console.error("Erreur chargement catégories :", error);
      }
    };
    getCategories();
  },[]);
  const update = (key, value) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl p-4">
      {/* Nom du produit */}
      <div className="flex flex-col items-start gap-2 w-full">
        <label className="text-sm font-semibold text-gray-700">
          Nom du produit
        </label>
        <input
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          type="text"
          placeholder="ex : T-shirt coton premium"
          value={formData.title}
          onChange={(e) => update("title", e.target.value)}
        />
      </div>

      {/* Catégorie */}
      <div className="flex flex-col items-start gap-2 w-full">
        <label className="text-sm font-semibold text-gray-700">Catégorie</label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
          value={formData.category_id}
          onChange={(e) => update("category_id", e.target.value)}
        >
          <option value="">Sélectionner une catégorie</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      {/* Description */}
      <div className="flex flex-col items-start gap-2 w-full">
        <label className="text-sm font-semibold text-gray-700">
          Description
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-y min-h-[100px]"
          placeholder="Décrivez le produit..."
          rows={4}
          value={formData.description}
          onChange={(e) => update("description", e.target.value)}
        />
      </div>

      {/* Grille Prix et Stock */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col items-start gap-2">
          <label className="text-sm font-semibold text-gray-700">
            Prix (FCFA)
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            type="number"
            placeholder="0"
            value={formData.price}
            onChange={(e) => update("price", e.target.value)}
          />
        </div>

        <div className="flex flex-col items-start gap-2">
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-gray-700">Stock</label>
            {hasVariants && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase">
                🔁 Auto
              </span>
            )}
          </div>
          <input
            className={`w-full px-3 py-2 border rounded-lg outline-none ${
              hasVariants
                ? "bg-gray-50 border-dashed border-gray-300 text-gray-400 cursor-not-allowed"
                : "border-gray-300 focus:ring-2 focus:ring-blue-500"
            }`}
            type="number"
            disabled={hasVariants}
            value={hasVariants ? totalStock : formData.stock_quantity}
            onChange={(e) => update("stock_quantity", e.target.value)}
          />
          {hasVariants && (
            <p className="text-[11px] text-gray-400 mt-1">
              Basé sur {formData.variants.length} variante(s)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
