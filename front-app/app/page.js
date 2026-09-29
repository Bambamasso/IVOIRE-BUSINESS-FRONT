import Image from "next/image";
import Navbar from "@/components/navigation";
import Link from "next/link";
import axios from "axios";
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

async function getSlides() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  try {
    const response = await axios.get(`${baseUrl}/api/home/media-slides`);
    return response.data.data || [];
  } catch (error) {
    console.error("Erreur lors du chargement des slides :", error);
    return [];
  }
}

export default async function Home() {
  const slides = await getSlides();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* --- 1. Section Héro (Le Canapé) --- */}
        <HeroSlider slides={slides} />
        
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
