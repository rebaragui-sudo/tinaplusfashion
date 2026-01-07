import Header from "@/components/sections/header";
import HeroSection from "@/components/sections/hero-carousel";
import InfoBanner from "@/components/sections/info-banner";
import ProductGrid from "@/components/sections/product-grid";
import ModelHighlights from "@/components/sections/model-highlights";
import CategoryPreviews from "@/components/sections/category-previews";
import NewsletterSection from "@/components/sections/newsletter";
import Footer from "@/components/sections/footer";
import NewsletterModal from "@/components/sections/newsletter-modal";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <InfoBanner />
        <ProductGrid />
        <ModelHighlights />
        <CategoryPreviews />
        <NewsletterSection />
      </main>
      <Footer />
      <NewsletterModal />
    </div>
  );
}
