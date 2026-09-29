export default function OrdersPage() {
  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Mes Commandes</h1>

        {/* Liste des commandes */}
        <div className="space-y-4">
          {/* Placeholder pour les commandes */}
          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">
                  Commande #[Numéro]
                </h3>
                <p className="text-sm text-gray-600">[Date de la commande]</p>
                <p className="text-sm text-gray-600 mt-1">[Nombre darticles]</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">[Montant] €</p>
                <span className="inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  [Statut]
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Message si aucune commande */}
        <div className="text-center py-12">
          <p className="text-gray-600">Vous navez pas encore de commandes.</p>
          <a
            href="/products"
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            Continuer vos achats
          </a>
        </div>
      </div>
    </>
  );
}
