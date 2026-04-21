// components/modal/variante_product.jsx
"use client";
import { useState, useEffect } from "react";
import { useProduct } from "../../app/context/ProductFormContext";
import axios from "axios";

export default function VariantManager() {
  const { formData, setFormData } = useProduct();

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
  // Chargement des types d'attributs au montage
  useEffect(() => {
    const fetchTypes = async () => {
      try {

        const response = await  axios.get(`${BaseUrl}/api/settings/attributes`,{
            headers:{
                Authorization:`Bearer ${token}`,
            }
        });
        const data = response.data.data ?? response.data;
        // console.log("Types d'attributs chargés :", data);
         setAttributeTypes( data);
      } catch (err) {
        console.error("Erreur chargement attributs :", err);
      } finally {
        setLoadingTypes(false);
      }
    };
    fetchTypes();
  }, []);

  // Chargement des valeurs quand le type change
  const handleTypeChange = async (e) => {
    const id = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    setNewVar(prev => ({ ...prev, attribute_id: id, attribute_name: name, value_id: "", value_name: "" }));
    setAttributeValues([]);

    if (!id) return;
    setLoadingValues(true);
    try {
      const response = await axios.get(`${BaseUrl}/api/settings/attributes/values/${id}`,{
        headers:{
            Authorization:`Bearer ${token}`,
        }
      });
      const data = response.data.data;
      
      setAttributeValues(Array.isArray(data) ? data : []);
    
    } catch (err) {
      console.error("Erreur chargement valeurs :", err);
    } finally {
      setLoadingValues(false);
    }
  };

  const handleValueChange = (e) => {
    const value_id = e.target.value;
    const value_name = e.target.options[e.target.selectedIndex].text;
    setNewVar(prev => ({ ...prev, value_id, value_name }));
  };

  const addVariant = () => {
    if (!newVar.attribute_id || !newVar.value_id || newVar.stock_quantity === "") return;

    setFormData(prev => ({
      ...prev,
      variants: [
        ...prev.variants,
        { ...newVar, id: Date.now(), stock_quantity: parseInt(newVar.stock_quantity) }
      ]
    }));

    setNewVar({ attribute_id: "", attribute_name: "", value_id: "", value_name: "", stock_quantity: "", sku: "", price: "" });
    setAttributeValues([]);
  };

  const removeVariant = (id) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter(v => v.id !== id)
    }));
  };

  return (
  <div className="flex flex-col gap-6">

    {/* Formulaire d'ajout - Container principal */}
    <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-5 flex flex-col gap-4">
      
      {/* Première ligne : Type, Valeur et Stock */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_120px] gap-4">
        
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Type d'attribut</label>
          <select
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
            value={newVar.attribute_id}
            onChange={handleTypeChange}
            disabled={loadingTypes}
          >
            <option value="">{loadingTypes ? "Chargement..." : "Sélectionner"}</option>
            {attributeTypes.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Valeur</label>
          <select
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
            value={newVar.value_id}
            onChange={handleValueChange}
            disabled={!newVar.attribute_id || loadingValues}
          >
            <option value="">
              {loadingValues ? "Chargement..." : !newVar.attribute_id ? "-- Choisir type --" : "Sélectionner"}
            </option>
            {attributeValues.map(v => (
              <option key={v.id} value={v.id}>{v.value}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Stock</label>
          <input
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
            type="number"
            placeholder="0"
            min="0"
            value={newVar.stock_quantity}
            onChange={e => setNewVar(prev => ({ ...prev, stock_quantity: e.target.value }))}
          />
        </div>
      </div>

      {/* Deuxième ligne : SKU et Prix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
            Prix spécifique <span className="normal-case font-normal text-gray-400">(optionnel)</span>
          </label>
          <input
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
            type="number"
            placeholder="Hérite du prix principal"
            value={newVar.price}
            onChange={e => setNewVar(prev => ({ ...prev, price: e.target.value }))}
          />
        </div>
      </div>

      {/* Bouton Ajouter */}
      <button
        onClick={addVariant}
        className="w-full mt-2 py-3 px-4 rounded-xl border-2 border-dashed border-green-300 bg-green-50 text-green-700 font-bold text-sm hover:bg-green-100 hover:border-green-400 transition-all cursor-pointer flex items-center justify-center gap-2"
      >
        <span className="text-lg">+</span> Ajouter la variante
      </button>
    </div>

    {/* Liste des variantes */}
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-bold text-gray-500 px-1">Variantes enregistrées ({formData.variants.length})</h3>
      
      {formData.variants.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 text-sm">
          Aucune variante ajoutée — gestion du stock sur le produit principal.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {formData.variants.map(v => (
            <div key={v.id} className="flex items-center gap-2 p-3 bg-white border border-gray-300 rounded-lg">
              <span className="text-sm font-bold text-gray-700">{v.attribute?.name}: {v.value?.name}</span>
              <span className="text-xs text-gray-500">Stock: {v.stock_quantity}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

}