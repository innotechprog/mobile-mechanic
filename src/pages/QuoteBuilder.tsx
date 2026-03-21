import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOMeta from "@/components/SEOMeta";

type BookingPrefill = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  carYear: string;
  carMake: string;
  carModel: string;
  carMileage: string;
  vin: string;
  serviceType: string;
  preferredDate: string;
  preferredTime: string;
  description: string;
};

type QuoteLineItem = {
  id: string;
  label: string;
  qty: string;
  unitPrice: string;
};

const envQuoteTokenApi = import.meta.env.VITE_QUOTE_TOKEN_API_URL as string | undefined;

const normalizePath = (path: string) => path.replace(/\/+/g, "/").replace(/\/$/, "");

const getQuoteTokenApiCandidates = () => {
  const candidates: string[] = [];

  if (envQuoteTokenApi && envQuoteTokenApi.trim()) {
    candidates.push(envQuoteTokenApi.trim());
  }

  const base = normalizePath(import.meta.env.BASE_URL || "/");
  const basePath = base === "" ? "" : base;
  candidates.push(`${basePath}/api/quote-token.php`.replace(/\/+/g, "/"));
  candidates.push("/api/quote-token.php");
  candidates.push(`${basePath}/quote-token.php`.replace(/\/+/g, "/"));
  candidates.push("/quote-token.php");
  candidates.push(`${basePath}/api/quote-token`.replace(/\/+/g, "/"));
  candidates.push("/api/quote-token");

  return [...new Set(candidates)];
};

const createLineItem = (): QuoteLineItem => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  label: "",
  qty: "1",
  unitPrice: "",
});

