import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const CIVILITIES = ["M.", "Mme", "Mlle"];
const ROLES = [
  { value: "admin", label: "Administrateur" },
  { value: "manager", label: "Superviseur" },
];

export default function AddUser({ openCreate, onClose, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    civility: "",
    first_name: "",
    last_name: "",
    email: "",
    number: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!openCreate) return null;

  const closeAndReset = () => {
    setForm({
      civility: "",
      first_name: "",
      last_name: "",
      email: "",
      number: "",
      role: "",
    });
    setErrors({});
    onClose();
  };

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    const newErrors = {};
    if (!form.civility) newErrors.civility = "La civilité est obligatoire.";
    if (!form.first_name.trim())
      newErrors.first_name = "Le prénom est obligatoire.";
    if (!form.last_name.trim())
      newErrors.last_name = "Le nom est obligatoire.";
    if (!form.email.trim()) newErrors.email = "L'email est obligatoire.";
    if (!form.number.trim())
      newErrors.number = "Le numéro de téléphone est obligatoire.";
    if (!form.role) newErrors.role = "Le rôle est obligatoire.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem("admin_token"));
      const response = await axios.post(
        `${baseUrl}/api/admin/users-manager`,
        form,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.status === "success") {
        toast.success(
          "Le compte a été créé avec succès. Les accès ont été envoyés à l'utilisateur par email.",
        );
        await onRefresh();
        closeAndReset();
      }
    } catch (err) {
      console.error(err);
      const apiErrors = err.response?.data?.errors;
      if (apiErrors) {
        setErrors(
          Object.fromEntries(
            Object.entries(apiErrors).map(([k, v]) => [k, v[0]]),
          ),
        );
      }
      toast.error(
        err.response?.data?.message || "Erreur lors de la création",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (field) =>
    `w-full px-4 py-3 bg-gray-50 border rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#93b86a]/20 focus:bg-white focus:border-[#93b86a]/20 transition-all ${errors[field] ? "border-red-300" : "border-transparent"}`;

  const labelCls =
    "text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-lg overflow-hidden my-8">
        <div className="h-2 bg-[#e8d393] w-full" />

        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-gray-900">
              Ajouter un utilisateur
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Prénom</label>
                <input
                  type="text"
                  value={form.first_name}
                  onChange={(e) => setField("first_name", e.target.value)}
                  className={`${inputCls("first_name")} mt-2`}
                />
              </div>
              <div>
                <label className={labelCls}>Nom</label>
                <input
                  type="text"
                  value={form.last_name}
                  onChange={(e) => setField("last_name", e.target.value)}
                  className={`${inputCls("last_name")} mt-2`}
                />
              </div>
            </div>
            {(errors.first_name || errors.last_name) && (
              <p className="text-xs font-bold text-red-500 -mt-2 ml-2">
                {errors.first_name || errors.last_name}
              </p>
            )}

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className={labelCls}>Civilité</label>
                <select
                  value={form.civility}
                  onChange={(e) => setField("civility", e.target.value)}
                  className={`${inputCls("civility")} mt-2 appearance-none cursor-pointer`}
                >
                  <option value="">—</option>
                  {CIVILITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Téléphone</label>
                <input
                  type="tel"
                  value={form.number}
                  onChange={(e) => setField("number", e.target.value)}
                  className={`${inputCls("number")} mt-2`}
                />
              </div>
            </div>
            {(errors.civility || errors.number) && (
              <p className="text-xs font-bold text-red-500 -mt-2 ml-2">
                {errors.civility || errors.number}
              </p>
            )}

            <div>
              <label className={labelCls}>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                className={`${inputCls("email")} mt-2`}
              />
              {errors.email && (
                <p className="text-xs font-bold text-red-500 mt-1 ml-2">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className={labelCls}>Rôle</label>
              <div className="flex gap-3 mt-2">
                {ROLES.map((r) => (
                  <label
                    key={r.value}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3  text-sm font-bold cursor-pointer transition-all ${
                      form.role === r.value
                        ? "border-[#93b86a] bg-[#93b86a]/10 text-[#93b86a]"
                        : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={r.value}
                      checked={form.role === r.value}
                      onChange={(e) => setField("role", e.target.value)}
                      className="accent-[#93b86a]"
                    />
                    {r.label}
                  </label>
                ))}
              </div>
              {errors.role && (
                <p className="text-xs font-bold text-red-500 mt-1 ml-2">
                  {errors.role}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-4 bg-[#93b86a] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#7fa359] shadow-lg shadow-[#93b86a]/20 transition-all disabled:opacity-50"
              >
                {loading ? "Création..." : "Créer l'utilisateur"}
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
