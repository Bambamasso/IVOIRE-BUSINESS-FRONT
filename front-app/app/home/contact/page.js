"use client";

import Footer from "@/components/footer";
import Navbar from "@/components/navigation";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaClock,
} from "react-icons/fa";

export default function ContactPage() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/api/home/contact`, form, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setForm({
          full_name: "",
          email: "",
          phone_number: "",
          subject: "",
          message: "",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error.response?.data?.errors ||
          error.response?.data?.message ||
          "Erreur lors de l'envoi du message.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-white">
        {/* Header de page avec ton vert */}
        <section className="bg-[#93b86a] py-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 italic uppercase">
              Contactez <span className="text-[#e8d393]">Int I-B</span>
            </h1>
            <p className="text-white/90 max-w-2xl mx-auto font-medium">
              Une question sur nos produits ou un projet de VRD ? Nos experts
              vous répondent sous 24h.
            </p>
          </div>
        </section>

        <section className="py-20 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Colonne Gauche : Infos de contact */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-[#93b86a] pl-4">
                  Nos Coordonnées
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-100 rounded-lg text-[#93b86a]">
                      <FaPhone size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Téléphone
                      </p>
                      <p className="text-gray-800 font-semibold">
                        +225 01 42 61 68 67
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-100 rounded-lg text-[#93b86a]">
                      <FaEnvelope size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Email
                      </p>
                      <p className="text-gray-800 font-semibold">
                        intellectstores@gmail.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-100 rounded-lg text-[#93b86a]">
                      <FaMapMarkerAlt size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Siège Social
                      </p>
                      <p className="text-gray-800 font-semibold leading-snug">
                        Abidjan, Cocody Angré <br />
                        Carrefour Victor Lobad
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-100 rounded-lg text-[#e8d393]">
                      <FaClock size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Horaires d&#39;ouverture
                      </p>
                      <p className="text-gray-800 font-semibold italic">
                        Lun - Ven : 08h - 18h
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bouton WhatsApp direct (très utilisé en Côte d'Ivoire) */}
              <a
                href="https://wa.me/2250142616867"
                className="flex items-center justify-center gap-3 w-full py-4 bg-[#25D366] text-white rounded-xl font-bold hover:shadow-lg transition-all"
              >
                <FaWhatsapp size={24} />
                Discuter sur WhatsApp
              </a>
            </div>

            {/* Colonne Droite : Formulaire */}
            <div className="lg:col-span-2 bg-gray-50 p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-8">
                Envoyez-nous un message
              </h3>

               <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    placeholder="Ex: Jean Kouassi"
                    required
                    className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-[#93b86a] focus:ring-2 focus:ring-[#93b86a]/20 outline-none transition-all bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Ex: jean@email.com"
                    required
                    className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-[#93b86a] focus:ring-2 focus:ring-[#93b86a]/20 outline-none transition-all bg-white"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                    Téléphone
                  </label>
                  <input
                    type="text"
                    name="phone_number"
                    value={form.phone_number}
                    onChange={handleChange}
                    placeholder="Ex: +225 01 02 03 04 05"
                    required
                    className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-[#93b86a] focus:ring-2 focus:ring-[#93b86a]/20 outline-none transition-all bg-white"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                    Objet de votre demande
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Ex: Demande de devis"
                    required
                    className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-[#93b86a] focus:ring-2 focus:ring-[#93b86a]/20 outline-none transition-all bg-white"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                    Votre message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Décrivez votre besoin ici..."
                    required
                    className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-[#93b86a] outline-none transition-all bg-white"
                  ></textarea>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto px-10 py-4 bg-[#93b86a] text-white font-black rounded-xl hover:bg-[#e8d393] hover:text-gray-800 transition-all shadow-md uppercase tracking-widest text-sm disabled:opacity-50"
                  >
                    {loading ? "Envoi en cours..." : "Envoyer le message"}
                  </button>

                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
