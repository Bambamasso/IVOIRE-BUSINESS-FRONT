"use client";

import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export default function DeleteProject({
  openDelete,
  onClose,
  project,
  refresh,
}) {
  const [loading, setLoading] = useState(false);

  // Ne pas afficher la modale si elle n'est pas ouverte
  if (!openDelete) return null;

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleConfirm = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const token = JSON.parse(localStorage.getItem("admin_token"));
      const url = `${baseUrl}/api/admin/projects/${project.id}`;

      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.data.status === "success") {
        toast.success("Projet supprimé avec succès !");
        onClose();
        refresh();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Erreur lors de la suppression du projet.",
      );
      console.error(
        "Erreur lors de la suppression du projet :",
        error.response?.data || error,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black/60 backdrop-blur-sm p-4">
      <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden">
        {/* Ligne de rappel Rouge */}
        <div className="h-2 bg-red-500 w-full" />

        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-gray-900">
              Supprimer le projet
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              type="button"
              disabled={loading}
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
            </button>
          </div>

          <div className="text-center pb-2">
            <svg
              className="mx-auto mb-4 text-red-400 w-12 h-12"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
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
            <p className="text-sm font-bold text-gray-700">
              Êtes-vous sûr de vouloir supprimer ce projet ?
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Cette action est irréversible.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Suppression..." : "Oui, supprimer"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Non, annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
