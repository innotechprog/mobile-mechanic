import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <a href="#" className="font-heading text-xl uppercase tracking-wider">
          <span className="text-gradient">Metro</span>{" "}
          <span className="text-foreground">Mobile Mechanic</span>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#services" className="text-sm font-heading uppercase tracking-wider text-foreground hover:text-primary transition-colors">Services</a>
          <a href="#booking" className="text-sm font-heading uppercase tracking-wider text-foreground hover:text-primary transition-colors">Book Now</a>
          <a
            href="tel:+15551234567"
            className="inline-flex items-center gap-2 bg-primary text-foreground font-heading text-sm uppercase tracking-wider px-5 py-2 rounded-md hover:opacity-90 transition-opacity"
          >
            <Phone className="w-4 h-4" /> Call Us
          </a>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-background border-b border-border px-4 pb-4 space-y-3">
          <a href="#services" onClick={() => setOpen(false)} className="block font-heading uppercase tracking-wider text-foreground hover:text-primary transition-colors">Services</a>
          <a href="#booking" onClick={() => setOpen(false)} className="block font-heading uppercase tracking-wider text-foreground hover:text-primary transition-colors">Book Now</a>
          <a href="tel:+15551234567" className="inline-flex items-center gap-2 bg-primary text-foreground font-heading text-sm uppercase tracking-wider px-5 py-2 rounded-md">
            <Phone className="w-4 h-4" /> Call Us
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
