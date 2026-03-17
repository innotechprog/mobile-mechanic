import heroImage from "@/assets/jump-1.jpeg";
import { Link } from "react-router-dom";
import { Phone, MapPin } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 md:pt-28 md:pb-20">
      <img
        src={heroImage}
        alt="Metro Mobile Mechanic working on a car"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-hero-overlay" />
      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl animate-fade-in-up">
          <p className="text-primary font-heading text-base sm:text-lg tracking-widest uppercase mb-3">
            We Come To You
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading leading-tight mb-5 md:mb-6">
            Metro Mobile{" "}
            <span className="text-gradient">Mechanic</span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg md:text-xl mb-6 md:mb-8 max-w-xl font-body leading-relaxed">
            Professional auto repair at your doorstep. No tow truck needed — our certified mechanics bring the shop to you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              to="/#booking"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-heading text-base sm:text-lg uppercase tracking-wider px-6 py-3.5 sm:px-8 sm:py-4 rounded-md hover:opacity-90 transition-opacity glow-orange focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
            >
              Book a Service
            </Link>
            <a
              href="tel:+27732696847"
              className="inline-flex items-center justify-center gap-2 border-2 border-border text-foreground font-heading text-base sm:text-lg uppercase tracking-wider px-6 py-3.5 sm:px-8 sm:py-4 rounded-md hover:bg-secondary hover:border-primary/50 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
            >
              <Phone className="w-5 h-5 shrink-0" />
              Call Now
            </a>
          </div>
          <div className="mt-8 md:mt-10 flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <span className="text-sm font-body">Serving the entire metro area — 7 days a week</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
