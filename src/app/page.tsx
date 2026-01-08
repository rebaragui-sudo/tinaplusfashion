import Header from "@/components/sections/header";
import HeroSlider from "@/components/sections/hero-slider";
import CategoryGrid from "@/components/sections/category-grid";
import PriceNavigation from "@/components/sections/price-navigation";
import NewArrivals from "@/components/sections/new-arrivals";
import FeaturesIcons from "@/components/sections/features-icons";
import Footer from "@/components/sections/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSlider />
        <CategoryGrid />
        <PriceNavigation />
        <NewArrivals />
        <FeaturesIcons />
      </main>
      <Footer />
    </div>
  );
}
