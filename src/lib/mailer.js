import nodemailer from "nodemailer";

// Escape user-supplied text before embedding it in HTML emails.
const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

let transporter = null;

// Built lazily so missing env vars produce a clear error instead of a silent failure.
function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = (process.env.GMAIL_APP_PASSWORD || "").replace(/\s/g, "");
  if (!user || !pass) {
    throw new Error("Gmail not configured — set GMAIL_USER and GMAIL_APP_PASSWORD in .env");
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass },
    });
  }
  return transporter;
}

const adminEmail = () => process.env.ADMIN_EMAIL || process.env.GMAIL_USER;
// Public business address — replies from customers land here.
const businessEmail = () => process.env.BUSINESS_EMAIL || "orders@cannabislap.com";
const fromAddress = () => `"CannabisLap" <${process.env.GMAIL_USER}>`;

// Shared branded shell for all outgoing mail (table-safe inline styles).
const emailShell = (title, subtitle, bodyHtml) => `
  <div style="font-family: Arial, Helvetica, sans-serif; background: #f6f1e7; padding: 32px 16px;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #f3e2cf;">
      <div style="background: #a3470d; padding: 26px 32px;">
        <p style="margin: 0; color: #fccb8e; font-size: 11px; letter-spacing: 3px; text-transform: uppercase;">CannabisLap</p>
        <h1 style="margin: 6px 0 0; color: #fdf4ea; font-size: 22px; font-weight: bold;">${title}</h1>
        ${subtitle ? `<p style="margin: 6px 0 0; color: rgba(253,244,234,0.7); font-size: 13px;">${subtitle}</p>` : ""}
      </div>
      <div style="padding: 26px 32px;">
        ${bodyHtml}
      </div>
      <div style="background: #fdf4ea; border-top: 1px solid #f3e2cf; padding: 14px 32px;">
        <p style="margin: 0; color: #9a6a45; font-size: 11px; text-align: center;">cannabislap.com — premium cannabis flower</p>
      </div>
    </div>
  </div>
`;

// Labelled field row used inside the shell.
const field = (label, value) => `
  <p style="color: #d15f0e; font-size: 11px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin: 18px 0 4px;">${label}</p>
  <p style="color: #2b2b26; font-size: 15px; margin: 0;">${value}</p>
`;

export async function sendContactNotification({ name, email, phone, subject, message }) {
  const html = emailShell(
    "New contact message",
    `Sent via the contact form`,
    `
    ${field("From", `${esc(name)} &lt;${esc(email)}&gt;`)}
    ${phone ? field("Phone", esc(phone)) : ""}
    ${field("Subject", esc(subject) || "General Inquiry")}
    ${field("Message", `<span style="white-space: pre-wrap;">${esc(message)}</span>`)}
    <div style="margin-top: 24px; padding: 14px 18px; background: #fdf4ea; border-left: 3px solid #ff9d2e; border-radius: 8px;">
      <p style="margin: 0; color: #7c5230; font-size: 12px;">Reply directly to this email to respond to ${esc(name)}.</p>
    </div>
    `
  );

  try {
    await getTransporter().sendMail({
      from: fromAddress(),
      to: adminEmail(),
      replyTo: email,
      subject: `Contact: ${subject || "General Inquiry"} — from ${name}`,
      html,
    });
    console.log(`Contact notification sent for ${name}`);
  } catch (err) {
    console.error("Failed to send contact email:", err.message);
    throw err;
  }
}

export const PAYMENT_LABELS = { bitcoin: "Bitcoin (BTC)", cashapp: "Cash App", zelle: "Zelle", applepay: "Apple Pay" };

