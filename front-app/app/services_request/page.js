"use client";
import Footer from "@/components/footer";
import Navbar from "@/components/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  IoCall,
  IoCloudUpload,
  IoDocumentText,
  IoLocation,
  IoMail,
  IoPerson,
  IoPricetag,
  IoSend,
  IoInformationCircleOutline,
  IoCloseCircle,
} from "react-icons/io5";
import useRecaptcha from "../hooks/useRecaptcha";
import Script from "next/script";

export default function ServicesPage() {
  const router = useRouter(); // Initialisation du router
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [selectedServicePrice, setSelectedServicePrice] = useState(null); // Pour afficher le prix
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { getRecaptchaToken } = useRecaptcha();

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
        // const token = JSON.parse(localStorage.getItem("admin_token"));

        const response = await axios.get(`${baseUrl}/api/home/all/services`);
        setServices(response.data?.data || []);
      } catch (error) {
        console.error("Erreur services:", error);
      }
    };
    fetchServices();
  }, [baseUrl]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getFilePreview = (file) => {
    if (file.type.startsWith("image/")) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  const getFileLabel = (file) => {
    const type = file.type;
    if (type.startsWith("image/")) return "IMAGE";
    if (type.includes("pdf")) return "PDF";
    if (type.includes("word") || type.includes("document")) return "DOC";
    if (type.includes("sheet") || type.includes("excel")) return "XLS";
    return "FICHIER";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loader = toast.loading("Envoi de votre demande...");

    try {
      const recaptchaToken = await getRecaptchaToken("service_request");
      const payload = new FormData();
      payload.append("service_id", formData.service_id);
      payload.append("full_name", formData.full_name);
      payload.append("email", formData.email);
      payload.append("phone_number", formData.phone_number);
      payload.append("address", formData.address);
      if (formData.propose_price)
        payload.append("propose_price", formData.propose_price);
      if (formData.details) payload.append("details", formData.details);
      payload.append("recaptcha_token", recaptchaToken);
      selectedFiles.forEach((file) => {
        payload.append("files[]", file);
      });

      const response = await axios.post(
        `${baseUrl}/api/home/requests-service`,
        payload,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      if (
        response.status === 200 ||
        response.status === 201 ||
        response.data.success
      ) {
        toast.success("Votre demande a été envoyée avec succès !", {
          id: loader,
        });
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.errors ||
          "Une erreur est survenue lors de l'envoi.",
        { id: loader },
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="afterInteractive"
      />
      <Navbar />
      <div className="max-w-2xl mx-auto my-10 p-8 bg-white rounded-4xl shadow-xl border border-[#e8d393]">
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
                Service souhaité <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="relative">
              <select
                name="service_id"
                required
                value={formData.service_id}
                onChange={handleChange}
                className="w-full pl-5 pr-10 py-4 bg-gray-50 border-none rounded-2xl text-sm font-normal text-gray-700 focus:ring-2 focus:ring-[#93b86a]/20 outline-none appearance-none cursor-pointer"
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
                Nom complet <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <IoPerson className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="text"
                  name="full_name"
                  required
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-normal outline-none focus:ring-2 focus:ring-[#93b86a]/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2 italic">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <IoMail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-normal outline-none focus:ring-2 focus:ring-[#93b86a]/20"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2 italic">
                Téléphone <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <IoCall className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="tel"
                  name="phone_number"
                  required
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="w-full pl-12 pr-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-normal outline-none focus:ring-2 focus:ring-[#93b86a]/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-2 italic">
                Adresse <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <IoLocation className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full pl-12 pr-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-normal outline-none focus:ring-2 focus:ring-[#93b86a]/20"
                />
              </div>
            </div>
          </div>

          {/* Prix Proposé */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 ml-2">
              <label className="text-[10px] font-black uppercase text-gray-400 italic">
                Votre budget estimé
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
                className="w-full pl-12 pr-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-normal outline-none focus:ring-2 focus:ring-[#93b86a]/20"
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400">
                FCFA
              </span>
            </div>
          </div>

          {/* Détails */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2 italic">
              Détails de la mission <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <IoDocumentText className="absolute left-5 top-6 text-gray-300" />
              <textarea
                name="details"
                rows="4"
                placeholder="Décrivez votre besoin..."
                value={formData.details}
                onChange={handleChange}
                className="w-full pl-12 pr-5 py-4 bg-gray-50 border-none rounded-2xl text-sm font-normal outline-none focus:ring-2 focus:ring-[#93b86a]/20 resize-none"
              ></textarea>
            </div>
          </div>

          {/* Fichiers joints */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-2 italic">
              Pièces jointes
            </label>
            <div className="relative">
              <input
                type="file"
                id="file-upload"
                multiple
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center gap-3 w-full px-5 py-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-normal text-gray-400 cursor-pointer hover:border-[#93b86a]/40 hover:bg-[#93b86a]/5 transition-all"
              >
                <IoCloudUpload size={22} className="text-[#93b86a]" />
                <span>
                  Cliquez pour ajouter des fichiers ou glissez-déposez
                </span>
              </label>
            </div>

            {/* Liste des fichiers sélectionnés */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2 mt-3">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100"
                  >
                    {getFilePreview(file) ? (
                      <img
                        src={getFilePreview(file)}
                        alt=""
                        className="w-10 h-10 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-lg text-xs font-black text-gray-500">
                        {getFileLabel(file)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">
                        {file.name}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {(file.size / 1024).toFixed(1)} Ko
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <IoCloseCircle size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
