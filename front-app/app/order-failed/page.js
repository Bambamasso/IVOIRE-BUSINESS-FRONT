"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SlClose, SlPhone } from "react-icons/sl";

export default function OrderFailed() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="bg-red-50 p-5 rounded-full text-red-500">
            <SlClose size={48} strokeWidth={20} />
          </div>
        </div>

        <h1 className="text-3xl font-black text-gray-800 mb-2">Oups !</h1>
        <p className="text-gray-500 mb-6">
          Nous n'avons pas pu finaliser votre paiement.
          {reason && (
            <span className="block mt-2 font-medium text-red-400 font-italic italic">
              "{reason}"
            </span>
          )}
        </p>

        <div className="bg-red-50/50 rounded-2xl p-4 mb-8 text-sm text-gray-600 leading-relaxed text-left">
          <p className="font-bold mb-1">Conseils :</p>
          <ul className="list-disc list-inside space-y-1 opacity-80">
            <li>Vérifiez votre solde Mobile Money / Compte.</li>
            <li>
              Assurez-vous d'avoir validé l'autorisation sur votre téléphone.
            </li>
            <li>Le stock est peut-être épuisé.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link
            href="/vente"
            className="block w-full bg-gray-800 text-white py-4 rounded-xl font-bold hover:bg-gray-900 transition-all shadow-lg"
          >
            Réessayer le paiement
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full text-gray-500 hover:text-gray-800 font-semibold text-sm transition-colors"
          >
            <SlPhone size={14} />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
