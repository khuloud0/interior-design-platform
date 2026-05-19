import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ClientSidebar from "../../components/ClientSidebar";
import CreateRequestModal from "../../components/CreateRequestModal";

const C = {
  dark: "#2C2720", mid: "#4A4540", sand: "#C4A882",
  stone: "#7A7068", muted: "#7A7068", border: "#E8E0D5",
  bg: "#F5F2ED", sec: "#FAF7F4", card: "#FFFFFF",
};
const f = { sans: "'Jost', sans-serif", serif: "'Cormorant Garamond', serif" };

const initials = (name = "") => name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?";

const EmptyPortfolio = () => (
  <div style={{ border: `0.5px solid ${C.border}`, borderRadius: 12, padding: "48px 24px", textAlign: "center", background: C.sec }}>
    <div style={{ width: 44, height: 44, borderRadius: 12, background: C.card, border: `0.5px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="1.2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
    </div>
    <div style={{ fontSize: 18, fontWeight: 300, color: C.dark, marginBottom: 6 }}>No portfolio yet</div>
    <div style={{ fontSize: 12, color: C.muted, fontWeight: 300, lineHeight: 1.7 }}>This designer hasn't uploaded any work yet.</div>
  </div>
);

const PortfolioImage = ({ url, index }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ borderRadius: 8, overflow: "hidden", height: index === 0 ? 200 : 96, background: C.sec, cursor: "pointer", gridColumn: index === 0 ? "1 / -1" : "auto" }}>
      <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .45s, filter .3s", transform: hovered ? "scale(1.04)" : "scale(1)", filter: hovered ? "brightness(.75)" : "brightness(.94)" }} />
    </div>
  );
};

export default function DesignerProfile() {
  const { slug }    = useParams();
  const navigate    = useNavigate();
  const [designer, setDesigner] = React.useState(null);
  const [error, setError]       = React.useState("");
  const [loading, setLoading]   = React.useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  React.useEffect(() => {
    setLoading(true); setError("");
    fetch(`http://127.0.0.1:5000/designers/${slug}`)
      .then(r => r.json().then(data => ({ ok: r.ok, data })))
      .then(({ ok, data }) => { if (!ok) { setError(data.error || "Designer not found"); return; } setDesigner(data); })
      .catch(() => setError("Failed to load designer profile."))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: f.sans, fontSize: 12, color: C.muted }}>Loading...</div>;
  if (error)   return <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: f.sans, fontSize: 12, color: C.muted }}>{error}</div>;

  const d = designer;
  const portfolioUrls = d?.portfolio_images ?? [];
  console.log("designer object:", d);
  console.log("designer user_id:", d.user_id);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } body { margin: 0; } .cta-btn:hover { background: #3D3128 !important; }`}</style>

      <div style={{ display: "flex", height: "100vh", fontFamily: f.sans, background: C.bg }}>
        <ClientSidebar variant="light" />

        <main style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>

          {/* Back button */}
          <div style={{ padding: "20px 40px 0", flexShrink: 0 }}>
            <button onClick={() => navigate("/designers")}
              style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: C.mid, fontSize: 12, fontFamily: f.sans, cursor: "pointer" }}>
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none"><path d="M7 1L1 6L7 11" stroke="#4A4540" strokeWidth="1.5" strokeLinecap="round"/></svg>
              Back to Explore Designers
            </button>
          </div>

          {/* Main content row */}
          <div style={{ display: "flex", flex: 1, minHeight: 0 }}>

            {/* ── LEFT CONTENT ── */}
            <div style={{ flex: 1, padding: "28px 40px 52px", overflowY: "auto", minWidth: 0 }}>

              {/* Avatar */}
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#E8E0D5", marginBottom: 20, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${C.border}` }}>
                {d.profile_image
                  ? <img src={d.profile_image} alt={d.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#B0A090" strokeWidth="1.2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>}
              </div>

              {/* Name */}
              <div style={{ fontSize: 42, fontWeight: 400, color: C.dark, marginBottom: 8, lineHeight: 1.1 }}>{d.name}</div>
              <div style={{ fontSize: 12, color: C.stone, marginBottom: 32 }}>{[d.specialty, d.city].filter(Boolean).join(" · ")}</div>

              {/* Stats */}
              <div style={{ display: "flex", gap: 80, marginBottom: 40 }}>
                {[
                  { val: d.completed_projects,    label: "PROJECTS" },
                  { val: d.rating?.toFixed(1),     label: "RATING" },
                  { val: `${d.years_experience}+`, label: "YEARS EXPERIENCE" },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ fontSize: 20, fontWeight: 400, color: C.dark, marginBottom: 4 }}>{s.val}</div>
                    <div style={{ fontSize: 11, color: C.stone, letterSpacing: "0.08em" }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ height: "0.5px", background: C.border, marginBottom: 32 }} />

              {/* About */}
              <div style={{ marginBottom: 36 }}>
                <div style={{ fontFamily: f.serif, fontSize: 22, fontWeight: 400, color: C.dark, marginBottom: 16 }}>ABOUT</div>
                <p style={{ fontSize: 13, color: C.mid, lineHeight: 1.85, maxWidth: 620 }}>{d.bio}</p>
              </div>

              <div style={{ height: "0.5px", background: C.border, marginBottom: 32 }} />

              {/* Services */}
              <div style={{ marginBottom: 36 }}>
                <div style={{ fontFamily: f.serif, fontSize: 22, fontWeight: 400, color: C.dark, marginBottom: 20 }}>SERVICES</div>
                <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
                  {d.service_types?.map(s => (
                    <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 36, height: 36, border: `1px solid ${C.stone}`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.stone} strokeWidth="1.3" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                      </div>
                      <span style={{ fontSize: 10, color: C.mid, textAlign: "center", maxWidth: 70 }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ height: "0.5px", background: C.border, marginBottom: 32 }} />

              {/* Styles & Spaces */}
              <div style={{ display: "flex", gap: 60, marginBottom: 36 }}>
                <div>
                  <div style={{ fontSize: 11, color: C.stone, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Styles</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {d.styles?.map((s, i) => (
                      <span key={s} style={{ padding: "5px 14px", borderRadius: 20, fontSize: 11, border: `0.5px solid ${i === 0 ? C.dark : C.border}`, background: i === 0 ? C.dark : "transparent", color: i === 0 ? C.bg : C.stone }}>{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: C.stone, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Spaces</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {d.space_types?.map(s => (
                      <span key={s} style={{ padding: "5px 14px", borderRadius: 20, fontSize: 11, border: `0.5px solid ${C.border}`, color: C.stone }}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ height: "0.5px", background: C.border, marginBottom: 32 }} />

              {/* Portfolio */}
              <div>
                <div style={{ fontFamily: f.serif, fontSize: 22, fontWeight: 400, color: C.dark, marginBottom: 16 }}>PORTFOLIO</div>
                {portfolioUrls.length === 0 ? <EmptyPortfolio /> : (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    {portfolioUrls.slice(0, 6).map((url, i) => <PortfolioImage key={i} url={url} index={i} />)}
                    {portfolioUrls.length > 6 && (
                      <div style={{ height: 96, borderRadius: 8, background: C.sec, border: `0.5px solid ${C.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, cursor: "pointer" }}>
                        <div style={{ fontSize: 20, color: C.dark, fontWeight: 300 }}>+{portfolioUrls.length - 6}</div>
                        <div style={{ fontSize: 9, color: C.muted, letterSpacing: ".12em", textTransform: "uppercase" }}>View All</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div style={{
              width: 380, flexShrink: 0,
              background: "rgba(212,196,176,0.35)",
              borderLeft: `0.5px solid ${C.border}`,
              position: "sticky", top: 0, height: "100%",
              overflowY: "auto",
              padding: "40px 40px 60px",
            }}>
              {/* Avatar — 140x140 */}
              <div style={{ width: 140, height: 140, borderRadius: "50%", background: "#E8E0D5", margin: "0 auto 32px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${C.border}` }}>
                {d.profile_image
                  ? <img src={d.profile_image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#B0A090" strokeWidth="1.2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>}
              </div>

              {/* Starting price */}
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: C.stone, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Starting Price</div>
                <div style={{ fontSize: 32, fontWeight: 400, color: C.dark }}>
                  {d.starting_price?.toLocaleString()} <span style={{ fontSize: 13, color: C.stone, fontWeight: 400 }}>SAR</span>
                </div>
              </div>

              <div style={{ height: "0.5px", background: C.border, marginBottom: 24 }} />

              {/* Details — label left, value right */}
              <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 32 }}>
                {[
                  { label: "Average Project Time", val: d.avg_project_time || "8 - 12 Weeks" },
                  { label: "Based In",              val: d.city || "Jeddah, Saudi Arabia" },
                  { label: "Languages",             val: d.languages?.join(", ") || "English, Hindi, Urdu" },
                ].map(row => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: C.stone }}>{row.label}</span>
                    <span style={{ fontSize: 12, color: C.dark, textAlign: "right" }}>{row.val}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button className="cta-btn" onClick={() => setModalOpen(true)}
                style={{ width: "100%", height: 44, border: "none", background: C.dark, color: "#F5F2ED", fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: f.sans, cursor: "pointer", transition: "background .15s", marginBottom: 40 }}>
                REQUEST A PROJECT
              </button>

              {/* Quote */}
              <div>
                <div style={{ fontSize: 36, color: C.sand, lineHeight: 1, marginBottom: 12 }}>"</div>
                <p style={{ fontSize: 13, color: C.mid, lineHeight: 1.75, marginBottom: 10 }}>
                  Good design is not just about beauty, it's about how it makes you feel.
                </p>
                <div style={{ fontSize: 12, color: C.stone }}>– {d.name}</div>
              </div>
            </div>

          </div>
        </main>
      </div>

      <CreateRequestModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => { setModalOpen(false); navigate("/dashboard"); }}
        mode="create"
        designerId={d.user_id}
      />
    </>
  );
}
