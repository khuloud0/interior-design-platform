import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ClientSidebar from "../../components/ClientSidebar";
import CreateRequestModal from "../../components/CreateRequestModal";

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
  "Request submitted", "Designer reviewing",
  "Execution plan ready", "Providers submit offers", "Confirmed",
];
const f = { font: "'Jost', sans-serif", serif: "'Cormorant Garamond', serif" };
const T = {
  label: { fontSize: 9, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: C.muted, fontFamily: f.font },
  val:   { fontSize: 13, fontWeight: 400, color: C.dark, fontFamily: f.font },
  muted: { fontSize: 12, fontWeight: 300, color: C.muted, fontFamily: f.font },
};

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
                  : <span>{String(idx).padStart(2, "0")}</span>}
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

const RecCard = ({ title, description }) => (
  <div style={{ background: C.sec, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: "16px 18px" }}>
    <div style={{ fontSize: 13, fontWeight: 500, color: C.dark, fontFamily: f.font, marginBottom: 6 }}>{title}</div>
    <div style={{ fontSize: 12, fontWeight: 300, color: C.muted, fontFamily: f.font, lineHeight: 1.65 }}>{description}</div>
  </div>
);

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

// ✅ ProviderRow مع زر Select
const ProviderRow = ({ offer, onSelect, selecting, selected }) => (
  <div style={{ paddingBlock: 20, borderBottom: `0.5px solid ${C.border}` }}>
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: offer.recommendation ? 12 : 0 }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: offer.recommended ? C.dark : C.sec, border: `0.5px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: f.serif, fontSize: 14, color: offer.recommended ? C.sand : C.stone, flexShrink: 0 }}>
        {offer.provider_initials}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: C.dark, fontFamily: f.font }}>{offer.provider_name}</span>
          {offer.recommended && (
            <span style={{ fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", color: C.teal, background: "rgba(30,107,94,0.08)", border: "0.5px solid rgba(30,107,94,0.2)", borderRadius: 99, padding: "2px 8px", fontFamily: f.font }}>Recommended</span>
          )}
        </div>
        <div style={{ fontSize: 11.5, color: C.muted, fontFamily: f.font, fontWeight: 300 }}>
          {offer.work_type} · {offer.duration_days}
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontFamily: f.serif, fontSize: 20, color: C.dark }}>
          {Number(offer.price).toLocaleString()}
          <span style={{ fontSize: 11, fontFamily: f.font, color: C.muted, marginLeft: 3 }}>SAR</span>
        </div>
      </div>
    </div>

    {/* توصية المصمم */}
    {offer.recommendation && (
      <div style={{ padding: "10px 14px", background: "rgba(30,107,94,0.06)", border: "0.5px solid rgba(30,107,94,0.15)", borderRadius: 8, marginBottom: 12 }}>
        <div style={{ fontSize: 9, color: C.teal, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Designer's Note</div>
        <div style={{ fontSize: 12, color: C.mid, fontWeight: 300, lineHeight: 1.6 }}>{offer.recommendation}</div>
      </div>
    )}

    {/* ✅ زر Select */}
    {!selected && (
      <button
        onClick={() => onSelect(offer.id)}
        disabled={selecting}
        style={{ width: "100%", padding: "10px", borderRadius: 10, border: `0.5px solid ${C.border}`, background: "transparent", color: C.stone, fontSize: 10, fontWeight: 500, fontFamily: f.font, letterSpacing: ".12em", textTransform: "uppercase", cursor: selecting ? "not-allowed" : "pointer", transition: "all .15s" }}
        onMouseEnter={e => { if (!selecting) { e.currentTarget.style.background = C.dark; e.currentTarget.style.color = C.sand; e.currentTarget.style.borderColor = C.dark; } }}
        onMouseLeave={e => { if (!selecting) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.stone; e.currentTarget.style.borderColor = C.border; } }}
      >
        {selecting ? "Processing..." : "Select This Offer →"}
      </button>
    )}

    {selected && (
      <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(74,102,69,0.08)", border: "0.5px solid rgba(74,102,69,0.2)", fontSize: 12, color: C.ok, display: "flex", alignItems: "center", gap: 8 }}>
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        You selected this offer — project is now active.
      </div>
    )}
  </div>
);

const GhostBtn = ({ onClick, children }) => (
  <button onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 8, border: `0.5px solid ${C.border}`, background: "transparent", color: C.stone, fontSize: 11, fontFamily: f.font, fontWeight: 400, letterSpacing: "0.06em", cursor: "pointer" }}>
    {children}
  </button>
);

function RequestDetails({ request = {}, designVision = null, offers = [], clientAttachments = [], onEdit, onDesignerClick, onSelectOffer, selectingOffer, selectedOfferId }) {
  const {
    title = "—", service_type, space_type, preferred_style,
    preferred_colors, budget, space_details, submitted_at, status = "pending",
    space_size, desired_start, duration,
  } = request;

  const meta      = STATUS_META[status] || STATUS_META.pending;
  const isPending = status === "pending";
  const hasDV     = ["execution_plan_ready", "offers_ready", "completed"].includes(status) && designVision;
  const hasOffers = ["offers_ready", "completed"].includes(status) && offers.length > 0;

  const submitted = submitted_at
    ? new Date(submitted_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "";

  const [initials, setInitials] = useState("?");
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      setInitials(u?.name?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?");
    } catch {}
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: f.font, background: C.bg }}>
      <ClientSidebar variant="light" />
      <main style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.16em", color: C.muted, textTransform: "uppercase" }}>DESIGNER MARKETPLACE</div>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: f.serif, fontSize: 14, fontWeight: 600, color: C.sand }}>{initials}</div>
        </div>

        <h1 style={{ fontFamily: f.serif, fontSize: 32, fontWeight: 400, color: C.dark, marginBottom: 6 }}>Request Details</h1>
        <p style={{ fontSize: 12, color: C.muted, fontWeight: 300, marginBottom: 28, lineHeight: 1.7 }}>Track the status of your design request and review updates from your designer.</p>
        <div style={{ marginBottom: 32 }}><GhostBtn onClick={onEdit}>✎ Edit Request</GhostBtn></div>

        {/* Hero card */}
        <div style={{ background: C.dark, borderRadius: 20, overflow: "hidden", marginBottom: 32, position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 28px,#D4C4B0 28px,#D4C4B0 29px),repeating-linear-gradient(90deg,transparent,transparent 28px,#D4C4B0 28px,#D4C4B0 29px)" }} />
          <div style={{ position: "relative", zIndex: 1, padding: "28px 32px 32px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <LogoMark />
                <span style={{ fontFamily: f.serif, fontSize: 11, fontWeight: 600, letterSpacing: "0.2em", color: C.sand, textTransform: "uppercase" }}>Swagne</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 99, border: "1px solid rgba(212,196,176,0.2)" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: meta.dot }} />
                <span style={{ fontSize: 10, letterSpacing: "0.1em", color: "rgba(212,196,176,0.6)", textTransform: "uppercase", fontFamily: f.font }}>{meta.label}</span>
              </div>
            </div>
            <div style={{ fontFamily: f.serif, fontSize: 32, fontWeight: 300, color: "#fff", marginBottom: 8, lineHeight: 1.15 }}>{title}</div>
            <div style={{ fontSize: 12, color: "rgba(212,196,176,0.45)", fontWeight: 300, marginBottom: 28 }}>{submitted && `Submitted ${submitted}`}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[service_type, space_type, budget && `${Number(budget).toLocaleString()} SAR`].filter(Boolean).map((v, i) => (
                <div key={i} style={{ padding: "5px 12px", borderRadius: 99, background: "rgba(212,196,176,0.07)", border: "0.5px solid rgba(212,196,176,0.12)", fontSize: 11.5, color: "rgba(212,196,176,0.6)", fontFamily: f.font, fontWeight: 300 }}>{v}</div>
              ))}
            </div>
          </div>
        </div>

        {isPending && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 18px", background: C.terraL, border: "0.5px solid rgba(122,59,46,0.18)", borderRadius: 14, marginBottom: 32, fontSize: 12.5, color: C.terra, fontWeight: 300, lineHeight: 1.6 }}>
            <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>ⓘ</span>
            You can still edit your request before a designer is assigned.
          </div>
        )}

        <Section label="Progress">
          <div style={{ padding: "28px 24px", background: "#EDE5DC", borderRadius: 16, border: `0.5px solid ${C.border}` }}>
            <Stepper status={status} />
          </div>
        </Section>

        <Section label="Request details">
          <div style={{ background: "#EDE5DC", borderRadius: 16, border: `0.5px solid ${C.border}`, overflow: "hidden" }}>
            {[
              { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z"/></svg>, label: "SERVICE TYPE", value: service_type },
              { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>, label: "SPACE TYPE", value: space_type },
              { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>, label: "PREFERRED STYLE", value: preferred_style },
              { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>, label: "COLOR PREFERENCE", value: preferred_colors },
              { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, label: "BUDGET", value: budget ? `${Number(budget).toLocaleString()} SAR` : "—" },
              { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>, label: "SPACE SIZE", value: space_size ? `${space_size} m²` : "—" },
              { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>, label: "DESIRED START", value: desired_start || "—" },
              { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>, label: "DURATION", value: duration || "—" },
            ].reduce((rows, item, i, arr) => {
              if (i % 2 === 0) rows.push(arr.slice(i, i + 2));
              return rows;
            }, []).map((pair, rowIdx, allRows) => (
              <div key={rowIdx} style={{ display: "grid", gridTemplateColumns: pair.length === 2 ? "1fr 1fr" : "1fr", borderBottom: rowIdx < allRows.length - 1 ? `0.5px solid ${C.border}` : "none" }}>
                {pair.map((item, colIdx) => (
                  <div key={colIdx} style={{ padding: "22px 24px", borderRight: colIdx === 0 && pair.length === 2 ? `0.5px solid ${C.border}` : "none", display: "flex", alignItems: "flex-start", gap: 14 }}>
                    <div style={{ color: C.stone, flexShrink: 0, marginTop: 2 }}>{item.icon}</div>
                    <div>
                      <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.16em", color: C.muted, textTransform: "uppercase", fontFamily: f.font, marginBottom: 6 }}>{item.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 400, color: C.dark, fontFamily: f.font }}>{item.value || "—"}</div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Section>

        {space_details && (
          <Section label="Space description">
            <div style={{ padding: "24px 28px", background: "#EDE5DC", borderRadius: 16, border: `0.5px solid ${C.border}` }}>
              <p style={{ fontFamily: f.serif, fontSize: 16, fontWeight: 300, fontStyle: "italic", color: C.mid, lineHeight: 1.9, margin: 0 }}>"{space_details}"</p>
            </div>
          </Section>
        )}

        {clientAttachments?.length > 0 && (
          <Section label="Attachments">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {clientAttachments.map((a, i) => <AttachItem key={i} {...a} />)}
            </div>
          </Section>
        )}

        {hasDV && (
          <Section label="Design Vision">
            <div style={{ background: "#EDE5DC", borderRadius: 16, border: `0.5px solid ${C.border}`, overflow: "hidden" }}>
              <div style={{ background: C.dark, padding: "20px 24px", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(212,196,176,0.1)", border: "0.5px solid rgba(212,196,176,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: f.serif, fontSize: 15, color: C.sand, flexShrink: 0 }}>
                  {designVision.designer?.initials}
                </div>
                <div style={{ flex: 1 }}>
                  <button onClick={() => onDesignerClick?.(designVision.designer?.name)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: f.font, fontSize: 13, fontWeight: 500, color: C.sand, borderBottom: "1px solid rgba(212,196,176,0.25)", paddingBottom: 1 }}>
                    {designVision.designer?.name}
                  </button>
                  <div style={{ fontSize: 11, color: "rgba(212,196,176,0.45)", fontWeight: 300, marginTop: 3 }}>{designVision.designer?.role} · {designVision.designer?.city}</div>
                </div>
              </div>
              <div style={{ padding: "28px 24px" }}>
                {/* Vision */}
                {designVision.vision && (
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ ...T.label, marginBottom: 10 }}>Design Vision</div>
                    <p style={{ fontSize: 13, color: C.mid, fontWeight: 300, lineHeight: 1.8 }}>{designVision.vision}</p>
                  </div>
                )}
                {/* Materials & Colors */}
                {(designVision.materials || designVision.colors) && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
                    {designVision.materials && (
                      <div>
                        <div style={{ ...T.label, marginBottom: 6 }}>Materials</div>
                        <div style={{ fontSize: 13, color: C.dark }}>{designVision.materials}</div>
                      </div>
                    )}
                    {designVision.colors && (
                      <div>
                        <div style={{ ...T.label, marginBottom: 6 }}>Color Palette</div>
                        <div style={{ fontSize: 13, color: C.dark }}>{designVision.colors}</div>
                      </div>
                    )}
                  </div>
                )}
                {/* Stages */}
                {designVision.stages?.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ ...T.label, marginBottom: 12 }}>Project Stages</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {designVision.stages.map((s, i) => (
                        <div key={i} style={{ padding: "12px 16px", background: C.sec, borderRadius: 10, border: `0.5px solid ${C.border}` }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontSize: 12, fontWeight: 500, color: C.dark }}>{s.title}</span>
                            {s.duration && <span style={{ fontSize: 11, color: C.muted }}>{s.duration}</span>}
                          </div>
                          {s.description && <p style={{ fontSize: 11, color: C.muted, margin: 0, lineHeight: 1.6 }}>{s.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {designVision.estimated_budget && (
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", background: C.sec, border: `0.5px solid ${C.border}`, borderRadius: 12 }}>
                    <span style={{ fontSize: 12, color: C.stone, fontFamily: f.font }}>Estimated execution budget</span>
                    <span style={{ fontFamily: f.serif, fontSize: 18, color: C.dark, marginLeft: "auto" }}>{Number(designVision.estimated_budget).toLocaleString()} SAR</span>
                  </div>
                )}
              </div>
            </div>
          </Section>
        )}

        {/* ✅ قسم عروض المقاولين مع زر Select لكل عرض */}
        {hasOffers && (
          <Section label="Provider Offers">
            <div style={{ background: "#EDE5DC", borderRadius: 16, border: `0.5px solid ${C.border}`, overflow: "hidden" }}>
              <div style={{ padding: "8px 24px 0" }}>
                {offers.map(o => (
                  <ProviderRow
                    key={o.id}
                    offer={o}
                    onSelect={onSelectOffer}
                    selecting={selectingOffer}
                    selected={selectedOfferId === o.id}
                  />
                ))}
              </div>
              {selectedOfferId && (
                <div style={{ padding: "16px 24px 24px", fontSize: 12, color: C.ok, fontWeight: 300 }}>
                  ✓ Your selection has been confirmed. The other offers have been cancelled.
                </div>
              )}
            </div>
          </Section>
        )}

      </main>
    </div>
  );
}

export function RequestDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [selectingOffer, setSelectingOffer] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState(null);

  const fetchData = () => {
    const token = localStorage.getItem("token");
    fetch(`http://127.0.0.1:5000/design-requests/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [id]);

  // ✅ العميل يختار عرض
  const handleSelectOffer = async (offerId) => {
    setSelectingOffer(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:5000/design-requests/${id}/select-offer`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ offer_id: offerId }),
      });
      const resData = await res.json();
      if (res.ok) {
        setSelectedOfferId(offerId);
        fetchData(); // تحديث الصفحة
      }
    } catch {}
    finally { setSelectingOffer(false); }
  };

  if (loading) return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Jost', sans-serif", background: "#F5F0EA" }}>
      <ClientSidebar variant="light" />
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 12, color: "#B0A090", letterSpacing: "0.1em" }}>Loading...</div>
      </main>
    </div>
  );

  if (!data) return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Jost', sans-serif", background: "#F5F0EA" }}>
      <ClientSidebar variant="light" />
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 12, color: "#B0A090" }}>Request not found.</div>
      </main>
    </div>
  );

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } body { margin: 0; }`}</style>
      <CreateRequestModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSuccess={() => { setEditOpen(false); fetchData(); }}
        initialData={data.request}
        mode="edit"
        requestId={id}
      />
      <RequestDetails
        request={data.request}
        designVision={data.design_vision}
        offers={data.offers ?? []}
        clientAttachments={data.attachments ?? []}
        onEdit={() => setEditOpen(true)}
        onSelectOffer={handleSelectOffer}
        selectingOffer={selectingOffer}
        selectedOfferId={selectedOfferId}
        onDesignerClick={(name) => navigate(`/designers/${encodeURIComponent(name)}`)}
      />
    </>
  );
}

export default RequestDetailsPage;