const parseMoney = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const QuoteBuilder = () => {
  const [params] = useSearchParams();
  const token = params.get("token") || "";

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [booking, setBooking] = useState<BookingPrefill | null>(null);
  const [lineItems, setLineItems] = useState<QuoteLineItem[]>([createLineItem()]);
  const [taxPercent, setTaxPercent] = useState("15");
  const [calloutFee, setCalloutFee] = useState("");
  const [laborHours, setLaborHours] = useState("");
  const [laborRate, setLaborRate] = useState("");
  const [extraNotes, setExtraNotes] = useState("");
  const [validUntil, setValidUntil] = useState("");

  useEffect(() => {
    let active = true;

    const resolveToken = async () => {
      if (!token) {
        if (active) {
          setIsLoading(false);
          setErrorMessage("Missing quote token. Open the quote link from your booking email.");
        }
        return;
      }

      const endpoints = getQuoteTokenApiCandidates();
      let lastError = "Could not verify quote link.";
      let resolvedPayload: BookingPrefill | null = null;

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          });

          const rawText = await response.text();
          let parsed: { success?: boolean; message?: string; booking?: BookingPrefill } | null = null;

          try {
            parsed = rawText ? JSON.parse(rawText) : null;
          } catch {
            parsed = null;
          }

          if (!response.ok || !parsed?.success || !parsed.booking) {
            lastError = parsed?.message || `Request failed (${response.status})`;
            continue;
          }

          resolvedPayload = parsed.booking;
          break;
        } catch {
          lastError = `Could not reach quote endpoint: ${endpoint}`;
        }
      }

      if (!active) {
        return;
      }

      setIsLoading(false);
      if (!resolvedPayload) {
        setErrorMessage(lastError);
        return;
      }

      setBooking(resolvedPayload);
      setErrorMessage("");
    };

    resolveToken();

    return () => {
      active = false;
    };
  }, [token]);

  const totals = useMemo(() => {
    const itemsSubtotal = lineItems.reduce((sum, item) => {
      const qty = parseMoney(item.qty);
      const unitPrice = parseMoney(item.unitPrice);
      return sum + qty * unitPrice;
    }, 0);

    const laborTotal = parseMoney(laborHours) * parseMoney(laborRate);
    const baseSubtotal = itemsSubtotal + laborTotal + parseMoney(calloutFee);
    const taxAmount = (baseSubtotal * parseMoney(taxPercent)) / 100;
    const grandTotal = baseSubtotal + taxAmount;

    return {
      itemsSubtotal,
      laborTotal,
      baseSubtotal,
      taxAmount,
      grandTotal,
    };
  }, [lineItems, laborHours, laborRate, calloutFee, taxPercent]);

  const inputClass =
    "w-full bg-secondary border border-border rounded-md px-4 py-3 text-foreground placeholder:text-muted-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors";
  const labelClass = "block text-sm font-heading uppercase tracking-wider text-muted-foreground mb-1";

  const updateLineItem = (id: string, field: keyof QuoteLineItem, value: string) => {
    setLineItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const removeLineItem = (id: string) => {
    setLineItems((prev) => {
      if (prev.length === 1) {
        return prev;
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOMeta
        title="Generate Quote"
        description="Internal quote generation workspace for booking requests."
        canonical="/quote"
      />
      <Navbar />
      <main className="pt-24 pb-16 md:pt-28 md:pb-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-body text-sm mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div className="space-y-6">
            <div>
              <p className="text-primary font-heading tracking-widest uppercase text-sm mb-2">Quote Workspace</p>
              <h1 className="text-4xl md:text-5xl font-heading">
                Generate <span className="text-gradient">Client Quote</span>
              </h1>
              <p className="text-muted-foreground font-body mt-3">
                Review the request details below, then add pricing, labor, and line-item breakdown.
              </p>
            </div>

            {isLoading && (
              <div className="rounded-lg border border-border bg-card px-4 py-5 text-muted-foreground font-body">
                Loading quote request...
              </div>
            )}

            {!isLoading && errorMessage && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-5">
                <p className="font-heading uppercase tracking-wider text-sm text-destructive">Quote link unavailable</p>
                <p className="text-sm text-muted-foreground mt-1">{errorMessage}</p>
              </div>
            )}

            {!isLoading && booking && (
              <div className="space-y-8">
                <section className="bg-card border border-border rounded-xl p-6 md:p-8">
                  <h2 className="text-xl font-heading text-primary mb-4 border-b border-border pb-2">Client Request</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-body">
                    <div>
                      <p className="text-muted-foreground">Full Name</p>
                      <p className="text-foreground">{booking.firstName} {booking.lastName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <p className="text-foreground">{booking.email}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p className="text-foreground">{booking.phone}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Address</p>
                      <p className="text-foreground">{booking.address}, {booking.city} {booking.zipCode}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Vehicle</p>
                      <p className="text-foreground">{booking.carYear} {booking.carMake} {booking.carModel}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Mileage / VIN</p>
                      <p className="text-foreground">{booking.carMileage || "Not specified"} / {booking.vin || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Service Type</p>
                      <p className="text-foreground">{booking.serviceType}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Preferred Date / Time</p>
                      <p className="text-foreground">{booking.preferredDate} / {booking.preferredTime || "Not specified"}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-muted-foreground">Issue Description</p>
                      <p className="text-foreground">{booking.description || "No additional details provided."}</p>
                    </div>
                  </div>
                </section>

                <section className="bg-card border border-border rounded-xl p-6 md:p-8 space-y-6">
                  <h2 className="text-xl font-heading text-primary mb-2 border-b border-border pb-2">Quote Breakdown</h2>

                  <div className="space-y-3">
                    {lineItems.map((item, index) => (
                      <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end border border-border rounded-lg p-3">
                        <div className="md:col-span-6">
                          <label className={labelClass}>Item {index + 1}</label>
                          <input
                            value={item.label}
                            onChange={(e) => updateLineItem(item.id, "label", e.target.value)}
                            placeholder="Part or service item"
                            className={inputClass}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className={labelClass}>Qty</label>
                          <input
                            value={item.qty}
                            onChange={(e) => updateLineItem(item.id, "qty", e.target.value)}
                            placeholder="1"
                            className={inputClass}
                          />
                        </div>
                        <div className="md:col-span-3">
                          <label className={labelClass}>Unit Price (ZAR)</label>
                          <input
                            value={item.unitPrice}
                            onChange={(e) => updateLineItem(item.id, "unitPrice", e.target.value)}
                            placeholder="0.00"
                            className={inputClass}
                          />
                        </div>
                        <div className="md:col-span-1">
                          <button
                            type="button"
                            onClick={() => removeLineItem(item.id)}
                            disabled={lineItems.length === 1}
                            className="w-full inline-flex items-center justify-center rounded-md border border-border py-3 text-muted-foreground hover:text-destructive disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Remove line item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => setLineItems((prev) => [...prev, createLineItem()])}
                      className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-heading uppercase tracking-wider hover:border-primary/60"
                    >
                      <Plus className="w-4 h-4" />
                      Add Line Item
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Callout Fee (ZAR)</label>
                      <input
                        value={calloutFee}
                        onChange={(e) => setCalloutFee(e.target.value)}
                        placeholder="0.00"
                        className={inputClass}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Labor Hours</label>
                        <input
                          value={laborHours}
                          onChange={(e) => setLaborHours(e.target.value)}
                          placeholder="0"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Labor Rate (ZAR)</label>
                        <input
                          value={laborRate}
                          onChange={(e) => setLaborRate(e.target.value)}
                          placeholder="0.00"
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Tax %</label>
                      <input
                        value={taxPercent}
                        onChange={(e) => setTaxPercent(e.target.value)}
                        placeholder="15"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Quote Valid Until</label>
                      <input
                        type="date"
                        value={validUntil}
                        onChange={(e) => setValidUntil(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Internal Notes / Scope Breakdown</label>
                    <textarea
                      value={extraNotes}
                      onChange={(e) => setExtraNotes(e.target.value)}
                      rows={4}
                      placeholder="Add diagnostics findings, parts notes, exclusions, and assumptions..."
                      className={inputClass + " resize-none"}
                    />
                  </div>
                </section>

                <section className="bg-card border border-border rounded-xl p-6 md:p-8">
                  <h2 className="text-xl font-heading text-primary mb-4 border-b border-border pb-2">Totals</h2>
                  <div className="space-y-2 font-body text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Parts / Line Items</span>
                      <span className="text-foreground">R {totals.itemsSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Labor</span>
                      <span className="text-foreground">R {totals.laborTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground">R {totals.baseSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="text-foreground">R {totals.taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-border pt-2 mt-2 flex items-center justify-between text-base">
                      <span className="font-heading uppercase tracking-wider">Grand Total</span>
                      <span className="font-heading text-primary">R {totals.grandTotal.toFixed(2)}</span>
                    </div>
                    {validUntil && (
                      <p className="text-muted-foreground text-xs mt-3">Quote valid until: {validUntil}</p>
                    )}
                    {extraNotes && (
                      <p className="text-muted-foreground text-xs mt-2">Notes captured for follow-up.</p>
                    )}
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QuoteBuilder;
