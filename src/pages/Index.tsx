import NavBar from "@/components/landing/NavBar";
import HeroSection from "@/components/landing/HeroSection";
import InsightPreview from "@/components/landing/InsightPreview";
import FeaturesSection from "@/components/landing/FeaturesSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PricingSection from "@/components/landing/PricingSection";
import FooterSection from "@/components/landing/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="pt-14">
        <HeroSection />
        <div id="how-it-works">
          <InsightPreview />
        </div>
        <div id="features">
          <FeaturesSection />
        </div>
        <TestimonialsSection />
        <div id="pricing">
          <PricingSection />
        </div>
      </main>
      <FooterSection />
    </div>
  );
};

export default Index;
