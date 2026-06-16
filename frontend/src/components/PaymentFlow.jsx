import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const C = {
  dark: "#2C221A", mid: "#3D3128", sand: "#D4C4B0",
  stone: "#8C7B6B", muted: "#B0A090", border: "#E2D8CE",
  bg: "#F5F0EA", sec: "#F9F6F2", ok: "#4A6645",
};
const f = { font: "'Jost', sans-serif", serif: "'Cormorant Garamond', serif" };

function CheckoutForm({ offer, onClose, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    setError(null);

    const card = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // نجح — روح لـsuccess
    onSuccess();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(44,34,26,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24, backdropFilter: "blur(4px)" }}>
      <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 480, boxShadow: "0 32px 80px rgba(44,34,26,0.25)", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ background: C.dark, padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontFamily: f.serif, fontSize: 22, color: "#fff", fontWeight: 300 }}>Complete Payment</div>
            <div style={{ fontSize: 11, color: "rgba(212,196,176,0.5)", fontWeight: 300 }}>Secure checkout — your information is protected</div>
          </div>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: "50%", border: "0.5px solid rgba(212,196,176,0.25)", background: "transparent", color: "rgba(212,196,176,0.6)", fontSize: 13, cursor: "pointer" }}>✕</button>
        </div>

        {/* Summary */}
        <div style={{ padding: "18px 28px", background: C.sec, borderBottom: `0.5px solid ${C.border}`, display: "flex", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: "0.15em", color: C.muted, textTransform: "uppercase", marginBottom: 4 }}>Order Summary</div>
            <div style={{ fontSize: 13, color: C.dark }}>{offer?.work_type || "Interior Design Service"}</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{offer?.provider_name || "Provider"}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: f.serif, fontSize: 24, color: C.dark }}>{Number(offer?.price || 0).toLocaleString()}</div>
            <div style={{ fontSize: 10, color: C.muted }}>SAR</div>
          </div>
        </div>

        {/* Form */}
        <div style={{ padding: "24px 28px 28px" }}>
          <label style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: C.muted, marginBottom: 8, display: "block" }}>Card Details</label>
          <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", background: C.sec, marginBottom: 16 }}>
            <CardElement options={{ style: { base: { fontSize: "14px", color: C.dark, fontFamily: f.font, "::placeholder": { color: C.muted } } } }} />
          </div>

          {error && <div style={{ fontSize: 11, color: "#B05030", marginBottom: 12 }}>{error}</div>}

          <button onClick={handlePay} disabled={loading} style={{ width: "100%", padding: 14, borderRadius: 12, border: "none", background: C.dark, color: C.sand, fontSize: 12, fontWeight: 500, fontFamily: f.font, letterSpacing: "0.15em", textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Processing..." : `Pay ${Number(offer?.price || 0).toLocaleString()} SAR →`}
          </button>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 12 }}>
            <span style={{ fontSize: 10, color: C.muted }}>🔒 256-bit SSL encrypted · Powered by Stripe</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentSuccess({ offer, onDone }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 1000, fontFamily: f.font, padding: 24 }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(74,102,69,0.1)", border: "1.5px solid rgba(74,102,69,0.25)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28 }}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M6 16l7 7 13-13" stroke={C.ok} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div style={{ textAlign: "center", maxWidth: 400 }}>
        <div style={{ fontFamily: f.serif, fontSize: 32, fontWeight: 300, color: C.dark, marginBottom: 10 }}>Payment Confirmed</div>
        <div style={{ fontSize: 13, color: C.muted, marginBottom: 32 }}>Thank you for using Swagne. Your project is now active.</div>
        <button onClick={onDone} style={{ width: "100%", padding: 14, borderRadius: 12, border: "none", background: C.dark, color: C.sand, fontSize: 11.5, fontWeight: 500, fontFamily: f.font, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>
          Back to My Requests
        </button>
      </div>
    </div>
  );
}

export default function PaymentFlow({ offer, onClose, onComplete }) {
  const [success, setSuccess] = useState(false);

  if (success) return <PaymentSuccess offer={offer} onDone={onComplete} />;

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm offer={offer} onClose={onClose} onSuccess={() => setSuccess(true)} />
    </Elements>
  );
}
