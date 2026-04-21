'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const slides = [
  {
    image: '/images/imageShop1.jpeg', // Idéalement une image de goudronnage ou d'ouverture de voie
    title: "Expertise en Voirie et Réseaux Divers (VRD)",
    text: "Depuis 2021, nous bâtissons l'infrastructure de demain avec rigueur et professionnalisme sur l'ensemble du territoire ivoirien.",
    ctaLabel: "Nos Réalisations",
    ctaHref: "#realisations", // On pourra lier vers ta future section 5
  },
  {
    image: '/images/imageShop2.jpeg', // Idéalement une image de tes bulldozers ou pelles mécaniques
    title: "Aménagement Urbain & Rural",
    text: "Ouverture de voies, reprofilage et terrassement. Nous transformons vos terrains en espaces prêts pour le développement.",
    ctaLabel: "Demander un Devis",
    ctaHref: "/contact",
  },
  {
    image: '/images/imageShop3.jpeg', // Idéalement une image de l'équipe technique
    title: "Qualité, Sécurité & Environnement",
    text: "La satisfaction client est notre cheval de bataille. Nous respectons les normes techniques les plus strictes pour chaque projet.",
    ctaLabel: "À propos de Int I-B",
    ctaHref: "#about",
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 6000); // Un peu plus lent pour laisser le temps de lire les textes techniques
    return () => clearInterval(id);
  }, []);

  const current = slides[index];

  return (
    <section className="relative w-full h-[450px] sm:h-[550px] lg:h-[650px] overflow-hidden bg-gray-900">
      
      {/* Background Images avec Overlay */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="w-full h-full bg-center bg-cover scale-105 transition-transform duration-[6000ms]"
            style={{ 
              backgroundImage: `url(${slide.image})`,
              transform: i === index ? 'scale(1)' : 'scale(1.05)' 
            }}
          />
          {/* Gradient overlay pour une meilleure lisibilité du texte blanc */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>
      ))}

      {/* Contenu texte - Changement de couleur pour lisibilité sur fond sombre */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
        <div className="max-w-2xl">
          {/* Petit badge doré pour le prestige */}
          <span className="inline-block px-3 py-1 mb-4 text-[10px] font-bold tracking-[0.3em] uppercase text-[#e8d393] border border-[#e8d393] rounded">
            Intellect IVOIRE-BUSINESS
          </span>
          
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white leading-tight mb-4 drop-shadow-lg">
            {current.title}
          </h1>
          
          <p className="text-base sm:text-lg text-gray-200 mb-8 max-w-lg leading-relaxed drop-shadow">
            {current.text}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="../services_request"
              className="inline-flex items-center justify-center px-8 py-3 rounded-md bg-[#93b86a] text-white font-bold hover:bg-[#7fa75a] transition-all transform hover:scale-105 shadow-lg"
            >
              Demander un devis
            </Link>
            
            {/* Bouton secondaire transparent pour le style "Vitrine" */}
            <Link
              href="/vente"
              className="inline-flex items-center justify-center px-8 py-3 rounded-md border-2 border-white text-white font-bold hover:bg-white hover:text-black transition-all"
            >
              Vente
            </Link>
          </div>
        </div>

        {/* Indicateurs stylisés */}
        <div className="absolute bottom-10 left-6 flex gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`transition-all duration-300 rounded-full ${
                i === index 
                ? 'w-10 h-2 bg-[#93b86a]' 
                : 'w-2 h-2 bg-white/50 hover:bg-white'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}