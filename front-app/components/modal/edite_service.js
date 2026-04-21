"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { IoSave, IoClose } from "react-icons/io5";

export default function EditService({ onClose, openEdit, serviceId, onRefresh,serviceData }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
  });

  // Utilisation de useEffect pour remplir le formulaire quand on reçoit le service
  useEffect(() => {
    if (serviceData) {
      setFormData({
        name: serviceData.name || "",
        price: serviceData.price || "",
        description: serviceData.description || "",
      });
    }
  }, [serviceData]);

  if (!openEdit) return null;

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loader = toast.loading("Mise à jour du service...");

    try {
      const token = JSON.parse(localStorage.getItem("admin_token"));
      const response = await axios.put(
        `${baseUrl}/api/admin/services/${serviceId}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        
        toast.success("Service mis à jour !", { id: loader });
        onRefresh(); // On rafraîchit la liste des services sur la page parente
        onClose(); // On ferme la modale
      }
    } catch (error) {
     
      console.error(error);
      toast.error(error.response?.data?.message || "Erreur lors de la mise à jour", { id: loader });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative bg-white w-full max-w-lg rounded-[40px] shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-black text-gray-900">Modifier le service</h2>
          <button onClick={onClose} className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-gray-900">
            <IoClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nom */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Nom du service</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#93b86a]/20 transition-all"
            />
          </div>

          {/* Prix */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Prix (FCFA)</label>
            <input
              type="number"
              name="price"
              required
              value={formData.price}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#93b86a]/20 transition-all"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Description</label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#93b86a]/20 transition-all resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 text-gray-400 font-black text-xs uppercase"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-4 bg-[#93b86a] text-white rounded-2xl font-black text-xs shadow-lg shadow-[#93b86a]/20 flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Enregistrement..." : "Mettre à jour"}
              <IoSave size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}