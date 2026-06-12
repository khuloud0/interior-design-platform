import { useState } from "react";

const C = {
  dark: "#2C221A", mid: "#3D3128", sand: "#D4C4B0",
  stone: "#8C7B6B", muted: "#B0A090", border: "#E2D8CE",
  bg: "#F5F0EA", sec: "#F9F6F2", ok: "#4A6645",
};

const f = { font: "'Jost', sans-serif", serif: "'Cormorant Garamond', serif" };

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatCardNumber(value) {
  return value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits;
}

// ── Payment Modal ─────────────────────────────────────────────────────────────

function PaymentModal({ offer, onClose, onPay }) {
  const [card, setCard] = useState({
    name: "", number: "", expiry: "", cvv: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};

    // الاسم — حروف إنجليزية فقط + مسافات
    if (!card.name.trim()) {
      e.name = "Required";
    } else if (!/^[a-zA-Z\s]+$/.test(card.name.trim())) {
      e.name = "English letters only";
    }

    // رقم البطاقة — 16 رقم
    if (card.number.replace(/\s/g, "").length < 16) {
      e.number = "Enter valid 16-digit card number";
    }

    // تاريخ الانتهاء — مو في الماضي
    if (card.expiry.length < 5) {
      e.expiry = "Required";
    } else {
      const [mm, yy] = card.expiry.split("/");
      const now = new Date();
      const expMonth = parseInt(mm, 10);
      const expYear  = 2000 + parseInt(yy, 10);
      if (
        expMonth < 1 || expMonth > 12 ||
        expYear < now.getFullYear() ||
        (expYear === now.getFullYear() && expMonth < now.getMonth() + 1)
      ) {
        e.expiry = "Card has expired";
      }
    }

    // CVV — 3 أرقام بالضبط
    if (card.cvv.length !== 3) {
      e.cvv = "CVV must be exactly 3 digits";
    }

    return e;
  };

  const handlePay = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onPay();
  };

  const inp = (hasError) => ({
    width: "100%", padding: "11px 14px", borderRadius: 10,
    border: `1px solid ${hasError ? "#B05030" : C.border}`,
    background: C.sec, fontSize: 13, color: C.dark,
    fontFamily: f.font, outline: "none", boxSizing: "border-box",
  });

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
      <div style={{
        position: "fixed", inset: 0, background: "rgba(44,34,26,0.6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000, padding: 24, backdropFilter: "blur(4px)",
      }}>
        <div style={{
          background: "#fff", borderRadius: 20, width: "100%", maxWidth: 480,
          boxShadow: "0 32px 80px rgba(44,34,26,0.25)", overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{ background: C.dark, padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontFamily: f.serif, fontSize: 22, color: "#fff", fontWeight: 300, marginBottom: 4 }}>
                Complete Payment
              </div>
              <div style={{ fontSize: 11, color: "rgba(212,196,176,0.5)", fontWeight: 300 }}>
                Secure checkout — your information is protected
              </div>
            </div>
            <button onClick={onClose} style={{
              width: 28, height: 28, borderRadius: "50%",
              border: "0.5px solid rgba(212,196,176,0.25)", background: "transparent",
              color: "rgba(212,196,176,0.6)", fontSize: 13, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>✕</button>
          </div>

          {/* Order summary */}
          <div style={{ padding: "18px 28px", background: C.sec, borderBottom: `0.5px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.15em", color: C.muted, textTransform: "uppercase", marginBottom: 4 }}>Order Summary</div>
              <div style={{ fontSize: 13, color: C.dark, fontFamily: f.font }}>{offer?.work_type || "Interior Design Service"}</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{offer?.provider_name || "Provider"}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: f.serif, fontSize: 24, color: C.dark }}>
                {Number(offer?.price || 0).toLocaleString()}
              </div>
              <div style={{ fontSize: 10, color: C.muted }}>SAR</div>
            </div>
          </div>

          {/* Form */}
          <div style={{ padding: "24px 28px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: C.muted, marginBottom: 6, display: "block" }}>
                Cardholder Name
              </label>
              <input
                type="text"
                placeholder="e.g. Sara Al Rashidi"
                value={card.name}
                onChange={e => setCard(c => ({ ...c, name: e.target.value }))}
                style={inp(!!errors.name)}
              />
              {errors.name && <div style={{ fontSize: 10.5, color: "#B05030", marginTop: 4 }}>{errors.name}</div>}
            </div>

            <div>
              <label style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: C.muted, marginBottom: 6, display: "block" }}>
                Card Number
              </label>
              <input
                type="text"
                placeholder="0000 0000 0000 0000"
                value={card.number}
                onChange={e => setCard(c => ({ ...c, number: formatCardNumber(e.target.value) }))}
                style={inp(!!errors.number)}
              />
              {errors.number && <div style={{ fontSize: 10.5, color: "#B05030", marginTop: 4 }}>{errors.number}</div>}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: C.muted, marginBottom: 6, display: "block" }}>
                  Expiry Date
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={card.expiry}
                  onChange={e => setCard(c => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                  style={inp(!!errors.expiry)}
                />
                {errors.expiry && <div style={{ fontSize: 10.5, color: "#B05030", marginTop: 4 }}>{errors.expiry}</div>}
              </div>
              <div>
                <label style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: C.muted, marginBottom: 6, display: "block" }}>
                  CVV
                </label>
                <input
                  type="text"
                  placeholder="•••"
                  maxLength={3}
                  value={card.cvv}
                  onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) }))}
                  style={inp(!!errors.cvv)}
                />
                {errors.cvv && <div style={{ fontSize: 10.5, color: "#B05030", marginTop: 4 }}>{errors.cvv}</div>}
              </div>
            </div>

            <button
              onClick={handlePay}
              style={{
                width: "100%", padding: "14px", borderRadius: 12, border: "none",
                background: C.dark, color: C.sand, fontSize: 12, fontWeight: 500,
                fontFamily: f.font, letterSpacing: "0.15em", textTransform: "uppercase",
                cursor: "pointer", marginTop: 4,
              }}
            >
              Pay {Number(offer?.price || 0).toLocaleString()} SAR →
            </button>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 4 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <span style={{ fontSize: 10, color: C.muted }}>256-bit SSL encrypted · Payments are secure</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Loading Screen ────────────────────────────────────────────────────────────

function PaymentLoading() {
  return (
    <div style={{
      position: "fixed", inset: 0, background: C.bg,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      zIndex: 1000, fontFamily: f.font,
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
      <div style={{
        width: 56, height: 56, borderRadius: "50%",
        border: `2.5px solid ${C.border}`,
        borderTopColor: C.dark,
        animation: "spin 0.9s linear infinite",
        marginBottom: 28,
      }} />
      <div style={{ fontFamily: f.serif, fontSize: 22, color: C.dark, fontWeight: 300, marginBottom: 8 }}>
        Processing Payment
      </div>
      <div style={{ fontSize: 12, color: C.muted, fontWeight: 300, animation: "pulse 1.5s ease infinite" }}>
        Please wait, do not close this page...
      </div>
    </div>
  );
}

// ── Thank You Screen ──────────────────────────────────────────────────────────

function PaymentSuccess({ offer, onDone }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: C.bg,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      zIndex: 1000, fontFamily: f.font, padding: 24,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes checkIn {
          from { transform: scale(0.5); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        @keyframes fadeUp {
          from { transform: translateY(16px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>

      {/* Check circle */}
      <div style={{
        width: 80, height: 80, borderRadius: "50%",
        background: "rgba(74,102,69,0.1)", border: "1.5px solid rgba(74,102,69,0.25)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 28, animation: "checkIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
      }}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M6 16l7 7 13-13" stroke={C.ok} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Text */}
      <div style={{ textAlign: "center", maxWidth: 400, animation: "fadeUp 0.5s 0.15s ease both" }}>
        <div style={{ fontFamily: f.serif, fontSize: 32, fontWeight: 300, color: C.dark, marginBottom: 10, lineHeight: 1.2 }}>
          Payment Confirmed
        </div>
        <div style={{ fontSize: 13, color: C.muted, fontWeight: 300, lineHeight: 1.8, marginBottom: 32 }}>
          Thank you for using Swagne. Your project is now active and your selected provider has been notified.
        </div>

        {/* Order card */}
        <div style={{
          background: "#fff", border: `0.5px solid ${C.border}`, borderRadius: 16,
          padding: "20px 24px", marginBottom: 32, textAlign: "left",
        }}>
          <div style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, marginBottom: 14 }}>
            Order Details
          </div>
          {[
            ["Service",  offer?.work_type     || "Interior Design"],
            ["Provider", offer?.provider_name || "Provider"],
            ["Amount",   `${Number(offer?.price || 0).toLocaleString()} SAR`],
            ["Status",   "Confirmed ✓"],
          ].map(([label, value]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 10 }}>
              <span style={{ color: C.muted }}>{label}</span>
              <span style={{ color: label === "Status" ? C.ok : C.dark, fontWeight: 400 }}>{value}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onDone}
          style={{
            width: "100%", padding: "14px", borderRadius: 12, border: "none",
            background: C.dark, color: C.sand, fontSize: 11.5, fontWeight: 500,
            fontFamily: f.font, letterSpacing: "0.15em", textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Back to My Requests
        </button>
        <div style={{ fontSize: 11, color: C.muted, marginTop: 16, fontWeight: 300 }}>
          A confirmation summary has been saved to your account.
        </div>
      </div>
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
// الاستخدام:
// <PaymentFlow offer={offer} onClose={() => setPayOpen(false)} onComplete={handlePaymentComplete} />

export default function PaymentFlow({ offer, onClose, onComplete }) {
  const [step, setStep] = useState("modal"); // modal | loading | success

  const handlePay = () => {
    setStep("loading");
    setTimeout(() => setStep("success"), 2800);
  };

  if (step === "loading") return <PaymentLoading />;
  if (step === "success") return <PaymentSuccess offer={offer} onDone={onComplete} />;

  return <PaymentModal offer={offer} onClose={onClose} onPay={handlePay} />;
}