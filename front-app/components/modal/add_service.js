"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CreateService({ onClose, openCreate, onRefresh }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "", // On garde "description" pour correspondre à ta DB
  });

  if (!openCreate) return null;

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e) => {
    // Empêche le rechargement et vérifie si déjà en cours
    if (e) e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const loader = toast.loading("Création du service...");

    try {
    
      const token = JSON.parse(localStorage.getItem("admin_token"));

      const response = await axios.post(
        `${baseUrl}/api/admin/services`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("Nouveau service ajouté !", { id: loader });
        onRefresh();
        onClose();
        setFormData({ name: "", price: "", description: "" }); // Reset
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de la création du service.", )
       console.error("Erreur lors de la création du service :", error.response?.data || error);
      // Log uniquement si l'objet contient des champs utiles
      
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    // Utilise le "name" de l'input pour mettre à jour la bonne clé
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black/60 backdrop-blur-sm p-4">
      <div className="relative bg-white rounded-[32px] shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden">
        <div className="h-2 bg-[#e8d393] w-full" />

        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-gray-900">
              Ajouter un service
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">
                Nom du service
              </label>
              <input
                type="text"
                name="name" // Doit correspondre à la clé dans formData
                // required
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Nettoyage de bureaux"
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#93b86a]/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">
                Prix standard (FCFA)
              </label>
              <input
                type="number"
                name="price" // Doit correspondre à la clé dans formData
                required
                value={formData.price}
                onChange={handleChange}
                placeholder="Ex: 25000"
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#93b86a]/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">
                Description
              </label>
              <textarea
                name="description" // CORRIGÉ : était "description", doit être "description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez brièvement le service..."
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#93b86a]/20 transition-all resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-4 bg-[#93b86a] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] shadow-lg shadow-[#93b86a]/20 transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Création..." : "Ajouter le service"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
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
