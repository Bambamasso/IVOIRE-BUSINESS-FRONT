import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function DeleteServiceRequest({
  openDelete,
  onClose,
  onSuccess,
  requestId,
  onRefresh,
}) {
  const router = useRouter();
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
      const url = `${baseUrl}/api/admin/service-requests/${requestId}`;

      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      if (response.data.status === "success") {
        toast.success("Demande de service supprimée avec succès !");
        onRefresh(); // On rafraîchit la liste des demandes de service sur la page parente
        onClose();
      }
      setLoading(false);
      onClose();
      if (onConfirm) onConfirm();
    } catch (err) {
      setLoading(false);
      console.log(
        err?.response?.data?.message ||
          err.message ||
          "Erreur lors de la suppression",
      );
    }
  };

  return (
    <>
      <div
        id="popup-modal"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black/50"
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow p-4 md:p-6">
            <button
              type="button"
              className="absolute top-3 right-2.5 text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 inline-flex justify-center items-center"
              onClick={onClose}
            >
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18 17.94 6M18 18 6.06 6"
                />
              </svg>
              <span className="sr-only">Fermer la modale</span>
            </button>
            <div className="p-4 md:p-5 text-center">
              <svg
                className="mx-auto mb-4 text-fg-disabled w-12 h-12"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <h3 className="mb-6 text-body">
                Êtes-vous sûr de vouloir supprimer cette demande ?
              </h3>

              <div className="flex items-center space-x-4 justify-center">
                <button
                  type="button"
                  className="text-red-500 bg-danger box-border border shadow-xs font-medium leading-5 text-sm px-4 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleConfirm}
                  disabled={loading}
                >
                  {loading ? "Suppression..." : "Oui, supprimer"}
                </button>
                <button
                  type="button"
                  className="text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={onClose}
                  disabled={loading}
                >
                  Non, annuler
                </button>
              </div>
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
    </>
  );
}
