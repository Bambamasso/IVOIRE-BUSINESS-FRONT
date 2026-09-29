"use client";
import motion from "./motion";

export default function Partners() {
  const partners = [
    "KING GLORY SARL",
    "Z ENERGIE",
    "MALIKA IMMOBILIER",
    "YML AND CO",
    "ETS BREJEM",
    "SGTI CI",
    "Collectivités Locales",
  ];

  // On double la liste pour créer l'illusion du défilement infini
  const duplicatedPartners = [...partners, ...partners];

  return (
    <motion.section
      className="py-12 bg-white border-y border-gray-100"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-gray-400 text-xs font-bold uppercase tracking-[0.3em] mb-10">
          Ils nous font confiance
        </p>

        {/* Conteneur principal qui masque le débordement */}
        <div className="relative w-full overflow-hidden mask-linear">
          
          {/* Conteneur animé : w-max empêche le retour à la ligne */}
          <div className="flex w-max gap-16 animate-marquee opacity-60 grayscale hover:grayscale-0 transition-all hover:[animation-play-state:paused]">
            
            {duplicatedPartners.map((partner, i) => (
              <span
                key={i}
                className="text-xl md:text-2xl font-black text-gray-300 hover:text-[#93b86a] cursor-default transition-colors whitespace-nowrap"
              >
                {partner}
              </span>
            ))}
            
          </div>
        </div>
      </div>
    </motion.section>
  );
}