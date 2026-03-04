import serviceBrakes from "@/assets/service-brakes.jpg";
import serviceOil from "@/assets/service-oil.jpg";
import serviceBattery from "@/assets/service-battery.jpg";
import serviceDiagnostics from "@/assets/service-diagnostics.jpg";
import serviceMechanical from "@/assets/service-mechanical.png";

export interface Service {
  slug: string;
  title: string;
  description: string;
  image: string;
  longDescription: string;
  subServices: string[];
}

export const services: Service[] = [
  {
    slug: "car-servicing",
    title: "Car Servicing",
    description: "Scheduled servicing and inspections to keep your vehicle performing at its best.",
    image: serviceOil,
    longDescription:
      "Our car servicing category covers routine maintenance and inspections completed at your location by qualified mobile mechanics.",
    subServices: [
      "Minor Service",
      "Major Service",
      "Oil & Filter Change",
      "Full Service Inspection",
    ],
  },
  {
    slug: "brake-repair",
    title: "Brake Repair",
    description: "Professional brake system repair and replacement for safe stopping performance.",
    image: serviceBrakes,
    longDescription:
      "Our brake repair category focuses on inspections, component replacement, and system servicing to keep your braking reliable.",
    subServices: [
      "Brake Inspection",
      "Brake Pads Replacement",
      "Brake Disc / Rotor Replacement",
      "Brake Caliper Service",
    ],
  },
  {
    slug: "auto-electrical-battery",
    title: "Auto Electrical & Battery",
    description: "Battery and auto electrical diagnostics, testing, and repairs at your location.",
    image: serviceBattery,
    longDescription:
      "Our auto electrical and battery category covers starting, charging, and electrical fault diagnosis with on-site repair support.",
    subServices: [
      "Battery Testing",
      "Battery Replacement",
      "Car Not Starting Inspection",
      "Alternator Checks",
      "Starter Motor Checks",
      "General Auto Electrical Repairs",
    ],
  },
  {
    slug: "diagnostics",
    title: "Diagnostics",
    description: "Accurate inspections and fault detection to identify issues before major repairs.",
    image: serviceDiagnostics,
    longDescription:
      "Our diagnostics category uses professional testing and inspection workflows to identify faults quickly and clearly.",
    subServices: [
      "Dash Warning Light Inspection",
      "Engine Diagnostics",
      "Sound / Noise Inspection",
      "Pre-Purchase Car Inspection",
      "Fault Code Scanning",
    ],
  },
  {
    slug: "mechanical-repairs",
    title: "Mechanical Repairs",
    description: "Clutch, gearbox, bearings, engine overhauls and more.",
    image: serviceMechanical,
    longDescription:
      "Our mechanical repairs category covers major mechanical components and complex repair work completed by experienced technicians.",
    subServices: [
      "Clutch Repairs",
      "Gearbox Repairs",
      "Wheel Bearing Repairs",
      "Engine Overhaul Service",
    ],
  },
];

export const getServiceBySlug = (slug: string): Service | undefined =>
  services.find((s) => s.slug === slug);

export const getServiceSlugs = (): string[] => services.map((s) => s.slug);
