"use client";

import Navbar from "@/components/navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { SlBasket, SlCreditCard, SlLocationPin, SlPhone } from "react-icons/sl";
import Footer from "@/components/footer";
import { useCart } from "@/app/context/CartContext";
import toast, { Toaster } from "react-hot-toast";

export default function OrderPage() {
  const [loading, setLoading] = useState(false);
  const { cart, getTotal, clearCart } = useCart();
  const [cities, setCities] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [city_id, setSelectCities] = useState("");
  const [municipality_id, setSelectMunicipality] = useState("");
  const [address, setAdress] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [payment_method, setPaymentMethod] = useState("cash_on_delivery");

  const selectedMunicipality = municipalities.find(
    (m) => m.id === municipality_id,
  );

  const shippingFee = selectedMunicipality
    ? Number(selectedMunicipality.shipping_fee)
    : 0;

  const subtotal = getTotal();
  const total = subtotal + shippingFee;

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  // Charger les villes au chargement
  useEffect(() => {
    const getCities = async () => {
      try {
        const response = await axios.get(baseUrl + "/api/cities");

        const data = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];
        setCities(data);
        // console.log(setCities);
      } catch (error) {
        // toast.;
        toast.error(error.response.data.message);
        console.error("Erreur lors du chargement des villes:", error);
      }
    };
    getCities();
  }, []);

  // Charger les communes quand une ville est sélectionnée
  useEffect(() => {
    if (!city_id) {
      setMunicipalities([]);
      return;
    }

    const getMunicipalities = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/cities/${city_id}/municipality`,
        );
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];
        // console.log("Municipalities data from API:", data);
        setMunicipalities(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des communes:", error);
      }
    };
    getMunicipalities();
  }, [city_id, baseUrl]);

  const handeleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error("Votre panier est vide");
      return;
    }
    setLoading(true);
    const orderData = {
      first_name,
      last_name,
      email,
      city_id,
      municipality_id,
      phone_number,
      payment_method,
      address,
    };

    const rawToken = localStorage.getItem("token");
    const token = rawToken ? JSON.parse(rawToken) : null;

    if (!token) {
      orderData.items = cart.map((item) => ({
        product_id: item.productId,
        product_variant_id: item.variant?.id || null,
        quantity: item.quantity,
        price: item.price,
      }));
    }
    try {
      const response = await axios.post(`${baseUrl}/api/orders`, orderData, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      // console.log(response.data);
      if (response.data.status === "success") {
        // Si paiement en ligne (Paystack), on redirige vers l'URL fournie par le back
        if (payment_method === "online" && response.data.payment_url) {
          window.location.href = response.data.payment_url;
          return;
        }

        toast.success("Commande enregistrée avec succès !");

        // Vider le panier local après succès
        clearCart();
        router.push("/vente");
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Erreur lors de la création de la commande";
      toast.error(message);
      console.error("Erreur lors de la création de la commande:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen pb-20">
        <div className="max-w-6xl mx-auto p-4 md:p-10">
          <h1 className="text-3xl font-extrabold mb-4 text-gray-800">
            Finaliser ma commande
          </h1>
          {/* Lien vers la boutique */}
          <a
            href="/vente"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#93b86a] transition-colors mb-8"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            Retour à la boutique
          </a>
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* COLONNE GAUCHE : FORMULAIRE */}
            <form onSubmit={handeleSubmit} className="flex-1 space-y-6">
              {/* SECTION 0 : INFOS PERSONNELLES */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-[#e0f4cc] p-2 rounded-lg text-[#93b86a]">
                    <SlBasket size={24} />
                  </div>
                  <h2 className="text-xl font-bold">Vos informations</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">
                      Prénom
                    </label>
                    <input
                      required
                      type="text"
                      value={first_name}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Jean"
                      className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#93b86a] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">
                      Nom
                    </label>
                    <input
                      required
                      type="text"
                      value={last_name}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Koffi"
                      className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#93b86a] outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-600 mb-2">
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="exemple@email.com"
                      className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#93b86a] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 1 : LIVRAISON */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-[#e0f4cc] p-2 rounded-lg text-[#93b86a]">
                    <SlLocationPin size={24} />
                  </div>
                  <h2 className="text-xl font-bold">Où devons-nous livrer ?</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-600 mb-2">
                      Ville
                    </label>
                    <select
                      required
                      className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#93b86a] outline-none"
                      value={city_id}
                      onChange={(e) => setSelectCities(e.target.value)}
                    >
                      <option value="">Sélectionner une ville</option>
                      {Array.isArray(cities) &&
                        cities.map((city) => (
                          <option key={city.id} value={city.id}>
                            {city.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-600 mb-2">
                      Commune
                    </label>
                    <select
                      required
                      className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#93b86a] outline-none"
                      value={municipality_id}
                      onChange={(e) => setSelectMunicipality(e.target.value)}
                      disabled={!city_id}
                    >
                      <option value="">Sélectionner une commune</option>
                      {Array.isArray(municipalities) &&
                        municipalities.map((muni) => (
                          <option key={muni.id} value={muni.id}>
                            {muni.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-600 mb-2">
                      Adresse précise
                    </label>
                    <textarea
                      required
                      value={address}
                      onChange={(e) => setAdress(e.target.value)}
                      placeholder="Quartier, Rue, Porte..."
                      className="w-full p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#93b86a] outline-none h-24"
                    ></textarea>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-600 mb-2">
                      Numéro de téléphone
                    </label>
                    <div className="relative">
                      <SlPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        required
                        value={phone_number}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        type="tel"
                        placeholder="07 00 00 00 00"
                        className="w-full pl-12 p-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#93b86a] outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2 : PAIEMENT */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-[#e0f4cc] p-2 rounded-lg text-[#93b86a]">
                    <SlCreditCard size={24} />
                  </div>
                  <h2 className="text-xl font-bold">Mode de paiement</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cash_on_delivery")}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${payment_method === "cash_on_delivery" ? "border-[#93b86a] bg-[#e0f4cc]/30" : "border-gray-100 hover:border-[#93b86a]/40"}`}
                  >
                    <p className="font-bold text-lg">Livraison</p>
                    <p className="text-sm text-gray-500">
                      Espèces à la réception
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("online")}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${payment_method === "online" ? "border-[#93b86a] bg-[#e0f4cc]/30" : "border-gray-100 hover:border-[#93b86a]/40"}`}
                  >
                    <p className="font-bold text-lg">En ligne</p>
                    <p className="text-sm text-gray-500">
                      Mobile Money / Carte
                    </p>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading} // Désactive le bouton pendant l'envoi
                className={`w-full text-white py-5 rounded-2xl font-bold text-lg mt-8 shadow-lg transition-all flex items-center justify-center gap-3 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#93b86a] hover:bg-[#7aa85a] active:scale-95"
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Traitement en cours...
                  </>
                ) : (
                  "Confirmer la commande"
                )}
              </button>
            </form>

            {/* COLONNE DROITE : RÉSUMÉ (BLANC) */}
            <div className="w-full lg:w-[370px] shrink-0">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                  <SlBasket size={20} className="text-[#93b86a]" />
                  <h2 className="text-xl font-bold text-gray-800">Résumé</h2>
                </div>

                <div className="space-y-4 mb-6 max-h-[350px] overflow-y-auto pr-2">
                  {cart.length === 0 ? (
                    <div className="text-gray-400 text-sm italic">
                      Votre panier est vide.
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm items-start border-b border-gray-50 pb-3"
                      >
                        <div className="flex flex-col flex-1">
                          <span className="text-gray-700 font-medium line-clamp-1">
                            {item.title}
                          </span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase">
                            {item.variant
                              ? "Variante sélectionnée"
                              : "Standard"}{" "}
                            (x{item.quantity})
                          </span>
                        </div>
                        <span className="font-bold text-gray-900 ml-2">
                          {(item.price * item.quantity).toLocaleString()} FCFA
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>Sous-total</span>
                    <span className="font-semibold">
                      {subtotal.toLocaleString()} FCFA
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>Livraison</span>
                    <span className="font-semibold">
                      {shippingFee.toLocaleString()} FCFA
                    </span>
                  </div>
                  <div className="flex justify-between text-xl font-black pt-4 border-t mt-4 text-[#93b86a]">
                    <span>TOTAL</span>
                    <span>{total.toLocaleString()} FCFA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>{" "}
         
        </div>{" "}
       
      </div>{" "}
      
      <Footer />
      <Toaster position="top-center" />
    </>
  );
}
