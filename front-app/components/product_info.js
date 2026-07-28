"use client";
import { useState, useEffect } from "react";
import { useCart } from "../app/context/CartContext";
import SuccessModal from "./modal/successModal";
import { FaShoppingBag } from "react-icons/fa";

export default function ProductInfo({ product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [selectedVariant, setSelectedVariant] = useState(null);

  const title = product.name || product.title || "Produit sans nom";
  const price = selectedVariant?.price || product.price || 0;
  const description = product.description || "Aucune description disponible";

  // ✅ On se fie uniquement au statut : 'available' = dispo, 'out-of-stock' = rupture
  const isVariantAvailable = (variant) => {
    if (!variant) return false;
    return variant.status?.code === "available";
  };

  // Stock affiché : quantité brute de la variante ou du produit
  const stock = selectedVariant?.stock_quantity ?? product.stock_quantity ?? 0;

  // Disponibilité : statut de la variante sélectionnée, ou statut du produit si pas de variante
  const isAvailable = selectedVariant
    ? isVariantAvailable(selectedVariant)
    : product.status?.code === "available";

  // Initialisation des attributs sur la première variante DISPONIBLE
  useEffect(() => {
    if (product.variants?.length > 0) {
      // On préfère initialiser sur une variante disponible
      const firstAvailable =
        product.variants.find(isVariantAvailable) ?? product.variants[0];
      const initial = {};
      firstAvailable.attribut_values.forEach((av) => {
        initial[av.attribute.slug] = av.id;
      });
      setSelectedAttributes(initial);
    }
  }, [product]);

  // Mise à jour de la variante sélectionnée selon les attributs choisis
  useEffect(() => {
    if (product.variants) {
      const found = product.variants.find((v) =>
        v.attribut_values.every(
          (av) => selectedAttributes[av.attribute.slug] === av.id,
        ),
      );
      setSelectedVariant(found ?? null);
    }
  }, [selectedAttributes, product.variants]);

  const handleAddToCart = () => {
    if (!isAvailable) return;
    addToCart(product, selectedVariant, quantity);
    setShowModal(true);
  };

  // Description tronquée après 180 caractères
  
  return (
    <>
      <SuccessModal show={showModal} onClose={() => setShowModal(false)} />

      <div className="flex flex-col gap-4 w-full max-w-full min-w-0 overflow-hidden">
        {/* En-tête */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-tight wrap-break-word">
            {title}
          </h1>

          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-bold text-gray-900">
              {Number(price).toLocaleString()} FCFA
            </span>
            {product.old_price && (
              <span className="text-lg text-gray-400 line-through">
                {Number(product.old_price).toLocaleString()} FCFA
              </span>
            )}
          </div>

          <div className="border-y border-gray-100 py-3">
            <h3 className="font-bold text-gray-900 mb-1 text-sm uppercase tracking-widest">
              Description
            </h3>
            <p className="w-full max-w-full text-gray-500 text-sm leading-relaxed wrap-anywhere whitespace-pre-line">
              {description}
            </p>
            
          </div>
        </div>

        {/* Sélecteurs de Variantes */}
        {product.variants?.length > 0 && (
          <div className="space-y-4 py-4 border-b border-gray-100">
            {product.variants[0].attribut_values.map((av) => {
              // Valeurs uniques pour cet attribut
              const uniqueValues = [
                ...new Map(
                  product.variants
                    .flatMap((v) => v.attribut_values)
                    .filter((val) => val.attribute.slug === av.attribute.slug)
                    .map((val) => [val.id, val]),
                ).values(),
              ];

              return (
                <div key={av.attribute.slug}>
                  <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">
                    {av.attribute.name}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {uniqueValues.map((val) => {
                      const isSelected =
                        selectedAttributes[av.attribute.slug] === val.id;

                      // ✅ Vérifier si la variante correspondante est en rupture
                      const matchingVariant = product.variants.find((v) =>
                        v.attribut_values.some((a) => a.id === val.id),
                      );
                      const variantUnavailable =
                        matchingVariant && !isVariantAvailable(matchingVariant);

                      return (
                        <button
                          key={av.attribute.slug + "-" + val.id}
                          onClick={() =>
                            setSelectedAttributes((prev) => ({
                              ...prev,
                              [av.attribute.slug]: val.id,
                            }))
                          }
                          title={
                            variantUnavailable ? "Rupture de stock" : val.value
                          }
                          className={`
                            relative px-4 py-2 text-sm font-bold border-2 transition-all rounded-xl max-w-full wrap-anywhere text-center
                            ${
                              isSelected
                                ? "border-[#93b86a] bg-[#93b86a]/5 text-gray-900"
                                : "border-gray-100 text-gray-400 hover:border-gray-300"
                            }
                            ${variantUnavailable ? "opacity-40 cursor-not-allowed line-through" : ""}
                          `}
                        >
                          {val.value}
                          {/* Barre diagonale visuelle pour rupture */}
                          {variantUnavailable && (
                            <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <svg
                                className="w-full h-full absolute opacity-20"
                                viewBox="0 0 100 100"
                                preserveAspectRatio="none"
                              >
                                <line
                                  x1="0"
                                  y1="100"
                                  x2="100"
                                  y2="0"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                />
                              </svg>
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ✅ CORRECTION STOCK : indicateur basé sur le statut */}
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full shrink-0 ${
              isAvailable ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest wrap-anywhere">
            {isAvailable
              ? `${stock} en stock`
              : (selectedVariant?.status?.name ?? "Rupture de stock")}
          </span>
        </div>

        {/* Bouton Action */}
        <button
          onClick={handleAddToCart}
          disabled={!isAvailable}
          className={`
            w-full py-4 sm:py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm
            transition-all flex items-center justify-center gap-3 shadow-xl
            ${
              isAvailable
                ? "bg-gray-900 text-white hover:bg-[#93b86a] shadow-gray-200"
                : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
            }
          `}
        >
          <FaShoppingBag />
          {isAvailable ? "Ajouter au panier" : "Indisponible"}
        </button>
      </div>
    </>
  );
}
