"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function DeleteCategorie({
  isOpen,
  onClose,
  refresh,
  categorie_id,
}) {
  const [loading, setLoading] = useState(false);

  // Ne pas afficher la modale si elle n'est pas ouverte
  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);

    try {
      const stored = localStorage.getItem("admin_token");
      if (!stored) throw new Error("Jeton manquant");
      let token;
      try {
        token = JSON.parse(stored);
      } catch {
        token = stored;
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const url = `${baseUrl}/api/admin/categories/${categorie_id}`;

      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.data.status === "success") {
        toast.success("Catégorie supprimée avec succès !");
        refresh();
        onClose();
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err.message ||
          "Erreur lors de la suppression",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="popup-modal"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black/60 backdrop-blur-sm p-4"
    >
      <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden">
        {/* Ligne de rappel rouge (action destructive) */}
        <div className="h-2 bg-red-500 w-full" />

        <div className="p-8">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-black text-gray-900">
              Supprimer la catégorie
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span className="sr-only">Fermer la modale</span>
            </button>
          </div>

          <div className="text-center py-4">
            <svg
              className="mx-auto mb-4 text-red-400 w-12 h-12"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <p className="text-sm font-bold text-gray-600">
              Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette
              action est irréversible.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all disabled:opacity-50"
            >
              {loading ? "Suppression..." : "Oui, supprimer"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all disabled:opacity-50"
            >
              Non, annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
