import { Link } from "react-router-dom";
import { ArrowLeft, Wrench, MapPin, Clock, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOMeta from "@/components/SEOMeta";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOMeta
        title="About Us"
        description="Metro Mobile Mechanics brings professional auto repair to your doorstep. Learn about our certified mechanics, commitment to quality, and the metro area we serve."
        canonical="/about"
      />
      <Navbar />
      <main className="pt-24 pb-16 md:pt-28 md:pb-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-body text-sm mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div className="space-y-12">
            <div>
              <p className="text-primary font-heading tracking-widest uppercase text-sm mb-2">
                Who We Are
              </p>
              <h1 className="text-4xl md:text-5xl font-heading mb-6">
                About <span className="text-gradient">Metro Mobile Mechanics</span>
              </h1>
              <p className="text-muted-foreground font-body text-lg leading-relaxed">
                Metro Mobile Mechanics was founded on a simple idea: car repairs shouldn&apos;t require a tow truck, 
                a day off work, or hours spent in a waiting room. We bring the shop to you — whether you&apos;re at 
                home, the office, or on the road.
              </p>
              <p className="text-muted-foreground font-body text-lg leading-relaxed mt-4">
                Our certified mechanics travel across the metro area with professional-grade equipment and 
                quality parts, delivering the same standard of service you&apos;d expect from a top-tier repair shop. 
                The only difference? We come to you.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-heading text-foreground mb-6">What We Stand For</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: Wrench, title: "Quality Work", desc: "We use OEM and premium aftermarket parts. Every job is done right, the first time." },
                  { icon: Shield, title: "Trust & Transparency", desc: "Upfront quotes, no surprises. You approve before we start any work." },
                  { icon: Clock, title: "Convenience First", desc: "Same-day appointments available 7 days a week. We work around your schedule." },
                  { icon: MapPin, title: "Serving the Metro", desc: "We cover the entire metro area — home, office, or wherever you need us." },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-4 p-4 rounded-lg bg-card border border-border">
                    <div className="shrink-0 w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading text-foreground mb-1">{title}</h3>
                      <p className="text-sm text-muted-foreground font-body">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-8">
              <p className="text-muted-foreground font-body leading-relaxed">
                Ready to experience hassle-free auto repair?{" "}
                <Link to="/#booking" className="text-primary hover:underline font-medium">
                  Book a service
                </Link>{" "}
                or call us at{" "}
                <a href="tel:+27732696847" className="text-primary hover:underline font-medium">
                  +27 73 269 6847
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
