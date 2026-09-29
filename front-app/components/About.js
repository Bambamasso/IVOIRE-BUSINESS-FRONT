"use client";
import Link from "next/link";
import Image from "next/image";
import motion from "./motion";

export default function AboutSummary() {
  return (
    <motion.section
      className="py-20 bg-white"
      id="about"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Image illustrative (Engins ou Équipe) */}
          <div className="w-full lg:w-1/2 relative flex justify-center items-center mb-8 lg:mb-0">
            <div className="absolute -top-4 -left-4 w-16 h-16 md:w-24 md:h-24 bg-[#e8d393] rounded-full z-0 opacity-20"></div>
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl w-full max-w-xs sm:max-w-md md:max-w-full h-48 sm:h-64 md:h-80 lg:h-[400px]">
              <Image
                src="/images/equipe.jpeg"
                alt="Équipe Intellect Ivoire-Business"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-4 right-2 md:-bottom-6 md:-right-6 z-20 bg-[#93b86a] p-3 md:p-6 rounded-xl text-white shadow-xl hidden sm:block">
              <p className="text-lg md:text-2xl font-black">2021</p>
              <p className="text-[10px] md:text-xs uppercase tracking-tighter">Expertise Terrain</p>
            </div>
          </div>

          {/* Texte explicatif */}
          <div className="lg:w-1/2">
            <h2 className="text-[#93b86a] font-bold uppercase text-sm tracking-[0.2em] mb-4">Notre Identité</h2>
            <h3 className="text-3xl font-black text-gray-800 mb-6">Bâtir avec Intelligence et Rigueur</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              Intellect IVOIRE-BUSINESS est plus qu&apos;une entreprise de BTP. C&apos;est une équipe de professionnels
              dédiés à l&apos;aménagement de la Côte d&apos;Ivoire. Nous mobilisons des <strong>ingénieurs, techniciens et
              ouvriers qualifiés</strong> pour transformer vos visions en infrastructures durables.
            </p>
            
            {/* Liste des moyens matériels simplifiée */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#e8d393] rounded-full"></div>
                <span className="text-sm font-bold text-gray-700">Parc d&apos;engins moderne</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#e8d393] rounded-full"></div>
                <span className="text-sm font-bold text-gray-700">Équipe d&apos;experts</span>
              </div>
            </div>

            <Link href="/home/about" className="text-[#93b86a] font-bold border-b-2 border-[#93b86a] pb-1 hover:text-[#e8d393] hover:border-[#e8d393] transition-all">
              Lire notre histoire complète →
            </Link>
          </div>

        </div>
      </div>
    </motion.section>
  );
}