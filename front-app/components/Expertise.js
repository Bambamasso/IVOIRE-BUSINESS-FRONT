"use client";
import { FaRoad, FaWater, FaHardHat, FaTruckMoving, FaDraftingCompass, FaCity } from 'react-icons/fa';
import motion from "./motion";

const services = [
  {
    title: "Voirie Urbaine & Rurale",
    desc: "Aménagement et entretien des voies pour assurer une circulation fluide et durable.",
    icon: <FaRoad size={30} />,
  },
  {
    title: "Ouverture de Voies",
    desc: "Création de nouveaux accès et désenclavement de zones urbaines ou rurales.",
    icon: <FaCity size={30} />,
  },
  {
    title: "Assainissement & Évacuation",
    desc: "Mise en place de réseaux d'eaux usées (EU) et d'eaux pluviales (EP) performants.",
    icon: <FaWater size={30} />,
  },
  {
    title: "Adduction en Eau Potable",
    desc: "Installation de réseaux d'alimentation pour garantir l'accès à l'eau potable.",
    icon: <FaDraftingCompass size={30} />,
  },
  {
    title: "Terrassements Généraux",
    desc: "Préparation rigoureuse des sols avant toute construction ou aménagement.",
    icon: <FaHardHat size={30} />,
  },
  {
    title: "Reprofilage de Routes",
    desc: "Remise en état et reprofilage lourd ou léger pour la pérennité des pistes.",
    icon: <FaTruckMoving size={30} />,
  },
];

export default function Expertise() {
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
            Une expertise complète en <br /> <span className="text-[#e8d393]">Aménagement & VRD</span>
          </p>
          <div className="w-20 h-1.5 bg-[#93b86a] mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Grille des services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="p-8 bg-gray-50 rounded-2xl border border-transparent hover:border-[#93b86a]/30 hover:bg-white hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-[#93b86a] shadow-sm mb-6 group-hover:bg-[#93b86a] group-hover:text-white transition-colors duration-300">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 uppercase tracking-tight">
                {service.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {service.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </motion.section>
  );
}