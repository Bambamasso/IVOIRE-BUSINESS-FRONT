"use client";

import Navbar from "@/components/navigation";
import { useCart } from "../../context/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaTrashAlt, FaShoppingBag, FaArrowLeft } from 'react-icons/fa';
import Footer from "@/components/footer";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    getTotal,
    getTotalItems,
    isLoading,
    isAuthenticated,
    loadCartFromAPI,
    loadCartFromLocalStorage,
  } = useCart();
  const router = useRouter();

  // Recharger le panier si l'état d'authentification change
  useEffect(() => {
    if (isAuthenticated) {
      loadCartFromAPI();
    } else {
      loadCartFromLocalStorage();
    }
  }, [isAuthenticated, loadCartFromAPI, loadCartFromLocalStorage]);

  // const handleOrder = () => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     router.push(`/login?redirect=/cart`);
  //     return;
  //   }
  //   router.push("/checkout");
  // };

  const isEmpty = getTotalItems() === 0;

  // ── PANIER VIDE ──
  if (!isLoading && isEmpty) {
    return (
      <>
        <Navbar />
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
            <FaShoppingBag size={40} />
          </div>
          <h1 className="text-2xl font-black text-gray-800 mb-2 uppercase tracking-tighter">
            Votre panier est vide
          </h1>
          <p className="text-gray-500 mb-8 text-center">
            Il semble que vous n'ayez pas encore ajouté de produits.
          </p>
          <Link
            href="/vente"
            className="bg-[#93b86a] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#7fa75a] transition-all shadow-lg uppercase text-sm"
          >
            Découvrir nos produits
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  // ── LOADING ──
  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-[#93b86a] rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium italic">
              Préparation de votre panier...
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen pb-20">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center gap-4 mb-10 pt-8">
            <h1 className="text-3xl md:text-4xl font-black text-gray-800 uppercase tracking-tighter">
              Mon <span className="text-[#93b86a]">Panier</span>
            </h1>
            <span className="bg-[#e8d393] text-white px-3 py-1 rounded-full text-xs font-bold">
              {getTotalItems()} articles
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            {/* ── Liste des produits ── */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => {
                const productName = item.title;
                const price = item.price;
                const image = item.image;
                const attributes = item.variant?.attribut_values || [];

                return (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row gap-6 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    {/* Image */}
                    <div className="w-full sm:w-32 h-32 bg-gray-50 rounded-xl relative flex-shrink-0 overflow-hidden border border-gray-50">
                      {image && (
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${image}`}
                          alt={productName}
                          className="object-cover w-full h-full"
                        />
                      )}
                    </div>

                    {/* Infos & Actions */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-lg text-gray-800 uppercase tracking-tight">
                            {productName}
                          </h3>
                          <p className="font-black text-[#93b86a] text-lg">
                            {price.toLocaleString()} FCFA
                          </p>
                        </div>

                        {/* Variantes */}
                        {attributes.length > 0 && (
                          <div className="flex gap-2 mt-2 flex-wrap">
                            {attributes.map((av) => (
                              <span
                                key={av.id}
                                className="text-[10px] bg-gray-50 text-gray-500 font-bold uppercase border border-gray-100 px-2 py-1 rounded-md"
                              >
                                {av.attribut?.name}: {av.value}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Contrôles de quantité */}
                      <div className="flex items-center justify-between mt-6">
                        <div className="flex items-center bg-gray-100 rounded-lg p-1">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-colors font-bold text-gray-600"
                          >
                            -
                          </button>
                          <span className="w-10 text-center font-bold text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-colors font-bold text-gray-600"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-400 hover:text-red-600 transition-colors flex items-center gap-2 text-xs font-bold uppercase"
                        >
                          <FaTrashAlt /> Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              <Link
                href="/vente"
                className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#93b86a] transition-colors mt-4"
              >
                <FaArrowLeft /> Continuer mes achats
              </Link>
            </div>

            {/* ── Résumé (Sticky) ── */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-28 border border-gray-50">
                <h2 className="text-xl font-black text-gray-800 mb-6 uppercase tracking-tighter">
                  Résumé de la commande
                </h2>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>Sous-total</span>
                    <span className="font-semibold text-gray-800">
                      {getTotal().toLocaleString()} FCFA
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>Livraison</span>
                    <span className="text-xs font-bold text-[#93b86a]">
                      Calculé à l'étape suivante
                    </span>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                    <span className="font-bold text-gray-800">Total TTC</span>
                    <div className="text-right">
                      <p className="text-2xl font-black text-[#93b86a] leading-none">
                        {getTotal().toLocaleString()} FCFA
                      </p>
                    </div>
                  </div>
                </div>

                <Link href="../vente/order"
                 
                  className="w-full bg-[#93b86a] text-white py-4 rounded-xl font-black hover:bg-[#e8d393] hover:text-gray-800 transition-all shadow-lg shadow-[#93b86a]/20 uppercase tracking-widest text-sm mb-4"
                >
                  Procéder au paiement
                </Link>

                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-[#e8d393] rounded-full animate-pulse"></div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight text-center">
                    Paiement sécurisé par Intellect I-B
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
