"use client";

import Link from "next/link";

export default function SuccessModal({ show, onClose }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 animate-fade-in">
        <div className="text-center">
          {/* Icône de succès */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h3 className="text-xl font-bold mb-2">Produit ajouté !</h3>
          <p className="text-gray-600 mb-6">Le produit a été ajouté à votre panier</p>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 px-4 py-2 rounded hover:bg-gray-50"
            >
              Continuer mes achats
            </button>
            <Link href="/vente/cart"
             
              className="flex-1 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Voir le panier
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}