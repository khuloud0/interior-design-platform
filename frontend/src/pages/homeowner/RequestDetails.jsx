 import React, { useState, useEffect } from "react";
 import { useParams, useNavigate } from "react-router-dom";

 export function RequestDetailsPage() {
   const { id } = useParams();
   const navigate = useNavigate();
   const [data, setData] = useState(null);
   const [loading, setLoading] = useState(true);

 useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://127.0.0.1:5000/design-requests/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!data)   return <div>Request not found.</div>;

  return (
     <RequestDetails
       request={data.request}
      designVision={data.design_vision}
     offers={data.offers ?? []}
      clientAttachments={data.attachments ?? []}
      onEdit={() =>
       navigate("/create-request", {
        state: {
        mode: "edit",
        request: data.request,
    },
  })
}
      onSelectOffer={() => navigate(`/requests/${id}/offers`)}
      onDesignerClick={(name) => navigate(`/designers/${encodeURIComponent(name)}`)}    />
   );
 }

/**
 * RequestDetails — SWAGNE
 *
 * Route:  /requests/:id
 * Fetch:  GET /design-requests/:id  →  { request, design_vision, offers, attachments }
 *
 * request.status values (from backend):
 *   "pending" | "in_progress" | "execution_plan_ready" | "offers_ready" | "completed"
 */

const C = {
  dark: "#2C221A", mid: "#3D3128", sand: "#D4C4B0",
  stone: "#8C7B6B", muted: "#B0A090", border: "#E2D8CE",
  bg: "#F5F0EA", sec: "#F7F3EF",
  terra: "#7A3B2E", terraL: "#F0E8E4",
  teal: "#1E6B5E", ok: "#4A6645",
};

const STATUS_STEP = {
  pending: 1, in_progress: 2,
  execution_plan_ready: 3, offers_ready: 4, completed: 5,
};

const STATUS_META = {
  pending:              { dot: C.sand,  label: "Pending Review" },
  in_progress:          { dot: C.stone, label: "In Progress" },
  execution_plan_ready: { dot: C.teal,  label: "Plan Ready" },
  offers_ready:         { dot: C.ok,    label: "Offers Ready" },
  completed:            { dot: C.ok,    label: "Completed" },
};

const STEP_LABELS = [
  "Request submitted",
  "Designer reviewing",
  "Execution plan ready",
  "Providers submit offers",
  "Confirmed",
];

const f = { font: "'Jost', sans-serif", serif: "'Cormorant Garamond', serif" };
const T = {
  label: { fontSize: 9, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: C.muted, fontFamily: f.font },
  val:   { fontSize: 13, fontWeight: 400, color: C.dark, fontFamily: f.font },
  muted: { fontSize: 12, fontWeight: 300, color: C.muted, fontFamily: f.font },
};

// ── Section ───────────────────────────────────────────────────
const Section = ({ label, children }) => (
  <div style={{ marginBottom: 40 }}>
    {label && (
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <span style={T.label}>{label}</span>
        <div style={{ flex: 1, height: "0.5px", background: C.border }} />
      </div>
    )}
    {children}
  </div>
);

