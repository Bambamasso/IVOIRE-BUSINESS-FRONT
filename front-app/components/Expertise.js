"use client";

import motion from "./motion";
import { useEffect, useState } from "react";
import axios from "axios";

//

export default function Expertise() {
  const [services, setServices] = useState([]);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const getServices = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/home/all/services`);
      setServices(response.data?.data || []);
      console.log("Services récupérés:", response.data?.data);
    } catch (error) {
      console.error("Erreur services:", error);
    }
  };
  useEffect(() => {
    getServices();
  }, []);
  return (
    <motion.section
      className="py-20 bg-white"
      id="services"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* En-tête de section */}
        <div className="text-center mb-16">
          <h2 className="text-[#93b86a] font-bold uppercase tracking-widest text-sm mb-3">
            Nos Domaines d'Intervention
          </h2>
          <p className="text-3xl md:text-4xl font-black text-gray-800">
            Une expertise complète en <br />{" "}
            <span className="text-[#e8d393]">Aménagement & VRD</span>
          </p>
          <div className="w-20 h-1.5 bg-[#93b86a] mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Grille des services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="p-8 bg-gray-50 rounded-2xl justify-center content border border-transparent hover:border-[#93b86a]/30 hover:bg-white hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-white rounded-xl border border-[#93b86a] flex items-center justify-center  text-[#e8d393]  mb-6 group-hover:bg-[#93b86a] group-hover:text-white transition-colors duration-300">
                {service.name ? service.name.charAt(0).toUpperCase() : ""}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 uppercase tracking-tight">
                {service.name}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
