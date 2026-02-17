import serviceBrakes from "@/assets/service-brakes.jpg";
import serviceOil from "@/assets/service-oil.jpg";
import serviceBattery from "@/assets/service-battery.jpg";
import serviceDiagnostics from "@/assets/service-diagnostics.jpg";

export interface Service {
  slug: string;
  title: string;
  description: string;
  image: string;
  longDescription: string;
  benefits: string[];
  includes: string[];
}

export const services: Service[] = [
  {
    slug: "oil-change",
    title: "Oil Change",
    description: "Full synthetic & conventional oil changes with filter replacement.",
    image: serviceOil,
    longDescription:
      "Keep your engine running smoothly with our professional mobile oil change service. We come to your home or office with everything needed for a complete oil change. Using quality oils and OEM-compatible filters, we'll have your vehicle back on the road in no time.",
    benefits: [
      "Extends engine life and prevents costly repairs",
      "Improves fuel efficiency and performance",
      "Reduces harmful emissions",
      "Convenient — no need to visit a shop or wait",
    ],
    includes: [
      "Drain and replace engine oil",
      "Replace oil filter",
      "Full synthetic, synthetic blend, or conventional options",
      "Multi-point fluid level check",
      "Proper disposal of used oil",
    ],
  },
  {
    slug: "brake-repair",
    title: "Brake Repair",
    description: "Pads, rotors, calipers — complete brake service at your location.",
    image: serviceBrakes,
    longDescription:
      "Your safety is our priority. Our certified mechanics perform complete brake services at your location — from simple pad replacements to full brake system overhauls. We carry quality parts and have the expertise to get your brakes performing like new.",
    benefits: [
      "Restored stopping power and safety",
      "Prevents costly rotor damage from worn pads",
      "Smooth, quiet braking",
      "Same-day service available",
    ],
    includes: [
      "Brake pad replacement (front and/or rear)",
      "Rotor resurfacing or replacement",
      "Caliper service and repair",
      "Brake fluid inspection and flush",
      "Complete brake system inspection",
    ],
  },
  {
    slug: "battery-service",
    title: "Battery Service",
    description: "Testing, jump starts, and battery replacement on the spot.",
    image: serviceBattery,
    longDescription:
      "Dead battery? No problem. We'll come to you for jump starts, battery testing, and replacement. Our mobile service includes load testing to ensure your battery is healthy, and we can install a new one on the spot if needed.",
    benefits: [
      "No need to call a tow truck",
      "Quick jump starts when you're stranded",
      "Accurate battery testing and diagnostics",
      "Quality replacement batteries in stock",
    ],
    includes: [
      "Jump start service",
      "Battery load testing",
      "Terminal cleaning and inspection",
      "Battery replacement and installation",
      "Alternator and charging system check",
    ],
  },
  {
    slug: "diagnostics",
    title: "Diagnostics",
    description: "Full computer diagnostics to find and fix the problem fast.",
    image: serviceDiagnostics,
    longDescription:
      "Check engine light on? Strange noises or performance issues? Our mobile diagnostic service uses professional-grade scanners to read your vehicle's computer and identify the root cause. We'll explain the findings and provide options to get you back on the road.",
    benefits: [
      "Pinpoint exact problems quickly",
      "Avoid unnecessary repairs and guesswork",
      "Save time — no multiple trips to the shop",
      "Transparent pricing and explanations",
    ],
    includes: [
      "OBD-II scan and code retrieval",
      "Live data stream analysis",
      "Battery and charging system test",
      "Emissions readiness check",
      "Detailed report and repair recommendations",
    ],
  },
];

export const getServiceBySlug = (slug: string): Service | undefined =>
  services.find((s) => s.slug === slug);

export const getServiceSlugs = (): string[] => services.map((s) => s.slug);
