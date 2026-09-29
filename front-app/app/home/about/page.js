import Footer from "@/components/footer";
import Navbar from "@/components/navigation";
import React from "react";

export default function AboutPage() {
  // Équipe de direction simplifiée
  const team = [
    { name: "KOUEDAN BOYO HERVÉ ANDRÉ", role: "Gérant / Directeur Général" },
    {
      name: "DOUABOU ZOZORO SIMON PIERRE ROMARIC",
      role: "Responsable Technique",
    },
    { name: "YEHOUE VINCENT", role: "Conducteur Principal" },
    {
      name: "KOUEDAN née GOGOUA AHOU CLAUDE MARCELLE",
      role: "Responsable Logistique",
    },
    { name: "BENE BI BORIS COLINS", role: "Chef Comptable" },
  ];

  // Atouts concurrentiels réintégrés de façon moderne
  const strengths = [
    {
      title: "Expérience prouvée",
      desc: "Une présence active, efficace et des interventions réussies sur le terrain depuis 2021.",
    },
    {
      title: "Respect des engagements",
      desc: "Un respect strict des délais convenus, des cahiers des charges et des normes techniques.",
    },
    {
      title: "Réactivité & Souplesse",
      desc: "Une grande capacité de réponse rapide et de déploiement sur l’ensemble du territoire ivoirien.",
    },
    {
      title: "Matériel moderne",
      desc: "L’utilisation d’engins et d’équipements performants adaptés à chaque type de chantier.",
    },
    {
      title: "Démarche QSE rigoureuse",
      desc: "Un engagement ferme pour la Qualité, la Sécurité de nos ouvriers et le respect de l’Environnement.",
    },
    {
      title: "La satisfaction pour cheval de bataille",
      desc: "Une écoute attentive pour bâtir des relations de confiance durables avec chacun de nos clients.",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="bg-[#faf9f6] min-h-screen text-slate-800 font-sans pb-16">
        {/* 1. EN-TÊTE ÉPURÉ ET LUMINEUX */}
        <div className="max-w-6xl mx-auto pt-16 pb-12 px-4 md:px-8 text-center">
          <span className="text-[#93b86a] text-xs font-bold tracking-widest uppercase bg-[#93b86a]/10 px-4 py-1.5 rounded-full">
            Qui sommes-nous ?
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mt-4 tracking-tight">
            Intellect <span className="text-[#93b86a]">IVOIRE-BUSINESS</span>
          </h1>
          <div className="w-16 h-1 bg-[#e8d393] mx-auto mt-6 rounded-full"></div>
        </div>

        {/* 2. CONTENEUR PRINCIPAL ÉLARGI */}
        <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-16 text-left">
          {/* NOTRE HISTOIRE */}
          <section className="bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-sm space-y-8 text-left">
            <h2 className="text-xl md:text-2.5xl font-black text-slate-900 border-l-4 border-[#e8d393] pl-4 text-left">
              Notre Histoire
            </h2>
            <div className="text-slate-600 space-y-4 text-sm md:text-base leading-relaxed">
              <p>
                Créée officiellement en <strong>2024</strong>, l’aventure d’
                <strong>Intellect IVOIRE-BUSINESS</strong> a pourtant débuté sur
                le terrain dès <strong>2021</strong>. Durant ces premières
                années d'interventions, nous avons façonné notre savoir-faire à
                travers de multiples chantiers d'aménagement routier et de
                Voirie et Réseaux Divers (VRD) en Côte d'Ivoire.
              </p>
              <p>
                Notre motivation profonde est née du constat des grands projets
                d’aménagement, de construction et d’équipement qui transforment
                notre territoire. Nous avons choisi d'y apporter notre
                contribution en nous imposant comme un partenaire local de
                confiance, rigoureux et guidé par un seul mot d'ordre :{" "}
                <strong>la satisfaction totale de nos clients</strong>.
              </p>
            </div>

            {/* Vision & Mission minimalistes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-slate-100 text-left">
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-sm md:text-base">
                  Notre Vision
                </h3>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
                  Être une entreprise ivoirienne de référence dans le domaine de
                  l'aménagement urbain et des réseaux divers.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-sm md:text-base">
                  Notre Mission
                </h3>
                <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
                  Garantir des travaux d'une qualité technique irréprochable
                  dans le strict respect des normes de sécurité et
                  environnementales.
                </p>
              </div>
            </div>
          </section>

          {/* 3. L'ÉQUIPE DE DIRECTION (3 colonnes) */}
          <section className="space-y-6 text-left">
            <h2 className="text-xl md:text-2.5xl font-black text-slate-900 border-l-4 border-[#e8d393] pl-4 text-left">
              L'Équipe de Direction
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((member, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-[#93b86a]/30 transition-colors flex items-center gap-4"
                >
                  <div className="h-12 w-12 rounded-full bg-[#93b86a]/10 text-[#93b86a] flex items-center justify-center font-bold shrink-0">
                    {member.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h4
                      className="font-bold text-slate-900 text-xs md:text-sm truncate"
                      title={member.name}
                    >
                      {member.name}
                    </h4>
                    <p className="text-xs text-slate-400 font-medium mt-0.5 truncate">
                      {member.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. POURQUOI NOUS CHOISIR ? (3 colonnes) */}
          <section className="space-y-6 text-left">
            <h2 className="text-xl md:text-2.5xl font-black text-slate-900 border-l-4 border-[#e8d393] pl-4 text-left">
              Pourquoi nous choisir ?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {strengths.map((strength, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#93b86a]">
                      <span className="bg-[#93b86a]/10 p-1.5 rounded-lg shrink-0">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m4.5 12.75 6 6 9-13.5"
                          />
                        </svg>
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm md:text-base leading-snug">
                        {strength.title}
                      </h4>
                    </div>
                    <p className="text-xs md:text-sm text-slate-500 leading-relaxed pl-9">
                      {strength.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
