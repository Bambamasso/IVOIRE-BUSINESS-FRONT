// components/modal/media_product.jsx
"use client";
import { useProduct } from "../../app/context/ProductFormContext";

export default function ImageGallery() {
  const { formData = {}, setFormData } = useProduct();

  const handleFiles = (files) => {
    const existingNames = (formData?.images || []).map((i) => i.name);
    const newFiles = Array.from(files).filter((f) => !existingNames.includes(f.name));
    setFormData((prev) => ({ ...prev, images: [...(prev?.images || []), ...newFiles] }));
  };

  const removeFile = (name) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev?.images || []).filter((f) => f.name !== name),
    }));
  };

  const formatSize = (size) =>
    size < 1024 * 1024
      ? Math.round(size / 1024) + " Ko"
      : (size / 1024 / 1024).toFixed(1) + " Mo";

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Zone de Drop / Click */}
      <div
        onClick={() => document.getElementById("file-input").click()}
        className="relative border-2 border-dashed border-green-300 rounded-2xl p-10 text-center bg-gray-50 hover:bg-green-50 hover:border-green-400 transition-all cursor-pointer group"
      >
        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
          
        </div>
        <div className="text-base font-bold text-gray-700">
          Cliquez pour ajouter des photos
        </div>
        <div className="text-xs text-gray-400 mt-2">
          PNG, JPG, WEBP — max 5 Mo par fichier
        </div>

        <input
          id="file-input"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Liste des fichiers sélectionnés */}
      {(formData?.images || []).length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold text-gray-500 px-1 uppercase tracking-widest">
            Fichiers sélectionnés ({(formData?.images || []).length})
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {(formData?.images || []).map((f, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white border border-green-200 rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  {/* Petit carré d'aperçu ou icône */}
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-green-600 font-bold overflow-hidden">
                    {/* Si tu as une URL locale pour l'image, tu peux mettre un <img> ici */}
                    <span className="text-lg">📸</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900 truncate max-w-[200px] md:max-w-xs">
                      {f.name}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium">
                      {formatSize(f.size)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(f.name);
                  }}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  title="Supprimer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
