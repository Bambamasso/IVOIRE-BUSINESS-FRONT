"use client";
import Footer from "@/components/footer";
import Navbar from "@/components/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation"; // Importation pour la redirection
import {
  IoCall,
  IoDocumentText,
  IoLocation,
  IoMail,
  IoPerson,
  IoPricetag,
  IoSend,
  IoInformationCircleOutline,
} from "react-icons/io5";

export default function ServicesPage() {
  const router = useRouter(); // Initialisation du router
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [selectedServicePrice, setSelectedServicePrice] = useState(null); // Pour afficher le prix

  const [formData, setFormData] = useState({
    service_id: "",
    full_name: "",
    email: "",
    phone_number: "",
    address: "",
    propose_price: "",
    details: "",
  });

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  // 1. Charger les services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("admin_token"));
        const response = await axios.get(`${baseUrl}/api/admin/services`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setServices(response.data?.data || []);
      } catch (error) {
        console.error("Erreur services:", error);
      }
    };
    fetchServices();
  }, [baseUrl]);

  // 2. Détecter le changement de service pour afficher le prix
  useEffect(() => {
    if (formData.service_id) {
      const service = services.find((s) => s.id == formData.service_id);
      setSelectedServicePrice(service ? service.price : null);
    } else {
      setSelectedServicePrice(null);
    }
  }, [formData.service_id, services]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loader = toast.loading("Envoi de votre demande...");

    try {
      const response = await axios.post(
        `${baseUrl}/api/home/requests-service`,
        formData,
      );

      
      if (
        response.status === 200 ||
        response.status === 201 ||
        response.data.success
      ) {
        toast.success("Votre demande a été envoyée avec succès !", {
          id: loader,
        });

        // Petite attente pour laisser le temps de lire le toast avant de rediriger
        setTimeout(() => {
          router.push("/"); 
        }, 2000);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Une erreur est survenue lors de l'envoi.",
        { id: loader },
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto my-10 p-8 bg-white rounded-[32px] shadow-xl border border-gray-50">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-gray-900">
            Demander un service
          </h2>
          <p className="text-sm text-gray-400 font-medium">
            Remplissez le formulaire, nous vous répondrons rapidement.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Choix du Service */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2 italic">
                Service souhaité *
              </label>
              {/* AFFICHAGE DU PRIX DU SERVICE SÉLECTIONNÉ */}
              {selectedServicePrice && (
                <span className="text-xs font-black text-[#93b86a] bg-green-50 px-3 py-1 rounded-full border border-green-100 animate-pulse">
                  Prix standard :{" "}
                  {new Intl.NumberFormat("fr-FR").format(selectedServicePrice)}{" "}
                  FCFA
                </span>
              )}
            </div>
            <div className="relative">
              <select
                name="service_id"
                required
                value={formData.service_id}
                onChange={handleChange}
                className="w-full pl-5 pr-10 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#93b86a]/20 outline-none appearance-none cursor-pointer"
              >
                <option value="">Sélectionnez un service</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ... Reste des champs (Nom, Email, Tel, Adresse) ... */}
          {/* Je garde ta structure existante ici */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2 italic">
                Nom complet *
              </label>
              <div className="relative">
                <IoPerson className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="text"
                  name="full_name"
                  required
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#93b86a]/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2 italic">
                Email *
              </label>
              <div className="relative">
                <IoMail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#93b86a]/20"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2 italic">
                Téléphone *
              </label>
              <div className="relative">
                <IoCall className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="tel"
                  name="phone_number"
                  required
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="w-full pl-12 pr-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#93b86a]/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2 italic">
                Adresse *
              </label>
              <div className="relative">
                <IoLocation className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full pl-12 pr-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#93b86a]/20"
                />
              </div>
            </div>
          </div>

          {/* Prix Proposé */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 ml-2">
              <label className="text-[10px] font-black uppercase text-gray-400 italic">
                Votre prix proposé (Optionnel)
              </label>
              <div className="group relative">
                <IoInformationCircleOutline className="text-gray-400 cursor-help" />
                <span className="hidden group-hover:block absolute bottom-full left-0 bg-gray-900 text-white text-[9px] p-2 rounded w-40 mb-2 z-10 font-medium">
                  Si le prix standard ne vous convient pas, proposez le vôtre
                  pour en discuter.
                </span>
              </div>
            </div>
            <div className="relative">
              <IoPricetag className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="number"
                name="propose_price"
                placeholder="Ex: 5000"
                value={formData.propose_price}
                onChange={handleChange}
                className="w-full pl-12 pr-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#93b86a]/20"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400">
                FCFA
              </span>
            </div>
          </div>

          {/* Détails */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2 italic">
              Détails de la mission
            </label>
            <div className="relative">
              <IoDocumentText className="absolute left-5 top-6 text-gray-300" />
              <textarea
                name="details"
                rows="4"
                placeholder="Décrivez votre besoin..."
                value={formData.details}
                onChange={handleChange}
                className="w-full pl-12 pr-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#93b86a]/20 resize-none"
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-[#93b86a] text-white rounded-2xl font-black text-sm shadow-lg shadow-[#93b86a]/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? "ENVOI EN COURS..." : "ENVOYER LA DEMANDE"}
            {!loading && <IoSend size={18} />}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}
