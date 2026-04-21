"use client";
import { useState, useEffect } from "react";
import AdminLayout from "../layaut";
import ProductForm from "@/components/product_form";
import { RiAddLine, RiSearchLine, RiEyeLine } from "react-icons/ri";
import axios from "axios";
import Link from "next/link";

export default function ProductsPage() {
  // Données d'exemple (à remplacer par ton fetch API plus tard)
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [handelOpenModal, setHandleOpenModal] = useState(false);
  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const token = JSON.parse(localStorage.getItem("admin_token"));
    const fetchProducts = async () => {
      // Remplacer cette partie par ton appel API réel
      const response = await axios.get(`${baseUrl}/api/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data.data;
      console.log("Produits chargés :", data);
      setProducts(data);
    };

    fetchProducts();
  }, []);

  //

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header de section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Catalogue Produits
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              Gérez votre inventaire et vos prix.
            </p>
          </div>
          <button
            onClick={() => setHandleOpenModal(true)}
            className="flex items-center justify-center gap-2 bg-[#93b86a] hover:bg-[#7fa359] text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-[#93b86a]/20"
          >
            <RiAddLine size={20} />
            Ajouter un produit
          </button>
        </div>

        {/* Barre d'outils (Recherche) */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center">
          <div className="relative flex-1 max-w-md">
            <RiSearchLine
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Rechercher un produit, une catégorie..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#93b86a] transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tableau */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                  <th className="p-4 text-left">Produit</th>
                  <th className="p-4 text-left">Catégorie</th>
                  <th className="p-4 text-left">Stock Total</th>
                  <th className="p-4 text-left">Prix Base</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50/80 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900 dark:text-white">
                        {product.title}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm px-2.5 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400 font-medium">
                        {product.categorie?.name || "Non catégorisé"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#93b86a]">
                      {product.stock_quantity}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ">
                        {new Intl.NumberFormat("fr-FR").format(product.price)}{" "}
                        FCFA
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <Link
                          href={`show/${product.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="Voir"
                        >
                          <RiEyeLine size={18} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {products.length === 0 && (
            <div className="py-12 text-center text-gray-500 font-medium italic">
              Aucun produit trouvé...
            </div>
          )}
        </div>

        {/* Modal d'ajout/modification */}
        {/* {showModal && (
          
        )} */}
        <ProductForm
           isOpen={handelOpenModal}
           onClose={()=>setHandleOpenModal(false)} 
            
          />
      </div>
    </AdminLayout>
  );
}
