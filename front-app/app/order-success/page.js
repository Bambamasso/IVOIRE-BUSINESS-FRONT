"use client";
import { useEffect } from "react";
import { useCart } from "@/app/context/CartContext";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SlCheck, SlBasketLoaded } from "react-icons/sl";

export default function OrderSuccess() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="bg-[#e0f4cc] p-5 rounded-full text-[#93b86a] animate-bounce">
            <SlCheck size={48} strokeWidth={20} />
          </div>
        </div>

        <h1 className="text-3xl font-black text-gray-800 mb-2">
          Félicitations !
        </h1>
        <p className="text-gray-500 mb-8">
          Votre commande a été reçue et est en cours de traitement. Un email de
          confirmation vous a été envoyé.
        </p>

        <div className="bg-gray-50 rounded-2xl p-5 mb-8 border border-dashed border-gray-200">
          <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">
            Référence de commande
          </p>
          <p className="text-xl font-mono font-bold text-[#93b86a]">
            {ref || "---"}
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/vente"
            className="block w-full bg-[#93b86a] text-white py-4 rounded-xl font-bold hover:bg-[#7aa85a] transition-all shadow-lg shadow-green-100"
          >
            Continuer mes achats
          </Link>
          <Link
            href="/"
            className="block w-full text-gray-400 hover:text-gray-600 font-semibold text-sm transition-colors"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
