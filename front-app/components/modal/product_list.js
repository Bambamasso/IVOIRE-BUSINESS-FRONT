import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoTrash } from "react-icons/io5";
import { RiEyeLine } from "react-icons/ri";
import DeleteProduct from "./delete_product";

export default function ProductList({ route, refreshFlag }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [pagination, setPagination] = useState({});
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const fetchProducts = async (page = 1) => {
    const token = JSON.parse(localStorage.getItem("admin_token"));
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}${route}?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data.data.data || [];
      setProducts(data);
      setPagination(response.data.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [route, refreshFlag]);

  return (
    <>
      <div className="space-y-6">
        {/* Conteneur principal avec le style identique à ton premier tableau */}
        <div className="bg-white rounded-[32px] border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                {/* En-tête avec typographie minimaliste et espacement large */}
                <tr className="bg-gray-50/50 border-b border-gray-200 text-[10px] font-black uppercase text-gray-500 tracking-widest">
                  <th className="px-8 py-6">Produit</th>
                  <th className="px-6 py-6">Catégorie</th>
                  <th className="px-6 py-6 text-center">Stock Total</th>
                  <th className="px-6 py-6 text-center">Prix Base</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-8 py-20 text-center text-gray-400 font-bold italic"
                    >
                      Chargement ...
                    </td>
                  </tr>
                ) : products.length > 0 ? (
                  products.map((product) => (
                    <tr
                      key={product.id}
                      className="group hover:bg-[#93b86a]/5 transition-colors"
                    >
                      {/* Nom du Produit */}
                      <td className="px-8 py-5">
                        <p className="text-sm font-black text-gray-900 leading-tight">
                          {product.title}
                        </p>
                      </td>

                      {/* Catégorie avec Badge arrondi */}
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-wider">
                          {product.categorie?.name || "Sans catégorie"}
                        </span>
                      </td>

                      {/* Stock avec ta couleur verte */}
                      <td className="px-6 py-5 text-center">
                        <span className="text-sm font-black text-[#93b86a]">
                          {product.stock_quantity !== null
                            ? product.stock_quantity
                            : (Array.isArray(product.variants)
                                ? product.variants
                                : []
                              ).reduce(
                                (total, variante) =>
                                  total + (variante.stock_quantity || 0),
                                0,
                              )}
                        </span>
                      </td>

                      {/* Prix formaté */}
                      <td className="px-6 py-5 text-center">
                        <span className="text-sm font-black text-gray-700">
                          {new Intl.NumberFormat("fr-FR").format(product.price)}{" "}
                          FCFA
                        </span>
                      </td>

                      {/* Actions avec le style icône dans carré arrondi */}
                      <td className="px-8 py-5">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`./show/${product.id}`}
                            className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-[#93b86a] hover:border-[#93b86a] shadow-sm transition-all"
                          >
                            <RiEyeLine size={18} />
                          </Link>

                          <button
                            onClick={() => {
                              setSelectedProductId(product.id);
                              setOpenDeleteModal(true);
                            }}
                            className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 shadow-sm transition-all"
                            title="Supprimer"
                          >
                            <IoTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-8 py-20 text-center text-gray-400 font-bold italic"
                    >
                      Aucun produit trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <DeleteProduct
            isOpen={openDeleteModal}
            onClose={() => setOpenDeleteModal(false)}
            product_id={selectedProductId}
            refresh={fetchProducts}
          />
          {/* Pagination avec ton style spécifique (w-9 h-9, font-black, text-[10px]) */}
          {pagination && pagination.last_page > 1 && (
            <div className="p-6 border-t border-gray-200 flex justify-center gap-2 bg-gray-50/30">
              {Array.from(
                { length: pagination.last_page },
                (_, i) => i + 1,
              ).map((p) => (
                <button
                  key={p}
                  onClick={() => fetchProducts(p)}
                  className={`w-9 h-9 rounded-xl font-black text-[10px] transition-all ${
                    pagination.current_page === p
                      ? "bg-[#93b86a] text-white shadow-lg shadow-[#93b86a]/20"
                      : "bg-white text-gray-400 border border-gray-200 shadow-sm hover:border-[#93b86a]/50"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
