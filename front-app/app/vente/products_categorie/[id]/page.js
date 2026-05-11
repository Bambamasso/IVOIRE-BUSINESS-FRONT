"use client";
import Footer from "@/components/footer";
import Navbar from "@/components/navigation";
import axios from "axios";
import * as React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
export default function ProductsByCategory({ params }) {
  const { id } = React.use(params);
  const [products, setProducts] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        // Appel direct à ta nouvelle route
        const response = await axios.get(
          `${baseUrl}/api/home/products/category/${id}`,
        );

        if (response.data.status === "success") {
          const productsList = response.data.data;
          setProducts(productsList);

          if (productsList.length > 0) {
            setCategoryInfo(productsList[0].categorie);
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCategoryProducts();
  }, [id]);
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Bouton retour discret tout en haut */}

      {/* Header Boutique */}
      <section className="bg-[#93b86a] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1 mb-4 text-xs font-bold tracking-[0.2em] uppercase text-[#e8d393] border border-[#e8d393]/30 rounded-full bg-white/10">
            Intellect IVOIRE-BUSINESS Shop
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 italic uppercase tracking-tight">
            NOS{" "}
            <span className="text-[#e8d393]">
              {categoryInfo?.name || "PRODUITS"}
            </span>
          </h1>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 pb-20">
        {/* Grille des Produits */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-2">
          <Link
            href="/vente"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#93b86a] transition-colors mb-4"
          >
            <FaArrowLeft /> Retour à la boutique
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => {
            // Vérification du statut de stock (basé sur tes codes : 'available' ou 'out-of-stock')
            const isOutOfStock = product.status?.code === "out-of-stock";

            return (
              <div
                key={product.id}
                className={`group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ${isOutOfStock ? "opacity-80" : "hover:shadow-xl"}`}
              >
                {/* Image du produit avec Overlay si rupture */}
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

                  {/* Badge de statut */}
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

                  {/* Prix avec la couleur demandée #e8d393 */}
                  <div className="absolute bottom-4 right-4">
                    <span className="bg-black/70 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-black text-[#e8d393]">
                      {product.price} FCFA
                    </span>
                  </div>
                </div>

                {/* Détails */}
                <div className="p-6">
                  <h3 className="text-sm font-black text-gray-800 uppercase mb-2 line-clamp-1">
                    {product.title}
                  </h3>
                  <p className="text-gray-500 text-xs mb-6 line-clamp-2 italic h-8">
                    {product.description}
                  </p>
                  {/* Bouton dynamique */}
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
      </main>

      <Footer />
    </div>
  );
}
