import Navbar from "@/components/Navbar";
import SEOMeta from "@/components/SEOMeta";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import ServiceAreas from "@/components/ServiceAreas";
import BookingForm from "@/components/BookingForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOMeta
        title="Metro Mobile Mechanics"
        description="Professional mobile auto repair at your doorstep. Book oil changes, brake repair, battery service & diagnostics. We come to you — no tow truck needed."
        canonical="/"
      />
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <WhyChooseUs />
      <ServiceAreas />
      <BookingForm />
      <Footer />
    </div>
  );
};

export default Index;
