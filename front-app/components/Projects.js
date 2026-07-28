"use client";
import axios from "axios";
import motion from "./motion";
import { useEffect, useState } from "react";
export default function Projects() {
  const [projects, setProjects] = useState([]);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const getProjects = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/home/all-projects`);
      setProjects(response.data?.data || []);
    } catch (error) {
      console.error("Erreur projets:", error);
    }
  };
  useEffect(() => {
    getProjects();
  }, []);
  // const projects = [
  //   { loc: "San Pedro", task: "Reprofilage de route", year: "2024", client: "Z Energie" },
  //   { loc: "Ngussan Kro (Botro)", task: "Voirie rurale", year: "2024", client: "KING GLORY SARL" },
  //   { loc: "Timbe (Nation)", task: "Ouverture de voie", year: "2023", client: "Client privé" },
  //   { loc: "Copa (Agboville)", task: "Ouverture de voie", year: "2022", client: "KING GLORY SARL" },
  //   { loc: "Kokotokro (Botro)", task: "Ouverture de voie", year: "2021", client: "KING GLORY SARL" },

  //   { loc: "Songon (Agban)", task: "Construction de villa 4 pièces au gros oeuvres", year: "2025", client: "MALIKA IMMOBILIER" },
  //   { loc: "Bangolo", task: "Ouverture de voie", year: "2024", client: "YML AND CO" },
  //   { loc: "Kokotokro (Botro)", task: "Aménagement & VRD ", year: "2025", client: "ETS BREJEM" },
  //   { loc: "Man", task: "Ouverture des layons ", year: "2025 - 2026", client: "SGTI CI" },
  // ];

  return (
    <motion.section
      className="py-20 bg-gray-100"
      id="realisations"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-[#93b86a] font-bold uppercase tracking-widest text-sm mb-3">
              Expérience terrain
            </h2>
            <p className="text-3xl font-black text-gray-800">
              Nos Références Récentes
            </p>
          </div>
          <div className="hidden md:block w-32 h-1 bg-[#e8d393]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-sm border-b-4 border-[#93b86a] hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold bg-[#e8d393] text-gray-800 px-2 py-1 rounded">
                  {p.year}
                </span>
                <span className="text-[10px] uppercase text-gray-400 font-bold tracking-tighter">
                  Projet Terminé
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">{p.loc}</h3>
              <p className="text-[#93b86a] font-semibold text-sm mb-4">
                {p.task}
              </p>
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500 italic">Client :</span>
                <span className="text-xs font-bold text-gray-700 uppercase">
                  {p.client}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
