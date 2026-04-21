import Image from "next/image";
import Navbar from "@/components/navigation";
import Link from "next/link";
import HeroSlider from "@/components/Hero";
import FeaturedOffers from "@/components/products";
import Footer from "@/components/footer";
import { Categories } from "@/components/categories";
import NewsletterSection from "@/components/newsletter";
import ServicesSection from "@/components/services";
import StateSection from "@/components/StateSection";
import Expertise from "@/components/Expertise";
import Projects from "@/components/Projects";
import Partners from "@/components/Partners";
import AboutSummary from "@/components/About";
export default async function Home() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* --- 1. Section Héro (Le Canapé) --- */}
        <HeroSlider />
        
        {/* section state */}
        <StateSection />
        {/* section à propos */}
        <AboutSummary />
        {/* section expertise */}
        <Expertise />
        {/* sercition projet (réalisation) */}
        <Projects />

        {/* section partenaires */}
        <Partners />
        {/* section categorie */}
        {/* <Categories /> */}

        {/* --- 3. Section Annonces/Collections Mises en Avant (à adapter) --- */}
        {/* <FeaturedOffers /> */}

        {/* --- Section Services --- */}
        {/* <ServicesSection /> */}

        {/* section newletter */}
        {/* <NewsletterSection /> */}
        {/* --- Footer --- */}
        <Footer />
      </div>
    </>
  );
}
