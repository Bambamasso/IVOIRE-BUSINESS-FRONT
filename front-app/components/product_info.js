"use client";
import { useState, useEffect } from "react";
import { useCart } from "../app/context/CartContext";
import SuccessModal from "./modal/successModal";
import { FaShoppingBag, FaCheckCircle } from "react-icons/fa";

export default function ProductInfo({ product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Fallbacks propres
  const title = product.name || product.title || "Produit sans nom";
  const category = product.category?.name || "Catégorie";
  const price = selectedVariant?.price || product.price || 0;
  const stock = selectedVariant?.stock_quantity ?? product.stock_quantity ?? 0;

  // Initialisation intelligente des attributs
  useEffect(() => {
    if (product.variants?.length > 0) {
      const firstVariant = product.variants[0];
      const initial = {};
      firstVariant.attribut_values.forEach(av => {
        initial[av.attribute.slug] = av.id;
      });
      setSelectedAttributes(initial);
    }
  }, [product]);

  // Update la variante selon la sélection
  useEffect(() => {
    if (product.variants) {
      const found = product.variants.find(v => 
        v.attribut_values.every(av => selectedAttributes[av.attribute.slug] === av.id)
      );
      setSelectedVariant(found);
    }
  }, [selectedAttributes, product.variants]);

  const handleAddToCart = () => {
    if (stock <= 0) return;
    addToCart(product, selectedVariant, quantity);
    setShowModal(true);
  };

  return (
    <>
      <SuccessModal show={showModal} onClose={() => setShowModal(false)} />
      
      <div className="flex flex-col gap-6">
        {/* En-tête */}
        <div>
          {/* <span className="text-[#93b86a] font-bold text-xs uppercase tracking-[0.2em]">{category}</span> */}
          <h1 className="text-4xl font-black text-gray-900 mt-2 tracking-tighter uppercase italic italic-none">{title}</h1>
          <div className="mt-4 flex items-baseline gap-4">
            <span className="text-3xl font-bold text-gray-900">{price.toLocaleString()} FCFA</span>
            {product.old_price && (
              <span className="text-xl text-gray-400 line-through">{product.old_price.toLocaleString()} FCFA</span>
            )}
          </div>
          <div className="mt-4 text-gray-500 text-sm border-y border-gray-100">
            <h3 className="font-bold text-gray-900 mb-2">Description</h3>
            <p>{product.description}</p>
            </div>
        </div>

        {/* Sélecteurs de Variantes */}
        <div className="space-y-6 py-6 border-y border-gray-100">
          {product.variants?.length > 0 && (
            <div className="grid gap-6">
              {/* On boucle sur les types d'attributs via la première variante (plus simple) */}
              {product.variants[0].attribut_values.map((av) => (
                <div key={av.attribute.slug}>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3">
                    {av.attribute.name}
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {/* Logique pour récupérer les valeurs uniques pour cet attribut */}
                    {[...new Set(product.variants.flatMap(v => v.attribut_values)
                      .filter(val => val.attribute.slug === av.attribute.slug)
                      .map(val => JSON.stringify(val)))]
                      .map(str => JSON.parse(str)).map((val) => (
                        <button
                          key={av.attribute.slug + '-' + val.id}
                          onClick={() => setSelectedAttributes(prev => ({ ...prev, [av.attribute.slug]: val.id }))}
                          className={`px-5 py-2 text-sm font-bold border-2 transition-all rounded-xl ${
                            selectedAttributes[av.attribute.slug] === val.id
                              ? "border-[#93b86a] bg-[#93b86a]/5 text-gray-900"
                              : "border-gray-100 text-gray-400 hover:border-gray-300"
                          }`}
                        >
                          {val.value}
                        </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stock & Quantité */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              {stock > 0 ? `${stock} en stock` : 'Rupture de stock'}
            </span>
          </div>
        </div>

        {/* Bouton Action */}
        <button
          onClick={handleAddToCart}
          disabled={stock <= 0}
          className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm transition-all flex items-center justify-center gap-3 shadow-xl ${
            stock > 0 
              ? "bg-gray-900 text-white hover:bg-[#93b86a] shadow-gray-200" 
              : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
          }`}
        >
          <FaShoppingBag />
          {stock > 0 ? "Ajouter au panier" : "Indisponible"}
        </button>
      </div>
    </>
  );
}