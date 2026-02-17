import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { services } from "@/data/services";

const navLinkClass = "text-sm font-heading uppercase tracking-wider text-foreground hover:text-primary transition-colors";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="font-heading text-xl uppercase tracking-wider">
          <span className="text-gradient">Metro</span>{" "}
          <span className="text-foreground">Mobile Mechanic</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <DropdownMenu>
            <DropdownMenuTrigger
              className={`flex items-center gap-1 p-0 h-auto bg-transparent border-0 outline-none ${navLinkClass}`}
            >
              Services <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[200px]">
              <DropdownMenuItem asChild>
                <Link to="/#services" className="cursor-pointer font-heading uppercase tracking-wider">
                  All Services
                </Link>
              </DropdownMenuItem>
              {services.map((service) => (
                <DropdownMenuItem key={service.slug} asChild>
                  <Link
                    to={`/services/${service.slug}`}
                    className="cursor-pointer font-heading uppercase tracking-wider"
                  >
                    {service.title}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link to="/#booking" className={navLinkClass}>
            Book Now
          </Link>
          <Link to="/about" className={navLinkClass}>
            About
          </Link>
          <a
            href="tel:0762538318"
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
          <div>
            <button
              onClick={() => setServicesOpen(!servicesOpen)}
              className={`flex w-full items-center justify-between ${navLinkClass} py-1`}
            >
              Services <ChevronDown className={`h-4 w-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
            </button>
            {servicesOpen && (
              <div className="ml-4 mt-2 space-y-1 border-l border-border pl-3">
                <Link to="/#services" onClick={() => { setOpen(false); setServicesOpen(false); }} className={`block ${navLinkClass} text-xs`}>
                  All Services
                </Link>
                {services.map((service) => (
                  <Link
                    key={service.slug}
                    to={`/services/${service.slug}`}
                    onClick={() => { setOpen(false); setServicesOpen(false); }}
                    className={`block ${navLinkClass} text-xs`}
                  >
                    {service.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link to="/#booking" onClick={() => setOpen(false)} className={`block ${navLinkClass}`}>
            Book Now
          </Link>
          <Link to="/about" onClick={() => setOpen(false)} className={`block ${navLinkClass}`}>
            About
          </Link>
          <a href="tel:0762538318" className="inline-flex items-center gap-2 bg-primary text-foreground font-heading text-sm uppercase tracking-wider px-5 py-2 rounded-md">
            <Phone className="w-4 h-4" /> Call Us
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
