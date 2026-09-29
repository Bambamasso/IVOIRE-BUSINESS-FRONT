// Si tu utilises lucide-react pour l'icône
import Image from "next/image";

export default function NewsletterSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      
      {/* --- BANNIÈRE PROMO --- */}
      <div className="flex flex-col md:flex-row overflow-hidden rounded-xl bg-black mb-16">
        {/* Image de gauche */}
        <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-gray-800">
          {/* Image placeholder - à remplacer par une vraie URL */}
        </div>
        
        {/* Texte de droite */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-start text-white">
          <span className="text-xs uppercase tracking-widest text-gray-400 mb-2">
            Limited Offer
          </span>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
            35% off only this friday and get special gift
          </h2>
          <button className="bg-white text-black px-6 py-3 rounded-md text-sm font-semibold flex items-center gap-2 hover:bg-gray-200 transition">
            Grab it now 
            <span>→</span>
          </button>
        </div>
      </div>

      {/* --- FORMULAIRE NEWSLETTER --- */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Subscribe to our newsletter to get updates to our latest collections
        </h2>
        <p className="text-gray-500 text-sm mb-8">
          Get 20% off on your first order just by subscribing to our newsletter
        </p>

        <form className="relative flex items-center max-w-md mx-auto mb-4">
          <div className="absolute left-4 text-gray-400">
          <p className="">Bonjour </p>
          </div>
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="w-full pl-12 pr-32 py-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
            required
          />
          <button 
            type="submit" 
            className="absolute right-2 bg-[#1A1C23] text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-black transition"
          >
            Subscribe
          </button>
        </form>

        <p className="text-[10px] text-gray-400">
          You will be able to unsubscribe at any time. <br />
          Read our Privacy Policy <span className="underline cursor-pointer">here</span>.
        </p>
      </div>
    </section>
  );
}