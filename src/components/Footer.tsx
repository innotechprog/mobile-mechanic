import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import { services } from "@/data/services";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h3 className="text-2xl font-heading text-gradient mb-3">Metro Mobile Mechanic</h3>
            <p className="text-muted-foreground text-sm font-body">
              Professional mobile auto repair — we bring the shop to your driveway.
            </p>
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
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> 076 253 8318</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> info@metromobilemechanic.com</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Serving the entire metro area</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border space-y-1 text-center text-xs text-muted-foreground font-body">
          <p>© {new Date().getFullYear()} Metro Mobile Mechanic. All rights reserved.</p>
          <p>
            <Link to="/booking-policy" className="hover:text-primary transition-colors">Booking Policy</Link>
            {" · "}
            Developed by <a href="https://ibinnovativesolutions.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">IB Innovative Solutions</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
