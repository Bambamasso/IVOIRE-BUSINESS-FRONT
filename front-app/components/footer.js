import Link from 'next/link';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaLinkedin, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[#f9f9f9] text-gray-800 pt-16 pb-8 px-6 border-t border-gray-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
        
        {/* Colonne Logo & Bio Institutionnelle */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 text-xl font-black text-[#93b86a] mb-6">
            <span className="bg-[#93b86a] text-white w-10 h-10 rounded-lg flex items-center justify-center shadow-lg">
              I
            </span>
            INTELLECT I-B
          </div>
          <p className="text-sm leading-relaxed text-gray-600 mb-6 max-w-sm">
            Expert en Voirie, Réseaux Divers (VRD) et Aménagements. 
            Nous bâtissons des infrastructures durables pour le développement de la Côte d'Ivoire depuis 2021.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-3 bg-white shadow-sm rounded-full text-[#93b86a] hover:bg-[#93b86a] hover:text-white transition-all">
              <FaFacebook size={18} />
            </a>
            <a href="#" className="p-3 bg-white shadow-sm rounded-full text-[#93b86a] hover:bg-[#93b86a] hover:text-white transition-all">
              <FaLinkedin size={18} />
            </a>
            <a href="https://wa.me/2250142616867" className="p-3 bg-white shadow-sm rounded-full text-[#93b86a] hover:bg-[#93b86a] hover:text-white transition-all">
              <FaWhatsapp size={18} />
            </a>
          </div>
        </div>

        {/* Liens Entreprise */}
        <div>
          <h4 className="text-gray-900 font-bold mb-6 uppercase tracking-widest text-xs">L'Entreprise</h4>
          <ul className="space-y-4 text-sm text-gray-600">
            <li><Link href="/a-propos" className="hover:text-[#93b86a] transition">À Propos</Link></li>
            <li><Link href="#services" className="hover:text-[#93b86a] transition">Nos Services</Link></li>
            <li><Link href="#realisations" className="hover:text-[#93b86a] transition">Nos Réalisations</Link></li>
            <li><Link href="/boutique" className="text-[#93b86a] font-bold">La Boutique</Link></li>
          </ul>
        </div>

        {/* Expertise Technique */}
        <div>
          <h4 className="text-gray-900 font-bold mb-6 uppercase tracking-widest text-xs">Expertise</h4>
          <ul className="space-y-4 text-sm text-gray-600">
            <li>Voirie & Réseaux (VRD)</li>
            <li>Assainissement (EU/EP)</li>
            <li>Terrassement Lourd</li>
            <li>Aménagement Rural</li>
          </ul>
        </div>

        {/* Contact Info Réel */}
        <div>
          <h4 className="text-gray-900 font-bold mb-6 uppercase tracking-widest text-xs">Contact Direct</h4>
          <ul className="space-y-4 text-sm text-gray-600">
            <li className="flex items-start gap-3">
              <FaPhone className="text-[#93b86a] mt-1" />
              <span>+225 01 42 61 68 67</span>
            </li>
            <li className="flex items-start gap-3">
              <FaEnvelope className="text-[#93b86a] mt-1" />
              <span className="break-all">info@intellect-ib.com</span>
            </li>
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-[#93b86a] mt-1" />
              <span>Abidjan, Cocody Angré <br />Carrefour Victor Lobad</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Barre de fin avec Mentions Légales */}
      <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="text-[10px] text-gray-500 space-y-1 text-center lg:text-left font-medium uppercase tracking-tighter">
          <p>Intellect IVOIRE-BUSINESS SAURL • Capital : 1.000.000 FCFA</p>
          <p>RCCM : CI-ABJ-03-2024-B13-10822 • CC : 2434771 F</p>
        </div>
        
        <p className="text-xs text-gray-400">
          Copyright © 2026 INTELLECT I-B. Tous droits réservés.
        </p>

        <div className="flex gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <span>Côte d'Ivoire</span>
          <span>Franc CFA (XOF)</span>
        </div>
      </div>
    </footer>
  );
}