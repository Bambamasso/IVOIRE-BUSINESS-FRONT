import axios from "axios";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function DeleteService({
  openDelete,
  onClose,
  serviceId,
  serviceData,
  onRefresh,
}) {
  const [loading, setLoading] = useState(false);

  // Ne pas afficher la modale si elle n'est pas ouverte
  if (!openDelete) return null;

  const handleConfirm = async () => {
    setLoading(true);

    try {
      const stored = localStorage.getItem("admin_token");
      if (!stored) throw new Error("Jeton manquant");
      let token;
      try {
        token = JSON.parse(stored);
      } catch {
        token = stored;
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const url = `${baseUrl}/api/admin/services/${serviceId}`;

      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.data.status === "success") {
        toast.success("Service supprimé avec succès !");
        onRefresh(); // On rafraîchit la liste des services sur la page parente
        onClose();
      } else {
        toast.error(
          response.data?.message || "Erreur lors de la suppression",
        );
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err.message ||
          "Erreur lors de la suppression",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black/60 backdrop-blur-sm p-4">
      <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden">
        {/* Ligne de rappel Rouge */}
        <div className="h-2 bg-red-500 w-full" />

        <div className="p-8 text-center">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
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

          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </div>

          <h3 className="text-xl font-black text-gray-900 mb-2">
            Supprimer ce service ?
          </h3>
          <p className="text-sm text-gray-500 font-medium mb-8">
            {serviceData?.name ? (
              <>
                Vous êtes sur le point de supprimer{" "}
                <span className="font-black text-gray-700">
                  {serviceData.name}
                </span>
                . Cette action est irréversible.
              </>
            ) : (
              "Cette action est irréversible."
            )}
          </p>

          <div className="flex gap-3">
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
    </div>
  );
}
