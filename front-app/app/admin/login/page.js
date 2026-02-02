"use client";
import Image from "next/image";
import Navbar from "@/components/navigation";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    //
    const userData = {
      email,
      password,
    };
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const url = baseUrl + "/api/login";
    try {
      const response = await axios.post(url, userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data.status === "success") {
        const token = response.data.token;
        const roleName=response.data.user_info.user_role[0];
        if(roleName!=="admin"){
        toast.error("Désolé, vous n'avez pas le rôle requis pour accéder à cette partie");
        return;
        }
        localStorage.setItem("admin_token", JSON.stringify(token));
         router.push("/admin/dashboard");
      } else {
        setError(response.data.message || "Erreur lors de la connexion.");
      }
    } catch (error) {
       console.error("Erreur lors de la connexion:", error);
       toast.error(error.response.data.message);
      setError("Une erreur réseau est survenue.");
    }
  };

  return (
    <>
      {/* <Navbar /> */}
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
          <h2 className="text-3xl font-extrabold text-center text-gray-900">
            Connectez-vous à votre compte
          </h2>

          {/* Formulaire de Connexion */}
          <form className="space-y-6" onSubmit={handleSubmit}>
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
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                placeholder="votre.email@exemple.com"
              />
            </div>

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
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                placeholder="********"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
              >
                Se Connecter
              </button>
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
          </form>
        </div>
      </div>
    </>
  );
}
