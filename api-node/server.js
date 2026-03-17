import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
const PORT = Number(process.env.BOOKING_API_PORT || 3001);

const allowedOrigins = [
  "https://metromobilemechanics.co.za",
  "https://www.metromobilemechanics.co.za",
];

const localhostOriginRegex = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;

const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  return allowedOrigins.includes(origin) || localhostOriginRegex.test(origin);
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      // Return no CORS headers for disallowed origins instead of throwing 500.
      callback(null, false);
    },
    methods: ["POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json({ limit: "1mb" }));

const requiredFields = ["firstName", "lastName", "email", "phone", "serviceType", "preferredDate"];
const BUSINESS_CELLPHONE = "+27 73 269 6847";

const getConfig = () => {
  const host = process.env.EMAIL_HOST || "";
  const port = Number(process.env.EMAIL_PORT || 587);
  const user = process.env.EMAIL_USER || "";
  const pass = process.env.EMAIL_PASSWORD || "";
  const encryption = (process.env.EMAIL_ENCRYPTION || "tls").toLowerCase();

  return {
    host,
    port,
    user,
    pass,
    encryption,
    secure: encryption === "ssl" || port === 465,
    fromEmail: process.env.FROM_EMAIL || user,
    fromName: process.env.FROM_NAME || "Metro Mobile Mechanics",
    bookingToEmail: process.env.BOOKING_TO_EMAIL || "bookings@metromobilemechanics.co.za",
    bookingToName: process.env.BOOKING_TO_NAME || "Metro Mobile Mechanics - Bookings",
    appDebug: process.env.APP_DEBUG === "1",
  };
};

const esc = (value, fallback = "") => {
  const str = `${value ?? fallback}`;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const buildHtml = (payload) => {
  const firstName = esc(payload.firstName);
  const lastName = esc(payload.lastName);
  const customerEmail = esc(payload.email);
  const phone = esc(payload.phone);
  const address = esc(payload.address);
  const city = esc(payload.city);
  const zipCode = esc(payload.zipCode);
  const carYear = esc(payload.carYear);
  const carMake = esc(payload.carMake);
  const carModel = esc(payload.carModel);
  const carMileage = esc(payload.carMileage, "Not specified");
  const vin = esc(payload.vin, "Not provided");
  const serviceType = esc(payload.serviceType);
  const preferredDate = esc(payload.preferredDate);
  const preferredTime = esc(payload.preferredTime, "Not specified");
  const description = esc(payload.description, "No additional details provided.");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; background:#f4f4f4; margin:0; padding:0; }
    .wrapper { max-width:640px; margin:30px auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,.12); }
    .header { background:#1a1a1a; padding:28px 32px; text-align:center; }
    .header h1 { color:#f97316; margin:0; font-size:22px; letter-spacing:1px; text-transform:uppercase; }
    .header p  { color:#9ca3af; margin:6px 0 0; font-size:13px; }
    .content { padding:28px 32px; }
    .section-title { font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#f97316; border-bottom:1px solid #e5e7eb; padding-bottom:6px; margin:24px 0 12px; }
    table { width:100%; border-collapse:collapse; font-size:14px; }
    td { padding:8px 0; vertical-align:top; }
    td:first-child { color:#6b7280; width:45%; padding-right:12px; }
    td:last-child { color:#111827; font-weight:500; }
    .footer { background:#f9fafb; text-align:center; padding:16px 32px; font-size:12px; color:#9ca3af; border-top:1px solid #e5e7eb; }
  </style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>Metro Mobile Mechanics</h1>
    <p>New Booking Request</p>
  </div>
  <div class="content">
    <div class="section-title">Customer Information</div>
    <table>
      <tr><td>Full Name</td><td>${firstName} ${lastName}</td></tr>
      <tr><td>Email</td><td><a href="mailto:${customerEmail}" style="color:#f97316">${customerEmail}</a></td></tr>
      <tr><td>Phone</td><td>${phone}</td></tr>
      <tr><td>Address</td><td>${address}, ${city} ${zipCode}</td></tr>
    </table>

    <div class="section-title">Vehicle Information</div>
    <table>
      <tr><td>Year</td><td>${carYear}</td></tr>
      <tr><td>Make</td><td>${carMake}</td></tr>
      <tr><td>Model</td><td>${carModel}</td></tr>
      <tr><td>Mileage</td><td>${carMileage}</td></tr>
      <tr><td>VIN</td><td>${vin}</td></tr>
    </table>

    <div class="section-title">Service Request</div>
    <table>
      <tr><td>Service Type</td><td>${serviceType}</td></tr>
      <tr><td>Preferred Date</td><td>${preferredDate}</td></tr>
      <tr><td>Preferred Time</td><td>${preferredTime}</td></tr>
    </table>

    <div class="section-title">Additional Details</div>
    <p style="font-size:14px;color:#374151;margin:0">${description}</p>
  </div>
  <div class="footer">
    This email was automatically generated from the booking form on metromobilemechanics.co.za.<br>
    Reply directly to this message to respond to the customer.
  </div>
</div>
</body>
</html>`;
};

const buildCustomerConfirmationHtml = (payload) => {
  const firstName = esc(payload.firstName, "there");
  const serviceType = esc(payload.serviceType);
  const preferredDate = esc(payload.preferredDate);
  const preferredTime = esc(payload.preferredTime, "Not specified");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; background:#f4f4f4; margin:0; padding:0; }
    .wrapper { max-width:640px; margin:30px auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,.12); }
    .header { background:#1a1a1a; padding:28px 32px; text-align:center; }
    .header h1 { color:#f97316; margin:0; font-size:22px; letter-spacing:1px; text-transform:uppercase; }
    .header p  { color:#9ca3af; margin:6px 0 0; font-size:13px; }
    .content { padding:28px 32px; color:#374151; }
    .highlight { color:#f97316; font-weight:700; }
    .box { margin-top:18px; border:1px solid #e5e7eb; border-radius:8px; padding:14px; background:#f9fafb; }
    .footer { background:#f9fafb; text-align:center; padding:16px 32px; font-size:12px; color:#9ca3af; border-top:1px solid #e5e7eb; }
  </style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>Metro Mobile Mechanics</h1>
    <p>Booking Confirmation</p>
  </div>
  <div class="content">
    <p>Hi ${firstName},</p>
    <p>Thank you for your booking request. We have received your request for <span class="highlight">${serviceType}</span>.</p>
    <div class="box">
      <p style="margin:0 0 6px 0;"><strong>Preferred Date:</strong> ${preferredDate}</p>
      <p style="margin:0;"><strong>Preferred Time:</strong> ${preferredTime}</p>
    </div>
    <p style="margin-top:18px;">Our team will review your request and send you a <span class="highlight">quote shortly</span>.</p>
    <p>If anything is urgent, please call or WhatsApp us.</p>
    <p style="margin:0;"><strong>Cellphone:</strong> ${BUSINESS_CELLPHONE}</p>
    <p style="margin-top:18px;">Warm regards,<br><strong>Metro Mobile Mechanics Team</strong></p>
  </div>
  <div class="footer">
    Metro Mobile Mechanics<br>
    bookings@metromobilemechanics.co.za<br>
    ${BUSINESS_CELLPHONE}
  </div>
</div>
</body>
</html>`;
};

app.post("/api/send-booking", async (req, res) => {
  const payload = req.body || {};
  const requestOrigin = req.headers.origin || "";
  const requestHost = req.headers.host || "";
  const isLocalRequest =
    requestOrigin.includes("localhost") ||
    requestOrigin.includes("127.0.0.1") ||
    requestHost.includes("localhost") ||
    requestHost.includes("127.0.0.1");

  for (const field of requiredFields) {
    if (!payload[field]) {
      res.status(422).json({ success: false, message: `Missing required field: ${field}` });
      return;
    }
  }

  const customerEmail = `${payload.email || ""}`.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(customerEmail)) {
    res.status(422).json({ success: false, message: "Invalid customer email address." });
    return;
  }

  const preferredDate = `${payload.preferredDate || ""}`.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)) {
    res.status(422).json({ success: false, message: "Invalid preferred date format." });
    return;
  }

  const requestedDate = new Date(`${preferredDate}T00:00:00`);
  if (Number.isNaN(requestedDate.getTime())) {
    res.status(422).json({ success: false, message: "Invalid preferred date." });
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (requestedDate < today) {
    res.status(422).json({ success: false, message: "Preferred date cannot be in the past." });
    return;
  }

  const cfg = getConfig();
  if (!cfg.host || !cfg.user || !cfg.pass) {
    res.status(500).json({
      success: false,
      message: "SMTP is not configured. Set EMAIL_HOST, EMAIL_USER and EMAIL_PASSWORD.",
    });
    return;
  }

  const transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: {
      user: cfg.user,
      pass: cfg.pass,
    },
  });

  const fullName = `${payload.firstName} ${payload.lastName}`.trim();

  try {
    await transporter.sendMail({
      from: `"${cfg.fromName}" <${cfg.fromEmail}>`,
      to: `"${cfg.bookingToName}" <${cfg.bookingToEmail}>`,
      replyTo: `"${fullName}" <${customerEmail}>`,
      subject: `New Booking: ${payload.serviceType} - ${fullName}`,
      html: buildHtml(payload),
      text: [
        `New booking from ${fullName}`,
        `Email: ${customerEmail}`,
        `Phone: ${payload.phone}`,
        `Service: ${payload.serviceType}`,
        `Date: ${payload.preferredDate}`,
        `Vehicle: ${payload.carYear || ""} ${payload.carMake || ""} ${payload.carModel || ""}`.trim(),
        `Details: ${payload.description || "No additional details provided."}`,
      ].join("\n"),
    });

    await transporter.sendMail({
      from: `"${cfg.fromName}" <${cfg.fromEmail}>`,
      to: customerEmail,
      subject: "Booking Received - Quote to Follow | Metro Mobile Mechanics",
      html: buildCustomerConfirmationHtml(payload),
      text: [
        `Hi ${payload.firstName || "there"},`,
        "",
        "Thank you for your booking request.",
        `Service: ${payload.serviceType}`,
        `Preferred Date: ${payload.preferredDate}`,
        `Preferred Time: ${payload.preferredTime || "Not specified"}`,
        "",
        "We have received your request and a quote will be sent to you shortly.",
        "If urgent, please call or WhatsApp us.",
        `Cellphone: ${BUSINESS_CELLPHONE}`,
        "",
        "Warm regards,",
        "Metro Mobile Mechanics Team",
      ].join("\n"),
    });

    res.status(200).json({ success: true, message: "Booking and confirmation emails sent successfully." });
  } catch (error) {
    const err = error instanceof Error ? error.message : "Email could not be sent.";
    const exposeError = cfg.appDebug || isLocalRequest;
    res.status(500).json({
      success: false,
      message: exposeError ? err : "Email could not be sent.",
      ...(exposeError ? { debug: err } : {}),
    });
  }
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Booking API listening on http://localhost:${PORT}`);
});
