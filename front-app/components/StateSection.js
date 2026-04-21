"use client";
import motion from "./motion";
export default function StateSection() {
  const stats = [
    { label: "Sur le terrain depuis", value: "2021", suffix: "" },
    { label: "Capital Social (FCFA)", value: "1 000 000", suffix: "" },
    { label: "Projets Référencés", value: "05", suffix: "+" },
    { label: "Conformité Normes", value: "100", suffix: "%" },
  ];

  return (
    <motion.section
      className="py-12 bg-gray-100"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="text-3xl md:text-4xl font-black text-[#93b86a] mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.value}
                {stat.suffix}
              </div>
              <div className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-widest">
                {stat.label}
              </div>
              {/* Petite barre décorative dorée */}
              <div className="w-8 h-1 bg-[#e8d393] mx-auto mt-4 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
