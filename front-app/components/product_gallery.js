"use client";
import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images = [] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

  const formatUrl = (url) => {
    if (!url) return "/placeholder.jpg";
    if (url.startsWith("http")) return url;
    const cleanPath = url.replace(/^\/|^storage\//, "");
    return `${baseUrl}/storage/${cleanPath}`;
  };

  const gallery = images.length > 0 ? images : ["/placeholder.jpg"];

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails verticales sur desktop */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0">
        {gallery.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIndex(idx)}
            className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
              selectedIndex === idx ? "border-[#93b86a] scale-95" : "border-gray-100 opacity-60 hover:opacity-100"
            }`}
          >
            <img src={formatUrl(img)} alt="miniature" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Image Principale */}
      <div className="relative flex-1 aspect-[4/5] bg-gray-50 rounded-3xl overflow-hidden group">
        <img
          src={formatUrl(gallery[selectedIndex])}
          alt="Produit principal"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Badge optionnel */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
           <span className="text-[10px] font-black uppercase tracking-widest text-gray-800">Intellect I-B Quality</span>
        </div>
      </div>
    </div>
  );
}