// ── Logo ──────────────────────────────────────────────────────
const LogoMark = () => (
  <div style={{ width: 24, height: 24, border: "1.5px solid rgba(212,196,176,0.3)", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="5" height="5" stroke="#D4C4B0" strokeWidth="1.2" rx="1" />
      <rect x="9" y="2" width="5" height="5" fill="rgba(212,196,176,0.35)" rx="1" />
      <rect x="2" y="9" width="5" height="5" fill="rgba(212,196,176,0.35)" rx="1" />
      <rect x="9" y="9" width="5" height="5" stroke="#D4C4B0" strokeWidth="1.2" rx="1" />
    </svg>
  </div>
);

// ── Stepper ───────────────────────────────────────────────────
const Stepper = ({ status }) => {
  const cur = STATUS_STEP[status] || 1;
  return (
    <div style={{ display: "flex", alignItems: "flex-start" }}>
      {STEP_LABELS.map((label, i) => {
        const idx = i + 1;
        const done = idx < cur, active = idx === cur;
        return (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", flex: i < STEP_LABELS.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                border: `1.5px solid ${done ? C.dark : active ? C.terra : C.border}`,
                background: done ? C.dark : active ? C.terraL : "transparent",
                color: done ? C.sand : active ? C.terra : C.muted,
                fontSize: 10, fontFamily: f.font, fontWeight: 500, flexShrink: 0,
              }}>
                {done
                  ? <svg width="10" height="10" viewBox="0 0 14 14" fill="none"><path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  : <span>{String(idx).padStart(2, "0")}</span>
                }
              </div>
              <span style={{ fontSize: 10, fontFamily: f.font, fontWeight: active ? 500 : 300, color: done ? C.stone : active ? C.terra : C.muted, textAlign: "center", lineHeight: 1.4, maxWidth: 64 }}>
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div style={{ flex: 1, height: "0.5px", background: done ? C.dark : C.border, margin: "14px 6px 0" }} />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ── Summary row ───────────────────────────────────────────────
const SummaryRow = ({ label, value }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBlock: 14, borderBottom: `0.5px solid ${C.border}` }}>
    <span style={T.muted}>{label}</span>
    <span style={T.val}>{value}</span>
  </div>
);

// ── Client attachment ─────────────────────────────────────────
const AttachItem = ({ name, type }) => (
  <div style={{ border: `0.5px solid ${C.border}`, borderRadius: 12, overflow: "hidden", background: C.sec, cursor: "pointer" }}>
    <div style={{ height: 90, background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: "rgba(212,196,176,0.2)" }}>
      {type === "image" ? "▣" : "⊟"}
    </div>
    <div style={{ padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: 11, color: C.dark, fontFamily: f.font, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</span>
      <span style={{ fontSize: 13, color: C.muted }}>↓</span>
    </div>
  </div>
);

// ── Rec card ──────────────────────────────────────────────────
const RecCard = ({ title, description }) => (
  <div style={{ background: C.sec, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: "16px 18px" }}>
    <div style={{ fontSize: 13, fontWeight: 500, color: C.dark, fontFamily: f.font, marginBottom: 6 }}>{title}</div>
    <div style={{ fontSize: 12, fontWeight: 300, color: C.muted, fontFamily: f.font, lineHeight: 1.65 }}>{description}</div>
  </div>
);

// ── Layout card ───────────────────────────────────────────────
const layoutPreviews = [
  { bg: "#261C14", svg: <svg viewBox="0 0 120 90" width="95" height="72"><rect x="6" y="6" width="108" height="78" fill="none" stroke="rgba(212,196,176,0.25)" strokeWidth="1.5" /><rect x="14" y="14" width="42" height="32" fill="rgba(212,196,176,0.08)" stroke="rgba(212,196,176,0.2)" strokeWidth="1" rx="1" /><text x="35" y="33" fontSize="6" fill="rgba(212,196,176,0.4)" textAnchor="middle" fontFamily="Jost,sans-serif">BED</text><rect x="62" y="14" width="48" height="38" fill="rgba(212,196,176,0.06)" stroke="rgba(212,196,176,0.15)" strokeWidth="1" rx="1" /></svg> },
  { bg: "#261C14", svg: <svg viewBox="0 0 120 90" width="95" height="72"><line x1="6" y1="74" x2="114" y2="74" stroke="rgba(212,196,176,0.2)" strokeWidth="1" /><rect x="22" y="38" width="46" height="32" fill="rgba(212,196,176,0.08)" stroke="rgba(212,196,176,0.2)" strokeWidth="1" rx="1" /><circle cx="94" cy="26" r="12" fill="rgba(212,196,176,0.06)" stroke="rgba(212,196,176,0.18)" strokeWidth="1" /></svg> },
  { bg: "#261C14", svg: <svg viewBox="0 0 120 90" width="95" height="72"><rect x="6" y="6" width="108" height="78" fill="none" stroke="rgba(212,196,176,0.15)" strokeWidth="1" /><rect x="6" y="6" width="108" height="14" fill="rgba(212,196,176,0.06)" /><rect x="14" y="26" width="40" height="30" fill="rgba(212,196,176,0.07)" stroke="rgba(212,196,176,0.18)" strokeWidth="1" rx="1" /><rect x="60" y="26" width="48" height="56" fill="rgba(212,196,176,0.05)" stroke="rgba(212,196,176,0.12)" strokeWidth="1" rx="1" /></svg> },
  { bg: "#1E1610", svg: <svg viewBox="0 0 120 90" width="95" height="72"><rect x="28" y="22" width="64" height="44" fill="rgba(212,196,176,0.07)" stroke="rgba(212,196,176,0.18)" strokeWidth="1" rx="1" /><circle cx="48" cy="12" r="2" fill="rgba(212,196,176,0.3)" /><circle cx="60" cy="12" r="2" fill="rgba(212,196,176,0.3)" /><circle cx="72" cy="12" r="2" fill="rgba(212,196,176,0.3)" /></svg> },
];

const LayoutCard = ({ name, size, index }) => {
  const p = layoutPreviews[index % layoutPreviews.length];
  return (
    <div style={{ border: `0.5px solid ${C.border}`, borderRadius: 12, overflow: "hidden", cursor: "pointer" }}>
      <div style={{ height: 100, background: p.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>{p.svg}</div>
      <div style={{ padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `0.5px solid ${C.border}` }}>
        <div>
          <div style={{ fontSize: 11.5, color: C.dark, fontFamily: f.font, marginBottom: 2 }}>{name}</div>
          <div style={{ fontSize: 10, color: C.muted, fontFamily: f.font }}>PDF · {size}</div>
        </div>
        <span style={{ fontSize: 14, color: C.muted }}>↓</span>
      </div>
    </div>
  );
};

// ── Provider row ──────────────────────────────────────────────
const ProviderRow = ({ offer }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBlock: 18, borderBottom: `0.5px solid ${C.border}` }}>
    <div style={{ width: 38, height: 38, borderRadius: 10, background: offer.recommended ? C.dark : C.sec, border: `0.5px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: f.serif, fontSize: 14, color: offer.recommended ? C.sand : C.stone, flexShrink: 0 }}>
      {offer.provider_initials}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: C.dark, fontFamily: f.font }}>{offer.provider_name}</span>
        {offer.recommended && (
          <span style={{ fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", color: C.teal, background: "rgba(30,107,94,0.08)", border: "0.5px solid rgba(30,107,94,0.2)", borderRadius: 99, padding: "2px 8px", fontFamily: f.font }}>
            Recommended
          </span>
        )}
      </div>
      <div style={{ display: "flex", gap: 10, fontSize: 11.5, color: C.muted, fontFamily: f.font, fontWeight: 300 }}>
        <span>★ {offer.rating}</span>
        <span>·</span>
        <span>{offer.duration_days} days</span>
        <span>·</span>
        <span>{offer.total_projects} projects</span>
      </div>
    </div>
    <div style={{ fontFamily: f.serif, fontSize: 20, color: C.dark }}>
      {offer.price.toLocaleString()}
      <span style={{ fontSize: 11, fontFamily: f.font, color: C.muted, marginLeft: 3 }}>SAR</span>
    </div>
  </div>
);

// ── Ghost button style ────────────────────────────────────────
const ghostBtn = {
  display: "flex", alignItems: "center", gap: 6,
  padding: "7px 16px", borderRadius: 8,
  border: `0.5px solid ${C.border}`, background: "transparent",
  color: C.stone, fontSize: 11, fontFamily: f.font,
  fontWeight: 400, letterSpacing: "0.06em", cursor: "pointer",
  transition: "border-color .15s, color .15s",
};

// ── Main component ────────────────────────────────────────────
export default function RequestDetails({
  request = {},
  designVision = null,
  offers = [],
  clientAttachments = [],
  onEdit,
  onSelectOffer,
  onDesignerClick,
}) {
  const { id } = useParams();   // /requests/:id
  const navigate = useNavigate();

  const {
    title = "—", service_type, space_type, preferred_style,
    preferred_colors, budget, space_details, submitted_at, status = "pending",
  } = request;

  const meta     = STATUS_META[status] || STATUS_META.pending;
  const isPending = status === "pending";
  const hasDV    = ["execution_plan_ready", "offers_ready", "completed"].includes(status) && designVision;
  const hasOffers = status === "offers_ready" && offers.length > 0;

  const submitted = submitted_at
    ? new Date(submitted_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
      <div style={{ background: C.bg, minHeight: "100vh", fontFamily: f.font }}>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "32px 24px 80px" }}>

          {/* ── BACK / HOME ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
            <button style={ghostBtn} onClick={() => navigate(-1)}>← Back</button>
            <button style={ghostBtn} onClick={() => navigate("/")}>Home</button>
          </div>

          {/* ── HERO ── */}
          <div style={{ background: C.dark, borderRadius: 20, overflow: "hidden", marginBottom: 32, position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 28px,#D4C4B0 28px,#D4C4B0 29px),repeating-linear-gradient(90deg,transparent,transparent 28px,#D4C4B0 28px,#D4C4B0 29px)" }} />
            <div style={{ position: "relative", zIndex: 1, padding: "28px 32px 32px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <LogoMark />
                  <span style={{ fontFamily: f.serif, fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", color: C.sand, textTransform: "uppercase" }}>Swagne</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {isPending && (
                    <button
                      onClick={onEdit}
                      style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, border: "1px solid rgba(212,196,176,0.25)", background: "transparent", color: "rgba(212,196,176,0.75)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: f.font, cursor: "pointer" }}
                    >
                      ✎ Edit Request
                    </button>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 99, border: "1px solid rgba(212,196,176,0.2)" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: meta.dot }} />
                    <span style={{ fontSize: 10, letterSpacing: "0.1em", color: "rgba(212,196,176,0.6)", textTransform: "uppercase", fontFamily: f.font }}>{meta.label}</span>
                  </div>
                </div>
              </div>
              <div style={{ fontFamily: f.serif, fontSize: 32, fontWeight: 300, color: "#fff", marginBottom: 8, lineHeight: 1.15 }}>{title}</div>
              <div style={{ fontSize: 12, color: "rgba(212,196,176,0.45)", fontWeight: 300, marginBottom: 28 }}>
                {submitted && `Submitted ${submitted}`}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[service_type, space_type, budget && `${budget.toLocaleString()} SAR`].filter(Boolean).map((v, i) => (
                  <div key={i} style={{ padding: "5px 12px", borderRadius: 99, background: "rgba(212,196,176,0.07)", border: "0.5px solid rgba(212,196,176,0.12)", fontSize: 11.5, color: "rgba(212,196,176,0.6)", fontFamily: f.font, fontWeight: 300 }}>
                    {v}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── HELPER (pending only) ── */}
          {isPending && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 18px", background: C.terraL, border: "0.5px solid rgba(122,59,46,0.18)", borderRadius: 14, marginBottom: 32, fontSize: 12.5, color: C.terra, fontWeight: 300, lineHeight: 1.6 }}>
              <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>ⓘ</span>
              You can still edit your request before a designer is assigned.
            </div>
          )}

          {/* ── PROGRESS ── */}
          <Section label="Progress">
            <div style={{ padding: "28px 24px", background: "#fff", borderRadius: 16, border: `0.5px solid ${C.border}` }}>
              <Stepper status={status} />
            </div>
          </Section>

          {/* ── REQUEST DETAILS ── */}
          <Section label="Request details">
            <div style={{ background: "#fff", borderRadius: 16, border: `0.5px solid ${C.border}`, padding: "0 24px" }}>
              <SummaryRow label="Service type"     value={service_type} />
              <SummaryRow label="Space type"       value={space_type} />
              <SummaryRow label="Preferred style"  value={preferred_style} />
              <SummaryRow label="Preferred colors" value={preferred_colors} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBlock: 14 }}>
                <span style={T.muted}>Budget</span>
                <span style={{ fontFamily: f.serif, fontSize: 22, fontWeight: 400, color: C.dark }}>
                  {budget?.toLocaleString()} <span style={{ fontSize: 12, fontFamily: f.font, color: C.muted }}>SAR</span>
                </span>
              </div>
            </div>
          </Section>

          {/* ── SPACE DESCRIPTION ── */}
          <Section label="Space description">
            <div style={{ padding: "24px 28px", background: "#fff", borderRadius: 16, border: `0.5px solid ${C.border}` }}>
              <p style={{ fontFamily: f.serif, fontSize: 16, fontWeight: 300, fontStyle: "italic", color: C.mid, lineHeight: 1.9, margin: 0 }}>
                "{space_details}"
              </p>
            </div>
          </Section>

          {/* ── ATTACHMENTS ── */}
          {clientAttachments?.length > 0 && (
            <Section label="Attachments">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {clientAttachments.map((a, i) => <AttachItem key={i} {...a} />)}
              </div>
            </Section>
          )}

          {/* ── DESIGN VISION ── */}
          {hasDV && (
            <Section label="Design Vision">
              <div style={{ background: "#fff", borderRadius: 16, border: `0.5px solid ${C.border}`, overflow: "hidden" }}>
                <div style={{ background: C.dark, padding: "20px 24px", display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(212,196,176,0.1)", border: "0.5px solid rgba(212,196,176,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: f.serif, fontSize: 15, color: C.sand, flexShrink: 0 }}>
                    {designVision.designer?.initials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <button onClick={() => onDesignerClick?.(designVision.designer?.name)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: f.font, fontSize: 13, fontWeight: 500, color: C.sand, borderBottom: "1px solid rgba(212,196,176,0.25)", paddingBottom: 1 }}>
                      {designVision.designer?.name}
                    </button>
                    <div style={{ fontSize: 11, color: "rgba(212,196,176,0.45)", fontWeight: 300, marginTop: 3 }}>
                      {designVision.designer?.role} · {designVision.designer?.city}
                    </div>
                  </div>
                  <span style={{ fontSize: 11, color: "rgba(212,196,176,0.5)", fontFamily: f.font }}>★ {designVision.designer?.rating}</span>
                </div>

                <div style={{ padding: "28px 24px" }}>
                  {designVision.palette?.length > 0 && (
                    <div style={{ marginBottom: 32 }}>
                      <div style={{ ...T.label, marginBottom: 14 }}>Suggested palette</div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        {designVision.palette.map((p, i) => (
                          <div key={i} title={p.name} style={{ width: 28, height: 28, borderRadius: 8, background: p.hex, border: `0.5px solid ${C.border}` }} />
                        ))}
                        <span style={{ fontSize: 11, color: C.muted, fontWeight: 300, marginLeft: 8 }}>
                          {designVision.palette.map(p => p.name).join(" · ")}
                        </span>
                      </div>
                    </div>
                  )}

                  {designVision.recommendations?.length > 0 && (
                    <div style={{ marginBottom: 32 }}>
                      <div style={{ ...T.label, marginBottom: 14 }}>Recommendations</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        {designVision.recommendations.map((r, i) => <RecCard key={i} {...r} />)}
                      </div>
                    </div>
                  )}

                  {designVision.timeline && (
                    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", background: C.sec, border: `0.5px solid ${C.border}`, borderRadius: 12, marginBottom: 32 }}>
                      <span style={{ fontSize: 12, color: C.stone, fontFamily: f.font }}>Estimated execution timeline</span>
                      <span style={{ fontFamily: f.serif, fontSize: 18, color: C.dark, marginLeft: "auto" }}>
                        {designVision.timeline.min} – {designVision.timeline.max} weeks
                      </span>
                    </div>
                  )}

                  {designVision.attachments?.length > 0 && (
                    <>
                      <div style={{ ...T.label, marginBottom: 14 }}>Space layouts</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        {designVision.attachments.map((a, i) => <LayoutCard key={i} name={a.name} size={a.size} index={i} />)}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Section>
          )}

          {/* ── OFFERS (offers_ready only) ── */}
          {hasOffers && (
            <Section label="Provider offers">
              <div style={{ background: "#fff", borderRadius: 16, border: `0.5px solid ${C.border}`, overflow: "hidden" }}>
                <div style={{ padding: "0 24px" }}>
                  {offers.map(o => <ProviderRow key={o.id} offer={o} />)}
                </div>
                <div style={{ padding: "20px 24px 24px" }}>
                  <button onClick={onSelectOffer} style={{ width: "100%", padding: 14, border: "none", borderRadius: 12, background: C.dark, color: C.sand, fontSize: 10.5, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: f.font, cursor: "pointer" }}>
                    Review & select offer →
                  </button>
                </div>
              </div>
            </Section>
          )}

        </div>
      </div>
    </>
  );
}

// ── Page wrapper — fetches by :id from URL ─────────────────────
//
// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
//
// export function RequestDetailsPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     fetch(`http://127.0.0.1:5000/design-requests/${id}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then(r => r.json())
//       .then(d => { setData(d); setLoading(false); })
//       .catch(() => setLoading(false));
//   }, [id]);
//
//   if (loading) return <div>Loading...</div>;
//   if (!data)   return <div>Request not found.</div>;
//
//   return (
//     <RequestDetails
//       request={data.request}
//       designVision={data.design_vision}
//       offers={data.offers ?? []}
//       clientAttachments={data.attachments ?? []}
//       onEdit={() => navigate(`/requests/${id}/edit`)}
//       onSelectOffer={() => navigate(`/requests/${id}/offers`)}
//       onDesignerClick={(name) => navigate(`/designers/${encodeURIComponent(name)}`)}
//     />
//   );
// }
//
// ── Router ────────────────────────────────────────────────────
// <Route path="/requests/:id" element={<RequestDetailsPage />} />