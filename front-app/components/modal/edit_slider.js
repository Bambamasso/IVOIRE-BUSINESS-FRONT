import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function EditSlider({ isOpen, onClose, slide, refreshSlides }) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (isOpen && slide) {
      setTitle(slide.title || "");
      setDescription(slide.description || "");
      setImage(null);
      setImagePreview(
        slide.media?.length > 0
          ? `${baseUrl}/storage/${slide.media[0].file_path}`
          : null,
      );
    }
  }, [isOpen, slide]);

  if (!isOpen || !slide) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (image) formData.append("image", image);
    formData.append("_method", "PUT");
    try {
      const token = JSON.parse(localStorage.getItem("admin_token"));
      const response = await axios.post(
        `${baseUrl}/api/admin/slides/${slide.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.data.status === "success" || response.status === 200) {
        onClose();
        toast.success(response.data.message || "Slide mis à jour avec succès");
        refreshSlides();
      } else {
        toast.error(response.data.message || "Erreur lors de la mise à jour du slide");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de la mise à jour du slide");
      console.error("Erreur lors de la mise à jour du slide:", error);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = title && description;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black/60 backdrop-blur-sm p-4">
      <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <h2 className="text-xl font-black text-gray-800 mb-2 text-center">
            Modifier la bannière
          </h2>

          {/* Champ Titre */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">
              Titre
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#93b86a] focus:ring-2 focus:ring-[#93b86a]/20 outline-none text-gray-800 font-normal bg-gray-50"
              placeholder="Titre de la bannière"
              required
            />
          </div>

          {/* Champ Description */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#93b86a] focus:ring-2 focus:ring-[#93b86a]/20 outline-none text-gray-800 font-normal bg-gray-50 resize-none min-h-20"
              placeholder="Description de la bannière"
              required
            />
          </div>

          {/* Champ Image */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#93b86a]/10 file:text-[#93b86a] hover:file:bg-[#93b86a]/20"
            />
            {imagePreview && (
              <div className="mt-3 flex justify-center">
                <img
                  src={imagePreview}
                  alt="Aperçu"
                  className="rounded-xl max-h-40 object-contain border border-gray-200 shadow"
                />
              </div>
            )}
          </div>

          {/* Boutons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className={`flex-1 py-4 bg-[#93b86a] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#93b86a]/20 transition-all ${loading || !isFormValid ? "opacity-50 cursor-not-allowed" : "hover:bg-[#7fa75a]"}`}
            >
              {loading ? "Traitement..." : "Enregistrer"}
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
  );
}
