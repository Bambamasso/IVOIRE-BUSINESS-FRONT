import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

export default function AddAttribute({ openCreate, onClose, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!openCreate) return null;

  const closeAndReset = () => {
    setError("");
    setName("");
    onClose();
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!name.trim()) {
      setError("Le nom de la caractéristique est obligatoire.");
      toast.error("Le nom de la caractéristique est obligatoire.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const token = JSON.parse(localStorage.getItem("admin_token"));
      const response = await axios.post(
        `${baseUrl}/api/settings/attributes`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.status === "success") {
        toast.success(response.data.message || "Caractéristique créée");
        await onRefresh();
        closeAndReset();
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black/60 backdrop-blur-sm p-4">
      <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden">
        <div className="h-2 bg-[#e8d393] w-full" />

        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-gray-900">
              Ajouter une caractéristique
            </h3>
            <button
              onClick={closeAndReset}
              className="text-gray-400 hover:text-gray-600 transition-colors"
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">
                Nom de la caractéristique
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Ex: Couleur, Taille..."
                className={`w-full px-6 py-4 bg-gray-50 border rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#93b86a]/20 focus:bg-white focus:border-[#93b86a]/20 transition-all ${error ? "border-red-300" : "border-transparent"}`}
              />
              {error && (
                <p className="text-xs font-bold text-red-500 ml-2">{error}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-4 bg-[#93b86a] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#7fa359] shadow-lg shadow-[#93b86a]/20 transition-all disabled:opacity-50"
              >
                {loading ? "Création..." : "Créer la caractéristique"}
              </button>
              <button
                type="button"
                onClick={closeAndReset}
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
