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
    parent_id: "",
  });
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (editOpen) {
      fetchCategories();
      setFormData({
        name: categorie?.name || "",
        parent_id: categorie?.parent_id || "",
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
      const response = await axios.get(`${baseUrl}/api/admin/categories/all/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      setCategories(response.data.data || response.data);
    } catch (err) {
      console.error("Erreur chargement catégories:", err);
      toast.error("Erreur lors du chargement des catégories");
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
    data.append("parent_id", formData.parent_id || "");
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
      className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black/60 backdrop-blur-sm p-4"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
          <button
            type="button"
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition"
            onClick={onClose}
          >
            <IoClose size={28} />
            <span className="sr-only">Fermer la modale</span>
          </button>

          <h2 className="text-xl font-black text-gray-900 mb-6">
            Modifier la catégorie
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                Nom de la catégorie
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#93b86a]/20 transition-all"
                placeholder="Ex: Électronique, Vêtements..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                Image de la catégorie
              </label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange} //
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#93b86a]/20 transition-all"
                  />
                </div>

                {formData.imagePreview && (
                  <div className="w-24 h-24 flex-shrink-0">
                    <img
                      src={formData.imagePreview}
                      alt="Aperçu"
                      className="w-full h-full object-cover rounded-2xl border border-gray-200"
                    />
                  </div>
                )}
              </div>
              <p className="mt-2 text-xs text-gray-400 font-medium ml-2">
                Formats acceptés: JPG, PNG, GIF (Max 5MB)
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                Catégorie parent
              </label>

              <select
                value={formData.parent_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    parent_id: e.target.value,
                  })
                }
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#93b86a]/20 transition-all"
              >
                <option value="">-- Aucune (Catégorie principale) --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 py-4 bg-[#93b86a] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] shadow-lg shadow-[#93b86a]/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Modification en cours...
                  </>
                ) : (
                  <>
                    <IoSave size={16} />
                    Modifier
                  </>
                )}
              </button>
              <button
                type="button"
                className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all disabled:opacity-50"
                onClick={onClose}
                disabled={loading}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
