"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function EditProfile({
  editOpen,
  onClose,
  name,
  email,
  number,
  onSuccess,
}) {
  const [localName, setName] = useState(name);
  const [localEmail, setEmail] = useState(email);
  const [localNumber, setNumber] = useState(number);

  // Synchronise les champs locaux avec les props à chaque ouverture de la modale
  useEffect(() => {
    if (editOpen) {
      setName(name || "");
      setEmail(email || "");
      setNumber(number || "");
    }
  }, [editOpen, name, email, number]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!editOpen) return null;

  const token = JSON.parse(localStorage.getItem("token"));
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const data = {
      name: localName,
      email: localEmail,
      number: localNumber,
    };
    console.log("SUBMIT DATA:", data);
    try {
      const response = await axios.put(`${baseUrl}/api/update/profile`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      console.log("RESPONSE:", response.data);
    
      if(response.data.status==="success"){
        toast.success("Profil mis à jour avec succès !");
        // setSuccess("Profil mis à jour avec succès !");
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 600);
      } 
    } catch (error) {
      const errorMsg = error && error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : error?.message || "Erreur lors de la mise à jour du profil.";
      toast.error(errorMsg);
      setError(errorMsg);
      console.error("ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="popup-modal"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black/50 p-4"
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#f7f3e6] flex items-center justify-center text-[#e8d393] dark:text-blue-300 font-medium text-sm">
              {name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Modifier le profil
              </p>
              <p className="text-xs text-gray-500">
                Mettez à jour vos informations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Nom complet
            </label>
            <input
              type="text"
              name="name"
              value={localName || ""}
              onChange={(e) => setName(e.target.value)}
              placeholder={name}
              className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Adresse email
            </label>
            <input
              type="email"
              name="email"
              value={localEmail || ""}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={email}
              className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Numéro de téléphone
            </label>
            <input
              type="tel"
              name="number"
              value={localNumber || ""}
              onChange={(e) => setNumber(e.target.value)}
              placeholder={number}
              className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {success && (
            <p className="text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
              {success}
            </p>
          )}

          {/* Boutons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-2 bg-[#93b86a] text-white rounded-lg py-2 px-6 text-sm font-medium disabled:opacity-50"
            >
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: "",
          duration: 9000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
    </div>
  );
}
