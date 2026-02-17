import { useState } from "react";
import { toast } from "sonner";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 35 }, (_, i) => currentYear - i);

const serviceOptions = [
  "Oil Change",
  "Brake Repair",
  "Battery Service",
  "Engine Diagnostics",
  "Tire Service",
  "Tune-Up",
  "AC / Heating",
  "Electrical Repair",
  "Other",
];

const BookingForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    carYear: "",
    carMake: "",
    carModel: "",
    carMileage: "",
    vin: "",
    serviceType: "",
    preferredDate: "",
    preferredTime: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Booking request submitted! We'll contact you shortly.");
    setFormData({
      firstName: "", lastName: "", email: "", phone: "", address: "",
      city: "", zipCode: "", carYear: "", carMake: "", carModel: "",
      carMileage: "", vin: "", serviceType: "", preferredDate: "",
      preferredTime: "", description: "",
    });
  };

  const inputClass =
    "w-full bg-secondary border border-border rounded-md px-4 py-3 text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors";
  const labelClass = "block text-sm font-heading uppercase tracking-wider text-muted-foreground mb-1";

  return (
    <section id="booking" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-primary font-heading tracking-widest uppercase text-sm mb-2">
            Schedule Now
          </p>
          <h2 className="text-4xl md:text-5xl font-heading">
            Book Your <span className="text-gradient">Service</span>
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto bg-card border border-border rounded-xl p-6 md:p-10 space-y-8"
        >
          {/* Customer Information */}
          <div>
            <h3 className="text-xl font-heading text-primary mb-4 border-b border-border pb-2">
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>First Name *</label>
                <input name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="John" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Last Name *</label>
                <input name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Doe" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Email *</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="john@email.com" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Phone *</label>
                <input name="phone" type="tel" value={formData.phone} onChange={handleChange} required placeholder="(555) 123-4567" className={inputClass} />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Service Address *</label>
                <input name="address" value={formData.address} onChange={handleChange} required placeholder="123 Main St" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>City *</label>
                <input name="city" value={formData.city} onChange={handleChange} required placeholder="Metro City" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Zip Code *</label>
                <input name="zipCode" value={formData.zipCode} onChange={handleChange} required placeholder="12345" className={inputClass} />
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div>
            <h3 className="text-xl font-heading text-primary mb-4 border-b border-border pb-2">
              Vehicle Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Year *</label>
                <select name="carYear" value={formData.carYear} onChange={handleChange} required className={inputClass}>
                  <option value="">Select Year</option>
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Make *</label>
                <input name="carMake" value={formData.carMake} onChange={handleChange} required placeholder="Toyota" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Model *</label>
                <input name="carModel" value={formData.carModel} onChange={handleChange} required placeholder="Camry" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Mileage</label>
                <input name="carMileage" value={formData.carMileage} onChange={handleChange} placeholder="75,000" className={inputClass} />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>VIN (Optional)</label>
                <input name="vin" value={formData.vin} onChange={handleChange} placeholder="Vehicle Identification Number" className={inputClass} />
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div>
            <h3 className="text-xl font-heading text-primary mb-4 border-b border-border pb-2">
              Service Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Service Type *</label>
                <select name="serviceType" value={formData.serviceType} onChange={handleChange} required className={inputClass}>
                  <option value="">Select Service</option>
                  {serviceOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Preferred Date *</label>
                <input name="preferredDate" type="date" value={formData.preferredDate} onChange={handleChange} required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Preferred Time</label>
                <input name="preferredTime" type="time" value={formData.preferredTime} onChange={handleChange} className={inputClass} />
              </div>
              <div className="md:col-span-3">
                <label className={labelClass}>Describe the Issue</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us what's going on with your vehicle..."
                  className={inputClass + " resize-none"}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground font-heading text-lg uppercase tracking-wider py-4 rounded-md hover:opacity-90 transition-opacity glow-orange"
          >
            Submit Booking Request
          </button>
        </form>
      </div>
    </section>
  );
};

export default BookingForm;
