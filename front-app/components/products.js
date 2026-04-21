"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Products() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const url = baseUrl + "/api/home/all-product";
  const [allProducts, setAllProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(url);
        console.log(response.data.data);
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];
        setAllProducts(data);
      } catch (error) {
        console.error("erreur réseau:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 py-12 lg:py-16">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Offres en vedette
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Quelques exemples doffres que vos clients pourront voir sur la
              plateforme.
            </p>
          </div>
          <Link
            href="/offers"
            className="hidden sm:inline-flex px-4 py-2 rounded-lg bg-[#93b86a] text-white text-sm font-semibold"
          >
            Voir toutes les offres
          </Link>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {allProducts.map((product) => {
            // Détection badge (exemple: product.isNew, product.isOnSale)
            const isNew = product.isNew;
            const isOnSale = product.isOnSale;
            const hasPromo = product.old_price && product.old_price > product.price;
            return (
              <div
                key={product.id}
                className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col hover:shadow-2xl transition-shadow duration-200"
              >
                {/* Badge SALE/NEW */}
                {(isOnSale || isNew) && (
                  <span
                    className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white z-10 ${isOnSale ? 'bg-yellow-500' : 'bg-green-600'}`}
                  >
                    {isOnSale ? 'SALE' : 'NEW'}
                  </span>
                )}
                {/* Image produit */}
                <div className="flex items-center justify-center h-52 sm:h-60 bg-gray-100 dark:bg-gray-800 p-4">
                  <img
                    src={`${baseUrl}/storage/${product.media?.[0]?.file_path || ''}`}
                    alt={product.title}
                    className="object-contain h-44 sm:h-52 w-auto max-w-full rounded-md"
                  />
                </div>
                {/* Infos produit */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1 truncate">
                    {product.title}
                  </h3>
                 
                  <div className="mb-4">
                    {hasPromo ? (
                      <>
                        <span className="text-lg font-bold text-yellow-600 mr-2">${product.price}</span>
                        <span className="text-sm line-through text-gray-400">${product.old_price}</span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-gray-900 dark:text-white">${product.price}</span>
                    )}
                  </div>
                  <Link
                    href={`/show/${product.id}`}
                    className="w-full py-2 rounded-lg bg-[#93b86a] hover:bg-[#7aa85a] text-white font-semibold text-sm transition text-center"
                  >
                    Voir l'article
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 sm:hidden text-center">
          <Link
            href="/offers"
            className="inline-flex px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
          >
            Voir toutes les offres
          </Link>
        </div>
      </div>
    </section>
  );
}
