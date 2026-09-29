"use client";
import { useState, useEffect } from "react";
import { useProduct } from "../app/context/ProductFormContext";
import axios from "axios";

export default function EditVariantProduct({ product }) {
  const { formData = {}, setFormData } = useProduct();

  const [attributeTypes, setAttributeTypes] = useState([]);
  const [attributeValues, setAttributeValues] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [loadingValues, setLoadingValues] = useState(false);

  const [newVar, setNewVar] = useState({
    attribute_id: "",
    attribute_name: "",
    value_id: "",
    value_name: "",
    stock_quantity: "",
    sku: "",
    price: "",
  });

  const BaseUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = JSON.parse(localStorage.getItem("admin_token"));

  // Initialiser les variantes depuis le produit existant
  useEffect(() => {
    if (product?.variants?.length > 0) {
      const mapped = product.variants.map((v) => ({
        // id local pour React
        id: v.id,
        // id serveur pour l'API
        serverId: v.id,
        value_id: v.attribut_values?.[0]?.id || "",
        value_name: v.attribut_values?.[0]?.value || "",
        attribute_id: v.attributs?.[0]?.attribute?.id || "",
        attribute_name: v.attribut_values?.[0]?.attribute?.name || "",
        stock_quantity: v.stock_quantity,
        price: v.price || "",
       
      }));

      setFormData((prev) => ({ ...prev, variants: mapped }));
    }

    // Charger les types d'attributs
    const fetchTypes = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/api/settings/attributes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAttributeTypes(response.data.data ?? response.data);
      } catch (err) {
        console.error("Erreur chargement attributs :", err);
      } finally {
        setLoadingTypes(false);
      }
    };
    fetchTypes();
  }, []);

  const handleTypeChange = async (e) => {
    const id = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    setNewVar((prev) => ({
      ...prev,
      attribute_id: id,
      attribute_name: name,
      value_id: "",
      value_name: "",
    }));
    setAttributeValues([]);
    if (!id) return;

    setLoadingValues(true);
    try {
      const response = await axios.get(
        `${BaseUrl}/api/settings/attributes/values/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAttributeValues(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (err) {
      console.error("Erreur chargement valeurs :", err);
    } finally {
      setLoadingValues(false);
    }
  };

  const handleValueChange = (e) => {
    const value_id = e.target.value;
    const value_name = e.target.options[e.target.selectedIndex].text;
    setNewVar((prev) => ({ ...prev, value_id, value_name }));
  };

  const addVariant = () => {
    if (!newVar.attribute_id || !newVar.value_id || newVar.stock_quantity === "") return;

    setFormData((prev) => ({
      ...prev,
      variants: [
        ...(prev?.variants || []),
        {
          ...newVar,
          id: Date.now(), // id local uniquement (pas de serverId = nouvelle variante)
          stock_quantity: parseInt(newVar.stock_quantity),
        },
      ],
    }));

    setNewVar({
      attribute_id: "",
      attribute_name: "",
      value_id: "",
      value_name: "",
      stock_quantity: "",
      sku: "",
      price: "",
    });
    setAttributeValues([]);
  };

  const removeVariant = (id) => {
    setFormData((prev) => ({
      ...prev,
      variants: (prev?.variants || []).filter((v) => v.id !== id),
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Formulaire d'ajout */}
      <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-5 flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_120px] gap-4">
          {/* Type d'attribut */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
              Type d'attribut
            </label>
            <select
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
              value={newVar.attribute_id}
              onChange={handleTypeChange}
              disabled={loadingTypes}
            >
              <option value="">{loadingTypes ? "Chargement..." : "Sélectionner"}</option>
              {attributeTypes.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          {/* Valeur */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
              Valeur
            </label>
            <select
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={newVar.value_id}
              onChange={handleValueChange}
              disabled={!newVar.attribute_id || loadingValues}
            >
              <option value="">
                {loadingValues ? "Chargement..." : !newVar.attribute_id ? "-- Choisir type --" : "Sélectionner"}
              </option>
              {attributeValues.map((v) => (
                <option key={v.id} value={v.id}>{v.value}</option>
              ))}
            </select>
          </div>

          {/* Stock */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
              Stock
            </label>
            <input
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
              type="number"
              placeholder="0"
              min="0"
              value={newVar.stock_quantity}
              onChange={(e) => setNewVar((prev) => ({ ...prev, stock_quantity: e.target.value }))}
            />
          </div>
        </div>

        {/* Prix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
              Prix spécifique{" "}
              <span className="normal-case font-normal text-gray-400">(optionnel)</span>
            </label>
            <input
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              type="number"
              placeholder="Hérite du prix principal"
              value={newVar.price}
              onChange={(e) => setNewVar((prev) => ({ ...prev, price: e.target.value }))}
            />
          </div>
        </div>

        <button
          onClick={addVariant}
          className="w-full mt-2 py-3 px-4 rounded-xl border-2 border-dashed border-green-300 bg-green-50 text-green-700 font-bold text-sm hover:bg-green-100 hover:border-green-400 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span className="text-lg">+</span> Ajouter une variante
        </button>
      </div>

      {/* Liste des variantes */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-gray-500 px-1">
          Variantes ({(formData?.variants || []).length})
        </h3>

        {(formData?.variants || []).length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 text-sm">
            Aucune variante — stock géré sur le produit principal.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {(formData?.variants || []).map((v) => (
              <div
                key={v.id}
                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-gray-800">
                    {v.attribute_name} : {v.value_name}
                  </span>
                  <div className="flex gap-3 text-xs text-gray-400">
                    <span>Stock : {v.stock_quantity}</span>
                    {v.price && <span>Prix : {v.price} FCFA</span>}
                    {/* Badge pour distinguer existant / nouveau */}
                    {v.serverId ? (
                      <span className="px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-500 font-medium">
                        existant
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded-full bg-green-50 text-green-600 font-medium">
                        nouveau
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => removeVariant(v.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  title="Supprimer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}