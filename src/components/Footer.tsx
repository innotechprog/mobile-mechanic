import { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";
import { services } from "@/data/services";

const socialLinks = [
  { href: "https://facebook.com", icon: Facebook, label: "Facebook" },
  { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
];

const Footer = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyAccountNumber = async () => {
    try {
      await navigator.clipboard.writeText("1054973130");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h3 className="text-2xl font-heading text-gradient mb-3">Metro Mobile Mechanics</h3>
            <p className="text-muted-foreground text-sm font-body mb-4">
              Professional mobile auto repair — we bring the shop to your driveway.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-heading text-foreground uppercase tracking-wider mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground font-body">
              <li><Link to="/#services" className="hover:text-primary transition-colors">Services</Link></li>
              <li><Link to="/#booking" className="hover:text-primary transition-colors">Book a Service</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-foreground uppercase tracking-wider mb-3">Our Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground font-body">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link to={`/services/${service.slug}`} className="hover:text-primary transition-colors">
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-foreground uppercase tracking-wider mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground font-body">
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> +27 73 269 6847</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> info@metromobilemechanics.co.za</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Serving the entire metro area</li>
            </ul>
            <div className="mt-5 space-y-1 text-sm text-muted-foreground font-body">
              <h4 className="font-heading text-foreground uppercase tracking-wider mb-3">Banking Details</h4>
              <p>Bank Name: Capitec</p>
              <p>
                Account no:{" "}
                <button
                  type="button"
                  onClick={handleCopyAccountNumber}
                  className="text-left transition-colors hover:text-foreground"
                  aria-label="Copy account number"
                  title="Copy account number"
                >
                  1054973130
                </button>
              </p>
              <p>Account Holder: Metro Mobile Mechanics</p>
              <p>Branch Code: 450105</p>
              {copied ? <p className="text-primary">Account number copied.</p> : null}
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border space-y-3 text-center text-xs text-muted-foreground font-body">
          <p>© {new Date().getFullYear()} Metro Mobile Mechanics. All rights reserved.</p>
          <p>
            <Link to="/booking-policy" className="hover:text-primary transition-colors">Booking Policy</Link>
            {" · "}
            Developed by <a href="https://ib-innovativesolutions.com/it-solutions" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">IB Innovative Solutions</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
