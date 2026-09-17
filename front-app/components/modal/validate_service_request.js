import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

export default function ValidateServiceRequest({
  openValidate,
  onClose,
  requestId,
  onRefresh,
}) {
  const [loading, setLoading] = useState(false);
  const [final_price, setFinalPrice] = useState("");
  const [error, setError] = useState("");
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!openValidate) return null;

  const closeAndReset = () => {
    setError("");
    setFinalPrice("");
    onClose();
  };

  const validateRequest = async (e) => {
    if (e) e.preventDefault();

    if (!final_price || Number(final_price) <= 0) {
      setError("Le prix final du service est obligatoire.");
      toast.error("Le prix final du service est obligatoire.");
      return;
    }
    setError("");

    setLoading(true);

    try {
      const token = JSON.parse(localStorage.getItem("admin_token"));

      const response = await axios.patch(
        `${baseUrl}/api/admin/service-requests/validate/${requestId}`,
        { final_price },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      if (response.data.status === "success") {
        toast.success(response.data.message || "Demande validée");
        await onRefresh();
        closeAndReset();
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Erreur lors de la validation",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black/60 backdrop-blur-sm p-4">
      <div className="relative bg-white rounded-[32px] shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden">
        {/* Ligne de rappel Verte */}
        <div className="h-2 bg-[#93b86a] w-full" />

        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-gray-900">
              Valider la demande
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

          <form onSubmit={validateRequest} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">
                Prix final du service
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  required
                  value={final_price}
                  onChange={(e) => {
                    setFinalPrice(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Ex: 150000"
                  className={`w-full pl-6 pr-16 py-4 bg-gray-50 border rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#93b86a]/20 focus:bg-white focus:border-[#93b86a]/20 transition-all ${error ? "border-red-300" : "border-transparent"}`}
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400">
                  FCFA
                </span>
              </div>
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
                {loading ? "Traitement..." : "Confirmer la validation"}
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
