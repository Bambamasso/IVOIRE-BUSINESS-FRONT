"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Image from "next/image";
import { RiLoader4Line, RiEyeLine, RiEyeOffLine } from "react-icons/ri";

export default function AdminLoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userData = {
      email: identifier,
      password,
    };

    try {
      const response = await axios.post(`${baseUrl}/api/login`, userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data.status === "success") {
        const token = response.data.token;
        localStorage.setItem("admin_token", JSON.stringify(token));
        router.push("/admin/dashboard");
      } else {
        toast.error(response.data.message || "Erreur lors de la connexion.");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      toast.error(
        error.response?.data?.message || "Une erreur réseau est survenue.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="h-2 bg-[#93b86a] w-full" />

          <div className="p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#93b86a]/10 p-2">
                <Image
                  src="/images/Logo.png"
                  alt="Intellect Ivoire-Business"
                  width={48}
                  height={48}
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div>
                <h1 className="text-xl font-black text-gray-900">
                  Espace administration
                </h1>
                {/* <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                  Accès réservé au personnel autorisé
                </p> */}
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="identifier"
                  className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest"
                >
                  Email ou identifiant
                </label>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  autoComplete="username"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="mt-2 w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#93b86a]/20 focus:bg-white focus:border-[#93b86a]/20 transition-all"
                  placeholder="email@exemple.com ou identifiant"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest"
                >
                  Mot de passe
                </label>
                <div className="relative mt-2">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-11 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#93b86a]/20 focus:bg-white focus:border-[#93b86a]/20 transition-all"
                    placeholder="********"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <RiEyeOffLine size={18} />
                    ) : (
                      <RiEyeLine size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-[#93b86a] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#7fa359] shadow-lg shadow-[#93b86a]/20 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RiLoader4Line className="animate-spin" size={18} />
                    Connexion en cours...
                  </>
                ) : (
                  "Connexion"
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-gray-400 font-bold uppercase tracking-widest">
          © {new Date().getFullYear()} • Ivoire Business
        </p>
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
