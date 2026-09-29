"use client";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SimilarProduct({ productId }) {
  console.log("ID du produit pour les similaires :", productId);
  const [products, setProducts] = useState([]);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  useEffect(() => {
    const getSimilarProducts = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/home/products/similar/${productId}`,
        );
        const data = Array.isArray(response.data.data)
          ? response.data.data
          : response.data.data?.data || [];
        setProducts(data);
      
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des produits similaires :",
          error,
        );
      }
    };
    getSimilarProducts();
  }, [productId]);

  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 py-12 lg:py-16">
          <div className="flex items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">
              Produits Similaires
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => {
              // Définir la condition de rupture de stock
              const isOutOfStock = product.stock_quantity === 0 || product.status?.code === "out-of-stock";
              return (
                <div
                  key={product.id}
                  className="border border-gray-100 rounded-2xl p-4 flex flex-col gap-4"
                >
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    {product.media && product.media.length > 0 ? (
                      <img
                        src={`${baseUrl}/storage/${product.media[0].file_path}`}
                        alt={product.title}
                        className={`w-full h-full object-cover transition-transform duration-500 ${!isOutOfStock && "group-hover:scale-110"} ${isOutOfStock && "grayscale-[0.5]"}`}
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
                        {product.price} FCFA
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-sm font-black text-gray-800 uppercase mb-2 line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="text-gray-500 text-xs mb-6 line-clamp-2 italic h-8">
                      {product.description}
                    </p>

                    <Link
                      href={`/show/${product.id}`}
                      className={`block text-center w-full py-3 text-xs font-bold uppercase tracking-widest rounded-lg transition-all shadow-md 
                        ${
                          isOutOfStock
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
        </div>
      </section>
    </>
  );
}
