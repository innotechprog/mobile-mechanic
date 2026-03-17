import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Check, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import SEOMeta from "@/components/SEOMeta";
import Footer from "@/components/Footer";
import { getServiceBySlug } from "@/data/services";
import NotFound from "./NotFound";

const ServicePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? getServiceBySlug(slug) : undefined;

  if (!service) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOMeta
        title={service.title}
        description={service.longDescription}
        canonical={`/services/${service.slug}`}
        ogImage={service.image}
        ogImageAlt={`${service.title} - Metro Mobile Mechanics`}
        ogType="article"
      />
      <Navbar />
      <main className="pt-24 pb-16 md:pt-28 md:pb-20">
        <div className="container mx-auto px-4 sm:px-6">
          <Link
            to="/#services"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-body text-sm mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all services
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div className="space-y-6">
              <div className="aspect-video rounded-lg overflow-hidden border border-border">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-muted-foreground font-body text-lg leading-relaxed">
                {service.longDescription}
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <p className="text-primary font-heading tracking-widest uppercase text-sm mb-2">
                  Service
                </p>
                <h1 className="text-4xl md:text-5xl font-heading">
                  <span className="text-gradient">{service.title}</span>
                </h1>
              </div>

              <div>
                <h2 className="text-xl font-heading text-foreground mb-4">
                  Sub-Services
                </h2>
                <ul className="space-y-2">
                  {service.subServices.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-muted-foreground font-body"
                    >
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  to="/#booking"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-heading text-lg uppercase tracking-wider px-8 py-4 rounded-md hover:opacity-90 transition-opacity glow-orange"
                >
                  Book {service.title}
                </Link>
                <a
                  href="tel:+27732696847"
                  className="inline-flex items-center justify-center gap-2 border-2 border-border text-foreground font-heading text-lg uppercase tracking-wider px-8 py-4 rounded-md hover:bg-secondary hover:border-primary/50 transition-all"
                >
                  <Phone className="w-5 h-5" />
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ServicePage;
