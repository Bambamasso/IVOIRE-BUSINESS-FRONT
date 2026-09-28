"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export function Categories() {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const url = baseUrl + "/api/home/categories";
  const [allCategories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(url);
        console.log(response.data);

        const data = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];
        setCategories(data);
      } catch (error) {
        console.error("erreur réseau:", error);
        setCategories([]); // Définir un tableau vide en cas d'erreur
      }
    };
    fetchCategories();
  }, []);

  return (
    <section className="bg-[#f9f8f3] dark:bg-gray-950 py-16 text-center">
      <h2 className="text-3xl font-serif text-gray-900 mb-6 p-2">
        Catégories des produits
      </h2>

      {/* Conteneur défilant sur mobile, grille centrée sur desktop */}
      <div className="flex overflow-x-auto pb-4 md:pb-0 md:justify-center gap-8 px-4 no-scrollbar">
        {allCategories.map((categorie) => (
          <div
            key={categorie.id}
            className="flex-shrink-0 flex flex-col items-center group cursor-pointer"
          >
            <Link href={`/vente/products_categorie/${categorie.id}`}>
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-sm transition-transform group-hover:scale-105 bg-gray-200">
                {categorie.image && (
                  <img
                    src={`${baseUrl}/storage/${categorie.image}`}
                    alt={categorie.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </Link>
            <h3 className="mt-4 font-bold text-gray-900 uppercase tracking-wider text-xs">
              {categorie.name}
            </h3>
            <p className="text-gray-400 text-[10px]">
              {categorie.products} Produits
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