export async function sendOrderNotification(orderDoc) {
  const order = orderDoc?.toObject ? orderDoc.toObject() : orderDoc;
  const { orderId, productName, size, price, customerName, customerEmail, customerPhone, shippingAddress, message, paymentMethod } = order;
  const total = typeof price === "number" ? `$${price.toFixed(2)}` : `$${price}`;

  const html = emailShell(
    "New order received",
    `${orderId}`,
    `
    <div style="background: #fdf4ea; border: 1px solid #f3e2cf; border-radius: 12px; padding: 16px 20px;">
      <p style="color: #d15f0e; font-size: 11px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 4px;">Product</p>
      <p style="color: #2b2b26; font-size: 15px; margin: 0;">${esc(productName)} — ${esc(size)}</p>
      <p style="color: #a3470d; font-size: 26px; font-weight: bold; margin: 10px 0 0;">${total}</p>
    </div>
    ${field("Customer", esc(customerName))}
    ${field("Email", esc(customerEmail))}
    ${customerPhone ? field("Phone / WhatsApp", esc(customerPhone)) : ""}
    ${field("Shipping address", esc(shippingAddress))}
    ${field("Payment method", esc(PAYMENT_LABELS[paymentMethod] || "Bitcoin (BTC)"))}
    ${message ? field("Customer note", `<span style="white-space: pre-wrap;">${esc(message)}</span>`) : ""}
    <div style="margin-top: 24px; padding: 14px 18px; background: #fdf4ea; border-left: 3px solid #ff9d2e; border-radius: 8px;">
      <p style="margin: 0; color: #7c5230; font-size: 12px;">Reply directly to this email to reach the customer with their ${esc(PAYMENT_LABELS[paymentMethod] || "Bitcoin (BTC)")} payment details.</p>
    </div>
    `
  );

  try {
    await getTransporter().sendMail({
      from: fromAddress(),
      to: adminEmail(),
      replyTo: customerEmail,
      subject: `New Order ${orderId} — ${productName} (${typeof price === 'number' ? price.toFixed(2) : price})`,
      html,
    });
    console.log(`Order notification sent for ${orderId}`);
  } catch (err) {
    console.error("Failed to send order email:", err.message);
    throw err;
  }
}

// Confirmation email to the customer — includes BTC payment instructions.
export async function sendOrderConfirmation(orderDoc) {
  const order = orderDoc?.toObject ? orderDoc.toObject() : orderDoc;
  const { orderId, productName, size, price, customerName, customerEmail, paymentMethod } = order;
  const total = typeof price === "number" ? `$${price.toFixed(2)}` : `$${price}`;
  const wallet = process.env.BTC_WALLET || "";
  const methodLabel = PAYMENT_LABELS[paymentMethod] || "Bitcoin (BTC)";

  const html = emailShell(
    "Order confirmed",
    `${orderId} — thank you for your order`,
    `
    <p style="color: #2b2b26; font-size: 15px; margin: 0;">Hi ${esc(customerName)},</p>
    <p style="color: #55504a; font-size: 14px; line-height: 1.6; margin: 10px 0 0;">Thanks for your order! Here is your summary — your chosen payment method is <strong>${esc(methodLabel)}</strong>.</p>

    <div style="background: #fdf4ea; border: 1px solid #f3e2cf; border-radius: 12px; padding: 16px 20px; margin-top: 18px;">
      <p style="color: #d15f0e; font-size: 11px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 4px;">Your order</p>
      <p style="color: #2b2b26; font-size: 15px; margin: 0;">${esc(productName)} — ${esc(size)}</p>
      <p style="color: #a3470d; font-size: 26px; font-weight: bold; margin: 10px 0 0;">${total}</p>
    </div>

    <div style="margin-top: 20px; padding: 16px 18px; border: 1px solid #ff9d2e; border-radius: 12px; background: #fffdf7;">
      <p style="color: #a3470d; font-size: 13px; font-weight: bold; margin: 0 0 8px;">Payment — ${esc(methodLabel)}</p>
      ${paymentMethod === "bitcoin" && wallet
        ? `<p style="color: #55504a; font-size: 13px; margin: 0 0 10px;">Send the BTC equivalent of <strong>${total}</strong> to:</p>
           <p style="background: #fdf4ea; border: 1px solid #f3e2cf; border-radius: 8px; padding: 12px; font-family: monospace; font-size: 13px; word-break: break-all; margin: 0 0 10px;">${esc(wallet)}</p>
           <p style="color: #55504a; font-size: 13px; margin: 0;">After sending, reply to this email with your transaction ID so we can confirm and ship your order.</p>`
        : `<p style="color: #55504a; font-size: 13px; margin: 0;">We will reply shortly with the ${esc(methodLabel)} payment details for <strong>${total}</strong>. We also accept Bitcoin, Cash App, Zelle and Apple Pay — just let us know if you'd like to switch.</p>`}
    </div>

    <p style="color: #55504a; font-size: 13px; margin: 22px 0 0;">Questions? Reply to this email or message us on WhatsApp <strong>+1 (479) 480-0596</strong>.</p>
    `
  );

  try {
    await getTransporter().sendMail({
      from: fromAddress(),
      to: customerEmail,
      replyTo: businessEmail(),
      subject: `Your CannabisLap order ${orderId} — payment instructions`,
      html,
    });
    console.log(`Order confirmation sent to ${customerEmail} for ${orderId}`);
  } catch (err) {
    console.error("Failed to send order confirmation:", err.message);
    throw err;
  }
}
