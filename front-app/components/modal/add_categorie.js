"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function CreatCategorie({ addOpen, onClose, onConfirm }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  
  // ✅ États séparés pour chaque champ
  const [name, setName] = useState("");
  const [image, setImage] = useState(null); // ← File object, pas string
  const [imagePreview, setImagePreview] = useState(null); // ← Pour l'aperçu
  const [parent_id, setParentId] = useState("");

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (addOpen) {
      fetchCategories();
    }
  }, [addOpen]);

  const fetchCategories = async () => {
    const stored = localStorage.getItem("admin_token");
    if (!stored) {
      router.push("/admin/login");
      return;
    }
    
    let token;
    try {
      token = JSON.parse(stored);
    } catch {
      token = stored;
    }
    
    try {
      const response = await axios.get(`${baseUrl}/api/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      setCategories(response.data.data || response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des catégories:", err);
      toast.error("Erreur lors du chargement des catégories");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error("L'image ne doit pas dépasser 5MB");
        return;
      }

      // Vérifier le type
      if (!file.type.startsWith('image/')) {
        toast.error("Le fichier doit être une image");
        return;
      }

      setImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!addOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('name', name);
    
    if (image) {
      formData.append('image', image);
    }
    
    if (parent_id) {
      formData.append('parent_id', parent_id);
    }

    const url = `${baseUrl}/api/categories`;
    
    try {
      const stored = localStorage.getItem("admin_token");
      if (!stored) {
        throw new Error("Jeton manquant");
      }

      let token;
      try {
        token = JSON.parse(stored);
      } catch {
        token = stored;
      }

      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Réponse du serveur:', response.data);

      if (response.data.status === "success") {
        toast.success("Catégorie créée avec succès !");
        
        // Réinitialiser le formulaire
        setName("");
        setImage(null);
        setImagePreview(null);
        setParentId("");
        
        setLoading(false);
        
        // Fermer et rafraîchir
        setTimeout(() => {
          onClose();
          if (onConfirm) onConfirm();
        }, 1000);
      }
    } catch (error) {
      setLoading(false);
      console.error('Erreur complète:', error);
      console.error('Réponse erreur:', error?.response?.data);
      
      const errorMessage = 
        error?.response?.data?.message || 
        error?.message || 
        "Erreur lors de la création";
      
      // Afficher les erreurs de validation
      if (error?.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        Object.keys(validationErrors).forEach(field => {
          validationErrors[field].forEach(msg => {
            toast.error(`${field}: ${msg}`);
          });
        });
      } else {
        toast.error(errorMessage);
      }
      
      setError(errorMessage);
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

           
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nom de la catégorie *
                </label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Électronique, Vêtements..."
                />
              </div>

              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Image de la catégorie
                </label>
                
                {imagePreview && (
                  <div className="mb-4 relative w-32 h-32">
                    <Image
                      src={imagePreview}
                      alt="Aperçu"
                      fill
                      className="object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setImagePreview(null);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <IoClose size={16} />
                    </button>
                  </div>
                )}

                <div className="flex gap-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Formats acceptés: JPG, PNG, GIF (Max 5MB)
                </p>
              </div>

              {/* Catégorie parent */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Catégorie parent (optionnel - pour sous-catégorie)
                </label>
                <select
                  name="parent_category_id"
                  value={parent_id}
                  onChange={(e) => setParentId(e.target.value)}
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
                  Sélectionnez une catégorie parent si c``est une sous-catégorie
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
      
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 5000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
    </>
  );
}