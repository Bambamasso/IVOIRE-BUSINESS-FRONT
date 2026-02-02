"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import axios from "axios";

export default function EditCategorie({ editOpen, onClose, onConfirm,user_id }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    parent_category_id: null,
    imagePreview: null,
  });

  useEffect(() => {
    if (editOpen) {
      fetchCategories();
    }
  }, [editOpen]);

  // Récupérer les catégories existantes pour le select parent
  const fetchCategories = async () => {
    const stored = localStorage.getItem("admin_token");
    if (!stored) {
      router.push("/admin/login");
      return;
    }
    let token;
 
    try {
      token = JSON.parse(stored);
    //   
    } catch {
      token = stored;
    }
    try {
      
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;

      const response = await axios.get(`${baseUrl}/api/categories`,{
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
      });
      setCategories(response.data.data || response.data);

    } catch (err) {
      console.error("Erreur lors du chargement des catégories:", err);
    }
    
  };

  if (!editOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: file,
          imagePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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
      
      // Créer un FormData pour envoyer l'image
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }
      if (formData.parent_category_id) {
        formDataToSend.append("parent_category_id", formData.parent_category_id);
      }

      await axios.post(`${baseUrl}/api/categories`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setLoading(false);
      setFormData({ name: "", image: null, parent_category_id: null, imagePreview: null });
      onClose();
      if (onConfirm) onConfirm();
    } catch (err) {
      setLoading(false);
      setError(
        err?.response?.data?.message || err.message || "Erreur lors de la création"
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
        className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black/50 p-4"
      >
        <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="relative bg-white rounded-lg shadow-lg p-6 dark:bg-gray-800">
            {/* Bouton fermer */}
            <button
              type="button"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
              onClick={onClose}
            >
              <IoClose size={28} />
              <span className="sr-only">Fermer la modale</span>
            </button>

            {/* Titre */}
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              Créer une catégorie
            </h2>

            {/* Message d'erreur */}
            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nom de la catégorie *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
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
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {formData.imagePreview && (
                    <div className="w-24 h-24 flex-shrink-0">
                      <Image
                        src={formData.imagePreview}
                        alt="Aperçu"
                        className="w-full h-full object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                      />
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Formats acceptés: JPG, PNG, GIF (Max 5MB)
                </p>
              </div>

              {/* Catégorie parent (Sous-catégorie) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Catégorie parent (optionnel - pour sous-catégorie)
                </label>
                <select
                  name="parent_category_id"
                  value={formData.parent_category_id || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Aucune (Catégorie principale) --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Sélectionnez une catégorie parent si une sous-catégorie
                </p>
              </div>

              {/* Boutons */}
              <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-700 transition font-medium"
                  onClick={onClose}
                  disabled={loading}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Création en cours...
                    </>
                  ) : (
                    "Créer la catégorie"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
