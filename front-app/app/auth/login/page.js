"use client";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); 
  const router = useRouter();
  const { setIsAuthenticated, syncCartOnLogin } = useCart();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 

    const userData = { email, password };
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const url = baseUrl + "/api/login";

    try {
      const response = await axios.post(url, userData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.status === "success") {
        const token = response.data.token;
        //  Clé unifiée "token" au lieu de "user_token"
        localStorage.setItem("token", JSON.stringify(token));
        setIsAuthenticated(true);
        syncCartOnLogin(); 
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get("redirect");
        router.push(redirect || "/");
      } else {
        toast.error(response.data.message || "Erreur lors de la connexion.");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      toast.error(error?.response?.data?.message || "Une erreur réseau est survenue.");
    } finally {
      setLoading(false); // ✅ fin du loading dans tous les cas
    }
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
          <h2 className="text-3xl font-extrabold text-center text-gray-900">
            Connectez-vous à votre compte
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
                Adresse Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                placeholder="votre.email@exemple.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                placeholder="********"
              />
            </div>

            {/* ✅ Bouton avec état loading */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex bg-[#93b86a] justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-lg shadow-md text-base font-semibold text-white  focus:outline-none  disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    {/* Spinner SVG simple */}
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12" cy="12" r="10"
                        stroke="currentColor" strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Connexion en cours...
                  </>
                ) : (
                  "Se Connecter"
                )}
              </button>
            </div>

            {/* Bouton Google sous le bouton classique */}
            <div className="mt-2">
              <button
                type="button"
                onClick={() => {
                  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google/redirect`;
                }}
                className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-lg shadow-md text-base font-semibold text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 48 48">
                  <g>
                    <path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.64 2.36 30.18 0 24 0 14.82 0 6.68 5.48 2.69 13.44l7.98 6.2C12.13 13.13 17.62 9.5 24 9.5z"/>
                    <path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.59C43.98 37.13 46.1 31.36 46.1 24.55z"/>
                    <path fill="#FBBC05" d="M10.67 28.65A14.5 14.5 0 019.5 24c0-1.62.28-3.19.77-4.65l-7.98-6.2A23.97 23.97 0 000 24c0 3.93.94 7.65 2.69 10.85l7.98-6.2z"/>
                    <path fill="#EA4335" d="M24 48c6.18 0 11.36-2.05 15.14-5.59l-7.19-5.59c-2.01 1.35-4.59 2.16-7.95 2.16-6.38 0-11.87-3.63-14.33-8.95l-7.98 6.2C6.68 42.52 14.82 48 24 48z"/>
                    <path fill="none" d="M0 0h48v48H0z"/>
                  </g>
                </svg>
                Se connecter avec Google
              </button>
            </div>

            <Toaster
              position="top-center"
              toastOptions={{
                duration: 5000,
                style: { background: "#363636", color: "#fff" },
              }}
            />
          </form>

          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Pas encore de compte ?{" "}
              <Link href="../register" className="font-medium text-[#e8d393] hover:underline">
                s&apos;inscrire ici
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}