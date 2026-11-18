import FeaturedServices from "@/components/Home/FeaturedServices";
import HeroSection from "@/components/Home/HeroSection";
import ServiceCategories from "@/components/Home/ServiceCategories";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <HeroSection></HeroSection>
      <FeaturedServices></FeaturedServices>
      <ServiceCategories></ServiceCategories>
    </div>
  );
}
