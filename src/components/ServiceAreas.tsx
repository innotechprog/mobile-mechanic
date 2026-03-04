import { MapPin } from "lucide-react";

const areas = [
  "Johannesburg",
  "Sandton",
  "Pretoria",
];

const ServiceAreas = () => {
  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-primary font-heading tracking-widest uppercase text-sm mb-2">Our Service Areas</p>
          <h2 className="text-4xl md:text-5xl font-heading">
            Areas We <span className="text-gradient">Serve</span>
          </h2>
          <p className="text-muted-foreground font-body mt-4 max-w-xl mx-auto">
            We currently service Johannesburg, Sandton, and Pretoria.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {areas.map((area) => (
            <div
              key={area}
              className="flex items-center gap-2 bg-secondary border border-border rounded-md px-4 py-3 hover:border-primary/50 transition-colors"
            >
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              <span className="text-sm font-body text-foreground">{area}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceAreas;
