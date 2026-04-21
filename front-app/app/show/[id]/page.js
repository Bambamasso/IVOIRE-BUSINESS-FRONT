
import Footer from "@/components/footer";
import Navbar from "@/components/navigation";
import ProductGallery from "@/components/product_gallery";
import ProductInfo from "@/components/product_info";
import axios from "axios";

export default async function Show({ params }) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const resolvedParams = await params;

  const url = `${baseUrl}/api/home/product/${resolvedParams?.id}`;
  const response = await axios.get(url);
  const product = response?.data?.data || {};
    console.log(product);
  // Try to extract image URLs from common shapes returned by API
   const rawImages = product.media || product.image || [];
   const images = Array.isArray(rawImages)
  //  console.log(images)
     ? rawImages.map((it) => {
         if (!it) return null;
         if (typeof it === "string") return it;
         return it.url || it.file_path || it.src || it.file_name || null;
       }).filter(Boolean)
     : [];

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto p-6 bg-white">
        <div className="mb-6">
          <a
            href="/vente"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#93b86a] transition-colors"
          >
            {/* Icône flèche gauche si tu veux : <FaArrowLeft className="inline" /> */}
            ← Retour à la boutique
          </a>
        </div>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-[560px] flex-shrink-0">
            <ProductGallery images={images} />
          </div>
          <div className="flex-1">
            <ProductInfo product={product}
            />
          </div>
        </div>
      </div>
       <Footer/>
    </>
  );
}
