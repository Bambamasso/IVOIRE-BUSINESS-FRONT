'use client';

// Services de l'entreprise
const servicesData = [
  {
    id: 1,
    title: 'Ventes',
    icon: '🛍️',
    description: 'Découvrez nos produits et services de qualité. Mettre vos produits en avant avec des fiches produits complètes avec photo, prix, description et contacts pour être trouvé facilement.',
  },
  {
    id: 2,
    title: 'Transit',
    icon: '🚚',
    description: 'Services de transport et logistique fiables. Livraison sécurisée, emballage professionnel et suivi en temps réel de vos colis sur tout le territoire ivoirien.',
  },
  {
    id: 3,
    title: 'Construction & Grands Travaux',
    icon: '🏗️',
    description: 'Solutions complètes pour vos projets de construction. Matériaux premium, services de BTP avec équipes qualifiées, études et planning de vos grands projets.',
  },
];

export default function ServicesSection() {
  return (
    <section className="bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 py-12 lg:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center">
          Ce que vous pouvez faire avec Ivoire Business
        </h2>
        <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-300 text-center max-w-2xl mx-auto">
          Une plateforme pour présenter vos produits, services et promotions
          comme sur un vrai site e‑commerce.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {servicesData.map((service) => (
            <div
              key={service.id}
              className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{service.icon}</span>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {service.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
