"use client";

import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { RiSearchLine, RiCloseLine } from "react-icons/ri";

function formatFCFA(amount) {
  return `${Number(amount || 0).toLocaleString("fr-FR")} FCFA`;
}

export default function Products() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const url = baseUrl + "/api/home/all-product";
  // L'optimiseur d'images de Next.js refuse par sécurité les sources sur IP
  // privée/loopback (127.0.0.1, localhost) : on la désactive seulement dans ce
  // cas (dev local). En production, le backend est sur un vrai domaine.
  const isLocalBackend = /^https?:\/\/(127\.0\.0\.1|localhost)(:|\/)/.test(
    baseUrl || "",
  );

  const [allProducts, setAllProducts] = useState([]);
  // 1. État pour gérer le nombre de produits affichés
  const [visibleCount, setVisibleCount] = useState(8);
  const [search, setSearch] = useState("");
  // Valeur réellement envoyée au backend, mise à jour avec un délai (debounce)
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Attend 400ms sans frappe avant de lancer la recherche côté serveur
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(id);
  }, [search]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(url, {
          params: debouncedSearch ? { search: debouncedSearch } : {},
        });
        const data = Array.isArray(response.data.data)
          ? response.data.data
          : response.data.data?.data || []; // Gestion si Laravel renvoie .data.data
        setAllProducts(data);
        setVisibleCount(8);
      } catch (error) {
        console.error("erreur réseau:", error);
      }
    };
    fetchProducts();
  }, [url, debouncedSearch]);

  // 2. Fonction pour charger plus de produits
  const loadMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 py-10 lg:py-16">
        {/* Barre de recherche centrée */}
        <div className="relative mx-auto mb-2 max-w-md">
          <RiSearchLine
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un produit..."
            className="w-full pl-11 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#93b86a]/20 focus:border-[#93b86a]/40 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Effacer la recherche"
            >
              <RiCloseLine size={20} />
            </button>
          )}
        </div>

        {debouncedSearch && (
          <p className="text-sm text-gray-500 font-medium text-center mb-4">
            {allProducts.length} résultat{allProducts.length !== 1 ? "s" : ""} pour «{" "}
            <span className="font-bold text-gray-700">{debouncedSearch}</span> »
          </p>
        )}

        <div className="flex items-center justify-end gap-4 mb-6">
          {/* Bouton Voir Plus (Desktop) - Apparaît seulement s'il reste des produits à charger */}
          {visibleCount < allProducts.length && (
            <button
              onClick={loadMore}
              className="hidden sm:inline-flex px-6 py-2 rounded-lg bg-[#93b86a] text-white text-sm font-bold uppercase tracking-widest hover:bg-[#7a9a56] transition-colors"
            >
              Afficher Plus
            </button>
          )}
        </div>

        {allProducts.length === 0 ? (
          <div className="text-center py-16 text-gray-400 italic">
            {debouncedSearch
              ? "Aucun produit ne correspond à votre recherche."
              : "Aucun produit disponible pour le moment."}
          </div>
        ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* 3. On utilise .slice(0, visibleCount) pour limiter l'affichage */}
          {allProducts.slice(0, visibleCount).map((product) => {
            const isOutOfStock = product.status?.code === "out-of-stock";

            return (
              <div
                key={product.id}
                className={`group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ${isOutOfStock ? "opacity-80" : "hover:shadow-xl"}`}
              >
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  {product.media && product.media.length > 0 ? (
                    <Image
                      src={`${baseUrl}/storage/${product.media[0].file_path}`}
                      alt={product.title}
                      fill
                      unoptimized={isLocalBackend}
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className={`object-cover transition-transform duration-500 ${!isOutOfStock && "group-hover:scale-110"} ${isOutOfStock && "grayscale-[0.5]"}`}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 italic text-xs">
                      Aucune image
                    </div>
                  )}

                  <div className="absolute top-4 left-4">
                    {isOutOfStock ? (
                      <span className="bg-red-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg">
                        Rupture de stock
                      </span>
                    ) : (
                      <span className="bg-[#93b86a] text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg">
                        Disponible
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-4 right-4">
                    <span className="bg-black/70 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-black text-[#e8d393]">
                      {formatFCFA(product.price)}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-sm font-black text-gray-800 uppercase mb-2 line-clamp-1">
                    {product.title}
                  </h3>
                  {/* <p className="text-gray-500 text-xs mb-6 line-clamp-2 italic h-8">
                    {product.description}
                  </p> */}
                  
                  <Link 
                    href={`/show/${product.id}`}
                    className={`block text-center w-full py-3 text-xs font-bold uppercase tracking-widest rounded-lg transition-all shadow-md 
                      ${isOutOfStock
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none pointer-events-none"
                        : "bg-[#93b86a] text-white hover:bg-[#7a9a56] shadow-[#93b86a]/20"
                      }`}
                  >
                    {isOutOfStock ? "Indisponible" : "Voir le produit"}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        )}

        {/* Bouton Mobile / Bas de page */}
        {visibleCount < allProducts.length && (
          <div className="mt-12 text-center">
            <button
              onClick={loadMore}
              className="inline-flex px-8 py-3 rounded-lg bg-[#93b86a] text-white text-sm font-bold uppercase tracking-widest hover:bg-[#7a9a56] transition shadow-lg shadow-[#93b86a]/20"
            >
              Afficher tous les produits
            </button>
          </div>
        )}
      </div>
    </section>
  );
}