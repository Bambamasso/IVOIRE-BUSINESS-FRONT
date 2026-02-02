import Image from "next/image";
import Navbar from "@/components/navigation";
import Link from "next/link";
import HeroSlider from "@/components/slid";
import FeaturedOffers from "@/components/products";
import Footer from "@/components/footer";
import { Categories } from "@/components/categories";
import NewsletterSection from "@/components/newsletter";
import ServicesSection from "@/components/services";


async function getPopularCategories() {
  return [
    { name: "Tech & Innovation", icon: "📱", link: "/articles?cat=tech" },
    { name: "Finance & Business", icon: "💰", link: "/articles?cat=finance" },
    { name: "Immobilier & BTP", icon: "🏗️", link: "/articles?cat=immo" },
  ];
}
export default async function Home() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        
        {/* --- 1. Section Héro (Le Canapé) --- */}
        <HeroSlider />
        {/* section categorie */}
        <Categories />

        {/* --- 3. Section Annonces/Collections Mises en Avant (à adapter) --- */}
        <FeaturedOffers />
        
        {/* --- Section Services --- */}
        <ServicesSection />

        {/* section newletter */}
        <NewsletterSection />
        {/* --- Footer --- */}
        <Footer />
      </div>
    </>
  );
}
