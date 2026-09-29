"use client";
import { Categories } from "@/components/categories";
import Footer from "@/components/footer";
import Navbar from "@/components/navigation";
import Products from "@/components/products";

export default function VentePage() {
  return (
    <>
      <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header de la Boutique */}
      <section className="bg-[#93b86a] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1 mb-4 text-xs font-bold tracking-[0.2em] uppercase text-[#e8d393] border border-[#e8d393]/30 rounded-full bg-white/10">
            Intellect IVOIRE-BUSINESS Shop
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 italic uppercase tracking-tight">
            NOTRE <span className="text-[#e8d393]">BOUTIQUE</span>
          </h1>
          <p className="text-white/90 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
            Découvrez notre sélection de produits de haute qualité. 
            Fiabilité, durabilité et excellence pour tous vos besoins.
          </p>
        </div>
      </section>

      {/* Contenu Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 pb-20">
        
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-12 border border-gray-100">
           <Categories />
        </div>

        {/* Section produits - Ta grille d'articles */}
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">
              Tous les produits
            </h2>
            <p className="text-sm text-gray-500 font-medium italic">
              Expédition rapide partout en Côte d&apos;Ivoire
            </p>
          </div>
          
          <Products />
        </div>

      </main>

      <Footer />
    </div>
    </>
  );
}
