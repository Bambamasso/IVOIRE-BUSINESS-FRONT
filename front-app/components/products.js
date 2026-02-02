'use client';

import Link from 'next/link';



const dummyOffers = [
  {
    id: 1,
    title: 'Pack pub réseaux sociaux',
    description:
      'Création de visuels + publication sur Facebook & Instagram pour votre business.',
    badge: '-20% cette semaine',
    priceLabel: '25 000 FCFA',
    image: '/images/offre-1.jpg',
  },
  {
    id: 2,
    title: 'Mise en avant boutique',
    description:
      'Votre boutique en première position sur la page d’accueil pendant 7 jours.',
    badge: 'Nouveau',
    priceLabel: '15 000 FCFA',
    image: '/images/offre-2.jpg',
  },
  {
    id: 3,
    title: 'Vitrine produits premium',
    description:
      'Présentez une sélection de vos meilleurs produits avec photos et prix.',
    badge: 'E‑commerce',
    priceLabel: 'À partir de 10 000 FCFA',
    image: '/images/offre-3.jpg',
  },
];

export default function FeaturedOffers() {
  // plus tard tu remplaceras dummyOffers par des données venant de ton API
  const offers = dummyOffers;

  return (
    <section className="bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 py-12 lg:py-16">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Offres en vedette
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Quelques exemples d’offres que vos clients pourront voir sur la plateforme.
            </p>
          </div>
          <Link
            href="/offers"
            className="hidden sm:inline-flex px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
          >
            Voir toutes les offres
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col"
            >
              <div className="h-40 sm:h-44 bg-gray-200 dark:bg-gray-800">
                {/* plus tard tu pourras mettre <Image /> ici si tu as une image */}
                {/* <Image src={offer.image} ... /> */}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                {offer.badge && (
                  <span className="inline-flex px-2 py-1 text-[11px] font-semibold rounded-full bg-blue-100 text-blue-700 w-max">
                    {offer.badge}
                  </span>
                )}
                <h3 className="mt-3 text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                  {offer.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300 flex-1">
                  {offer.description}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    {offer.priceLabel}
                  </p>
                  <button className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700">
                    Voir l’offre
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 sm:hidden text-center">
          <Link
            href="/offers"
            className="inline-flex px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
          >
            Voir toutes les offres
          </Link>
        </div>
      </div>
    </section>
  );
}
