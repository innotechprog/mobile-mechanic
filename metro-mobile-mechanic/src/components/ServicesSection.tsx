import serviceBrakes from "@/assets/service-brakes.jpg";
import serviceOil from "@/assets/service-oil.jpg";
import serviceBattery from "@/assets/service-battery.jpg";
import serviceDiagnostics from "@/assets/service-diagnostics.jpg";

const services = [
  {
    title: "Oil Change",
    description: "Full synthetic & conventional oil changes with filter replacement.",
    image: serviceOil,
  },
  {
    title: "Brake Repair",
    description: "Pads, rotors, calipers — complete brake service at your location.",
    image: serviceBrakes,
  },
  {
    title: "Battery Service",
    description: "Testing, jump starts, and battery replacement on the spot.",
    image: serviceBattery,
  },
  {
    title: "Diagnostics",
    description: "Full computer diagnostics to find and fix the problem fast.",
    image: serviceDiagnostics,
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 bg-section-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-primary font-heading tracking-widest uppercase text-sm mb-2">
            What We Do
          </p>
          <h2 className="text-4xl md:text-5xl font-heading">
            Our <span className="text-gradient">Services</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="group bg-card rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-colors"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-heading text-foreground mb-1">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm font-body">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
