import heroImage from "@/assets/hero-mechanic.jpg";
import { Phone, MapPin } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center">
      <img
        src={heroImage}
        alt="Metro Mobile Mechanic working on a car"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-hero-overlay" />
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-3xl animate-fade-in-up">
          <p className="text-primary font-heading text-lg tracking-widest uppercase mb-2">
            We Come To You
          </p>
          <h1 className="text-5xl md:text-7xl font-heading leading-tight mb-6">
            Metro Mobile{" "}
            <span className="text-gradient">Mechanic</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl mb-8 max-w-xl font-body">
            Professional auto repair at your doorstep. No tow truck needed — our certified mechanics bring the shop to you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#booking"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-heading text-lg uppercase tracking-wider px-8 py-4 rounded-md hover:opacity-90 transition-opacity glow-orange"
            >
              Book a Service
            </a>
            <a
              href="tel:+15551234567"
              className="inline-flex items-center justify-center gap-2 border border-border text-foreground font-heading text-lg uppercase tracking-wider px-8 py-4 rounded-md hover:bg-secondary transition-colors"
            >
              <Phone className="w-5 h-5" />
              Call Now
            </a>
          </div>
          <div className="mt-10 flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-body">Serving the entire metro area — 7 days a week</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
