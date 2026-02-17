import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOMeta from "@/components/SEOMeta";

const BookingPolicy = () => {
  const sections = [
    {
      title: "Scheduling & Appointments",
      content: [
        "Appointments can be booked online, by phone, or via WhatsApp. We offer same-day and next-day availability when possible.",
        "Once your booking is confirmed, we will contact you to confirm the time slot and location. Please ensure your vehicle is accessible at the agreed time.",
        "We operate 7 days a week across the metro area. Appointment times are subject to availability and travel distance.",
      ],
    },
    {
      title: "Cancellation & Rescheduling",
      content: [
        "We understand plans change. Please provide at least 4 hours notice if you need to cancel or reschedule your appointment.",
        "Cancellations with less than 4 hours notice may be subject to a cancellation fee.",
        "To cancel or reschedule, please call us, send a WhatsApp message, or reply to your booking confirmation.",
      ],
    },
    {
      title: "Pricing & Payment",
      content: [
        "You will receive an upfront quote before any work begins. We do not start repairs without your approval.",
        "Payment is due upon completion of the service. We accept cash, card, and electronic payments.",
        "Prices may be adjusted if additional issues are discovered during the service. We will always communicate and obtain your approval before proceeding.",
      ],
    },
    {
      title: "Parts & Warranty",
      content: [
        "We use OEM and quality aftermarket parts. Parts are covered by manufacturer warranty where applicable.",
        "Labour is covered by our service warranty. Specific terms will be provided at the time of service.",
        "If you prefer to supply your own parts, please discuss this with us when booking. Some warranties may not apply.",
      ],
    },
    {
      title: "Service Location",
      content: [
        "We come to your home, office, or other agreed location within our service area.",
        "Please ensure the vehicle is parked on flat, solid ground (e.g. driveway or parking lot) with adequate space for our technician to work safely.",
        "For certain services, access to power may be required. We will let you know in advance if this applies.",
      ],
    },
    {
      title: "Contact",
      content: [
        "Questions about our booking policy? Call us at 076 253 8318 or email info@metromobilemechanic.com. We're here to help.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOMeta
        title="Booking Policy"
        description="Read our booking, cancellation, payment, and service policies. Metro Mobile Mechanic — transparent and hassle-free mobile auto repair."
        canonical="/booking-policy"
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
                Policies
              </p>
              <h1 className="text-4xl md:text-5xl font-heading">
                <span className="text-gradient">Booking Policy</span>
              </h1>
            </div>

            <div className="space-y-10">
              {sections.map(({ title, content }) => (
                <div key={title}>
                  <h2 className="text-xl font-heading text-foreground mb-4">{title}</h2>
                  <ul className="space-y-3">
                    {content.map((paragraph, i) => (
                      <li
                        key={i}
                        className="text-muted-foreground font-body leading-relaxed pl-4 border-l-2 border-primary/30"
                      >
                        {paragraph}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-8">
              <p className="text-muted-foreground font-body">
                Ready to book?{" "}
                <Link to="/#booking" className="text-primary hover:underline font-medium">
                  Schedule your service
                </Link>
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

export default BookingPolicy;
