"use client";

import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast"; // ✅ Toaster retiré d'ici

// ✅ Fonction utilitaire token extraite — plus de répétition
const getToken = () => {
  const stored = localStorage.getItem("admin_token");
  if (!stored) throw new Error("Token manquant");
  try { return JSON.parse(stored); } catch { return stored; }
};

export default function CreateCategorie({ addOpen, onClose, refresh }) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [parentId, setParentId] = useState("");

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (addOpen) fetchCategories();
  }, [addOpen]);

  // ✅ Reset quand on ferme
  useEffect(() => {
    if (!addOpen) {
      setName("");
      setImage(null);
      setImagePreview(null);
      setParentId("");
    }
  }, [addOpen]);

  const fetchCategories = async () => {
    try {
      const token = getToken(); // ✅ utilitaire réutilisable
      const response = await axios.get(
        `${baseUrl}/api/admin/categories/all/gategories`,
        { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
      );
      setCategories(response.data.data || response.data);
    } catch (err) {
      console.error("Erreur chargement catégories:", err);
      toast.error("Erreur lors du chargement des catégories");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) return toast.error("L'image ne doit pas dépasser 5MB");
    if (!file.type.startsWith("image/")) return toast.error("Le fichier doit être une image");

    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    if (image) formData.append("image", image);
    if (parentId) formData.append("parent_id", parentId);

    try {
      const token = getToken(); // ✅ même utilitaire
      const response = await axios.post(
        `${baseUrl}/api/admin/categories`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status === "success") {
        toast.success("Catégorie créée avec succès !");
        refresh();  // ✅ appelés une seule fois
        onClose();
      }
    } catch (error) {
      console.error("Erreur:", error?.response?.data);

      // ✅ Erreurs de validation Laravel
      const validationErrors = error?.response?.data?.errors;
      if (validationErrors) {
        Object.values(validationErrors)
          .flat()
          .forEach((msg) => toast.error(msg));
      } else {
        toast.error(error?.response?.data?.message || "Erreur lors de la création");
      }
    } finally {
      setLoading(false); // ✅ toujours exécuté
    }
  };

  if (!addOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black/50 p-4"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="relative bg-white rounded-lg shadow-lg p-6 dark:bg-gray-800">
          <button
            type="button"
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
            onClick={onClose}
          >
            <IoClose size={28} />
            <span className="sr-only">Fermer</span>
          </button>

          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Créer une catégorie
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom de la catégorie *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Électronique, Vêtements..."
              />
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Image de la catégorie
              </label>

              {imagePreview && (
                <div className="mb-4 relative w-32 h-32">
                  <Image src={imagePreview} alt="Aperçu" fill className="object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => { setImage(null); setImagePreview(null); }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <IoClose size={16} />
                  </button>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Formats acceptés: JPG, PNG, GIF (Max 5MB)
              </p>
            </div>

            {/* Catégorie parent */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Catégorie parent (optionnel)
              </label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Aucune (Catégorie principale) --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Boutons */}
            <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 transition font-medium"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-[#93b86a] text-white rounded-lg hover:bg-[#7aa85a] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? <><span className="animate-spin">⏳</span> Création en cours...</> : "Créer la catégorie"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}