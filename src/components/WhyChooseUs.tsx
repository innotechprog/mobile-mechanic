import { Clock, Shield, MapPin, Wrench, DollarSign, Star } from "lucide-react";

const reasons = [
  {
    icon: MapPin,
    title: "We Come To You",
    description: "No need to tow your car or wait at a shop. We bring professional service right to your driveway.",
  },
  {
    icon: Clock,
    title: "Same-Day Service",
    description: "Fast response times with same-day appointments available 7 days a week.",
  },
  {
    icon: Shield,
    title: "Certified Mechanics",
    description: "ASE-certified technicians with years of experience you can trust.",
  },
  {
    icon: DollarSign,
    title: "Transparent Pricing",
    description: "Upfront quotes with no hidden fees. You approve before we start any work.",
  },
  {
    icon: Wrench,
    title: "Quality Parts",
    description: "We use OEM and high-quality aftermarket parts backed by warranty.",
  },
  {
    icon: Star,
    title: "5-Star Rated",
    description: "Hundreds of satisfied customers across the metro area trust us with their vehicles.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-primary font-heading tracking-widest uppercase text-sm mb-2">
            The Metro Difference
          </p>
          <h2 className="text-4xl md:text-5xl font-heading">
            Why Choose <span className="text-gradient">Us</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors group"
            >
              <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <reason.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-heading text-foreground mb-1">{reason.title}</h3>
              <p className="text-sm text-muted-foreground font-body">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
