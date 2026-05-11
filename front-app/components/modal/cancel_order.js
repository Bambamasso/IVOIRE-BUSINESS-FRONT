import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios"; // Ne pas oublier l'import !

export default function CancelOrder({
  openCancelModal,
  onClose,
  orderId,
  onRefresh,
}) {
  const [loading, setLoading] = useState(false);
  const [cancellation_reason, setCancellationReason] = useState("");
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!openCancelModal) return null;

  const rejectedRequest = async (e) => {
    if (e) e.preventDefault();

    // 1. On active le loading dès le début
    setLoading(true);

    const data = { cancellation_reason };

    try {
     
      const token = JSON.parse(localStorage.getItem("admin_token"));

      const response = await axios.patch(
        `${baseUrl}/api/admin/orders/canceled/${orderId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      if (response.data.status === "success") {
        toast.success(response.data.message || "Demande rejetée");
        await onRefresh(); // On attend que le refresh soit lancé
        onClose();
        setCancellationReason(""); // Reset du champ
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Erreur lors du rejet");
    } finally {
      // 2. On désactive le loading à la fin, quoi qu'il arrive
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black/60 backdrop-blur-sm p-4">
      <div className="relative bg-white rounded-[32px] shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden">
        {/* Ligne de rappel Beige */}
        <div className="h-2 bg-[#e8d393] w-full" />

        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-gray-900">
              Refuser la demande
            </h3>
            <button
              onClick={onClose}
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

          <form onSubmit={rejectedRequest} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">
                Motif du rejet
              </label>
              <textarea
                required
                rows="4"
                value={cancellation_reason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Expliquez brièvement la raison de l'annulation au client..."
                className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#93b86a]/20 focus:bg-white focus:border-[#93b86a]/20 transition-all resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit" // Utilise le type submit pour le formulaire
                disabled={loading || !cancellation_reason}
                className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all disabled:opacity-50"
              >
                {loading ? "Traitement..." : "Confirmer l'annulation"}
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
