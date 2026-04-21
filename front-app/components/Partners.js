"use client";
import motion from "./motion";
export default function Partners() {
  const partners = ["KING GLORY SARL", "Z ENERGIE", "CIE", "VINCI", "Collectivités Locales"];

  return (
    <motion.section
      className="py-12 bg-white border-y border-gray-100"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-gray-400 text-xs font-bold uppercase tracking-[0.3em] mb-8">
          Ils nous font confiance
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all">
          {partners.map((partner, i) => (
            <span key={i} className="text-xl md:text-2xl font-black text-gray-300 hover:text-[#93b86a] cursor-default transition-colors">
              {partner}
            </span>
          ))}
        </div>
      </div>
    </motion.section>
  );
}