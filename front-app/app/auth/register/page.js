"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function Register() {
   const router = useRouter();

  // 1. Définition des états pour tous les champs
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPassword_confirmation] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
     e.preventDefault();
    
    // Collecte des données
    const userData = {
      name,
      email,
      number: phone,
      password,
      password_confirmation,
    };

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const url = baseUrl + "/api/register";
    
    try {
      const response = await axios.post(url, userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.status === "success") {
         console.log()
         const token =response.data.access_token
         localStorage.setItem('token',JSON.stringify(token))
         router.push("/users/connecter");
      } else {
        setError(response.data.message || "Erreur lors de l'inscription.");
      }
      
    } catch (error) {
       toast.error(error.response.data.message);
     
       console.error("Erreur lors de l'inscription:", error);
      setError("Une erreur réseau est survenue.");
    }
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-xl shadow-2xl">
          <h2 className="text-3xl font-extrabold text-center text-gray-900">
            Créer votre compte
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Nom et Prénom (sur la même ligne si possible) */}

            <div>
              <label
                htmlFor="firstName"
                className="text-sm font-medium text-gray-700 block"
              >
                Nom complet
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Jean"
              />
            </div>

            {/* Numéro de Téléphone */}
            <div>
              <label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700 block"
              >
                Numéro de Téléphone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="+225 00 00 00 00 00"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 block"
              >
                Adresse Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="votre.email@exemple.com"
              />
            </div>

            {/* Mot de passe et Confirmation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700 block"
                >
                  Mot de passe
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="********"
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-700 block"
                >
                  Confirmer Mot de passe
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={password_confirmation}
                  onChange={(e) => setPassword_confirmation(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="********"
                />
              </div>
            </div>

            <div>
              <button 
                type="submit"
                
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-semibold text-white bg-[#93b86a] focus:ring-2 focus:ring-offset-2 "
              >
                S&apos;inscrire
              </button>
            </div>
          </form>

          {/* Lien vers la Connexion */}
          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Vous avez déjà un compte ?{" "}
              <Link
                href="/login"
                className="font-medium text-[#e8d393]  hover:underline"
              >
                Connectez-vous ici
              </Link>
            </p>
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
              duration: 5000,
              style: {
                background: "#363636",
                color: "#fff",
              },
            }}
          />
        </div>
      </div>
    </>
  );
}
