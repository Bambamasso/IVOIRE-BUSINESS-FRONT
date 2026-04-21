"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
export default function CreateMedia({ isOpen, onClose, product_id }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  // Ne pas afficher la modale si elle n'est pas ouverte
  if (!isOpen) return null;
  // Gérer la sélection de fichiers
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setPreviews(selectedFiles.map((file) => URL.createObjectURL(file)));
  };

  // Gérer l'upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.error("Veuillez sélectionner au moins une image.");
      return;
    }
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
      const url = `${baseUrl}/api/products/create-media/product/${product_id}`;
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files[]", file);
      });
      await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Images ajoutées avec succès !");
      setFiles([]);
      setPreviews([]);
      setLoading(false);
      onClose();
      router.refresh();
    } catch (err) {
      setLoading(false);
      toast.error(
        err?.response?.data?.message ||
          err.message ||
          "Erreur lors de l'ajout des images",
      );
    }
  };

  return (
    <>
      <div
        id="popup-modal"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black/50"
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow p-4 md:p-6">
            <button
              type="button"
              className="absolute top-3 right-2.5 text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 inline-flex justify-center items-center"
              onClick={onClose}
            >
              <svg
                className="w-5 h-5"
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
                  d="M6 18 17.94 6M18 18 6.06 6"
                />
              </svg>
              <span className="sr-only">Fermer la modale</span>
            </button>
            <form className="p-4 md:p-5 text-center" onSubmit={handleUpload}>
              <svg
                className="mx-auto mb-4 text-fg-disabled w-12 h-12"
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
              <h3 className="mb-6 text-body">Ajouter des images au produit</h3>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
              />
              {previews.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4 justify-center">
                  {previews.map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt={`Aperçu ${idx + 1}`}
                      className="w-16 h-16 object-cover rounded-lg border"
                    />
                  ))}
                </div>
              )}
              <div className="flex items-center space-x-4 justify-center">
                <button
                  type="submit"
                  className="bg-[#93b86a] text-white font-bold px-4 py-2.5 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? "Ajout..." : "Ajouter les images"}
                </button>
                <button
                  type="button"
                  className="text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={onClose}
                  disabled={loading}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
        {/* Toaster déplacé dans layout.js */}
      </div>
    </>
  );
}
