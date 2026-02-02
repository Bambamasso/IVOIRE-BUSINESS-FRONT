'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const slides = [
  {
    image: '/images/imageShop1.jpeg', // remplace par tes vraies images
    title: "Faites la pub de votre business en ligne",
    text: "Présentez vos produits et services à des milliers de clients en Côte d’Ivoire.",
    ctaLabel: "Créer mon compte",
    ctaHref: "/register",
  },
  {
    image: '/images/imageShop2.jpeg',
    title: "Mettez en avant vos promotions",
    text: "Diffusez vos offres spéciales, soldes et nouveautés en quelques clics.",
    ctaLabel: "Publier une offre",
    ctaHref: "/dashboard/offres",
  },
  {
    image: '/images/imageShop3.jpeg',
    title: "Une vitrine pour votre e‑commerce",
    text: "Donnez une image professionnelle à votre boutique et inspirez confiance.",
    ctaLabel: "Découvrir la plateforme",
    ctaHref: "/a-propos",
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  // Auto-slide toutes les 5 secondes
  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const current = slides[index];

  return (
    <section className="relative w-full h-[380px] sm:h-[450px] lg:h-[520px] overflow-hidden">
      
      <div className="absolute inset-0 mx-auto px-4 py-12 lg:py-16">
        {/* Toutes les images, seule la courante est visible */}
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="w-full h-full bg-center bg-cover"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            {/* Overlay sombre pour lire le texte */}
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}
      </div>

      {/* Contenu texte par-dessus l'image */}
      <div className="relative z-10 h-full max-w-6xl mx-auto px-4 flex flex-col justify-center">
        <div className="max-w-xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
            {current.title}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-100">
            {current.text}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={current.ctaHref}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-blue-500 text-white text-sm sm:text-base font-semibold hover:bg-blue-600 transition"
            >
              {current.ctaLabel}
            </Link>
          </div>
        </div>

        {/* Petits indicateurs / puces */}
        <div className="mt-6 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full border border-white/70 ${
                i === index ? 'bg-white' : 'bg-white/30'
              }`}
              aria-label={`Aller au slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
