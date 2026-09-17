import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

export default function DeleteMunicipality({
  openDelete,
  onClose,
  municipality,
  onRefresh,
}) {
  const [loading, setLoading] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!openDelete) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem("admin_token"));
      const response = await axios.delete(
        `${baseUrl}/api/admin/municipalities/${municipality.id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.status === "success") {
        toast.success(response.data.message || "Commune supprimée");
        await onRefresh();
        onClose();
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Erreur lors de la suppression",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black/60 backdrop-blur-sm p-4">
      <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden">
        <div className="h-2 bg-red-500 w-full" />

        <div className="p-8 text-center">
          <h3 className="text-xl font-black text-gray-900 mb-2">
            Supprimer la commune
          </h3>
          <p className="text-sm text-gray-500 font-medium mb-8">
            Êtes-vous sûr de vouloir supprimer{" "}
            <strong>{municipality?.name}</strong> ? Cette action est
            irréversible.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all disabled:opacity-50"
            >
              {loading ? "Suppression..." : "Oui, supprimer"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all disabled:opacity-50"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
