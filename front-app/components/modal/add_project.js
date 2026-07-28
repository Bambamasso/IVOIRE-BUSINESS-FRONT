"use client";

import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CreateProject({ onClose, refresh, openCreate }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    location: "",
    year: "",
    task: "",
    client: "",
  });

  if (!openCreate) return null;

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    const loader = toast.loading("Création du projet...");

    try {
      const token = JSON.parse(localStorage.getItem("admin_token"));

      const response = await axios.post(
        `${baseUrl}/api/admin/projects`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 201 || response.status === 200) {
        onClose();
        toast.success("Nouveau projet ajouté !", { id: loader });
        refresh();
        
       
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Erreur lors de la création du projet.",
        { id: loader },
      );
      console.error(
        "Erreur lors de la création du projet :",
        error.response?.data || error,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.location?.trim() &&
    formData.year?.trim() &&
    formData.task?.trim() &&
    formData.client?.trim();

  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black/60 backdrop-blur-sm p-4">
      <div className="relative bg-white rounded-4xl shadow-2xl border border-gray-100 w-full max-w-lg overflow-hidden">
        <div className="h-2 bg-[#e8d393] w-full" />

        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-gray-900">
              Ajouter un projet
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              type="button"
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
                Lieu du projet
              </label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="Ex: San Pedro"
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-normal outline-none focus:ring-2 focus:ring-[#93b86a]/20 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">
                  Année
                </label>
                <input
                  type="text"
                  name="year"
                  required
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="Ex: 2025-2026"
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-normal outline-none focus:ring-2 focus:ring-[#93b86a]/20 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">
                  Client
                </label>
                <input
                  type="text"
                  name="client"
                  required
                  value={formData.client}
                  onChange={handleChange}
                  placeholder="Ex: Z Energie"
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-normal outline-none focus:ring-2 focus:ring-[#93b86a]/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">
                Tâche réalisée
              </label>
              <textarea
                name="task"
                required
                rows="4"
                value={formData.task}
                onChange={handleChange}
                placeholder="Décrivez la tâche réalisée..."
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-sm font-normal outline-none focus:ring-2 focus:ring-[#93b86a]/20 transition-all resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className="flex-1 py-4 bg-[#93b86a] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] shadow-lg shadow-[#93b86a]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Création..." : "Ajouter le projet"}
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
