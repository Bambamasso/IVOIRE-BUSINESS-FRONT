"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoClose, IoSave } from "react-icons/io5";
import axios from "axios";
import toast from "react-hot-toast"; // import manquant ajouté

export default function EditCategorie({
  editOpen,
  onClose,
  categorie,
  refresh,
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    image: null, // null pour fichier File
    imagePreview: "", // ✅ pour l'aperçu local
    parent_category_id: "",
  });
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (editOpen) {
      fetchCategories();
      setFormData({
        name: categorie?.name || "",
        parent_category_id: categorie?.parent_id || "",
        image: null,
        imagePreview: categorie?.image // charge l'image existante
          ? `${baseUrl}/storage/${categorie.image}`
          : "",
      });
    }
  }, [editOpen]);

  const fetchCategories = async () => {
    const token = JSON.parse(localStorage.getItem("admin_token"));
    try {
      const response = await axios.get(`${baseUrl}/api/admin/categories/all/gategories`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      setCategories(response.data.data || response.data);
    } catch (err) {
      console.error("Erreur chargement catégories:", err);
    }
  };

  if (!editOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file), // ✅ aperçu local
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); //
    const token = JSON.parse(localStorage.getItem("admin_token"));

    //
    const data = new FormData();
    data.append("name", formData.name);
    data.append("parent_category_id", formData.parent_category_id || "");
    if (formData.image) data.append("image", formData.image);
    data.append("_method", "PUT"); //  Laravel method spoofing

    try {
      const response = await axios.post(
        `${baseUrl}/api/admin/categories/${categorie.id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 200) {
        refresh();
        onClose();
        toast.success("Catégorie mise à jour avec succès.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Erreur lors de la mise à jour.",
      );
      console.error("Erreur:", error.response?.data || error);
    } finally {
      setLoading(false); // toujours reset le loading
    }
  };

  return (
    <div
      id="popup-modal"
      tabIndex={-1}
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
            <span className="sr-only">Fermer la modale</span>
          </button>

          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Modifier la catégorie
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom de la catégorie
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Électronique, Vêtements..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Image de la catégorie
              </label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange} //
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
               
                {formData.imagePreview && (
                  <div className="w-24 h-24 flex-shrink-0">
                    <img
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

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Catégorie parent
              </label>
             
              <select
                value={formData.parent_category_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    parent_category_id: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Aucune (Catégorie principale) --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 transition font-medium"
                onClick={onClose}
                disabled={loading}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#93b86a] text-white rounded-lg hover:bg-[#83c13c] transition font-medium"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="animate-spin"></span>
                    Modification en cours...
                     <IoSave size={18} />
                  </>
                ) : (
                  "Modifier" // 
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
