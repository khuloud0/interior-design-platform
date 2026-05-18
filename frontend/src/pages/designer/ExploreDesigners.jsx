import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ClientSidebar from "../../components/ClientSidebar";

// ── Design tokens ─────────────────────────────────────────────
const C = {
  dark:   "#2C221A",
  mid:    "#3D3128",
  sand:   "#D4C4B0",
  stone:  "#8C7B6B",
  muted:  "#B0A090",
  border: "#E8E0D4",
  bg:     "#F5F0EA",
  sec:    "#F7F3EF",
  card:   "#FFFFFF",
};
const f = {
  sans:  "'Jost', sans-serif",
  serif: "'Cormorant Garamond', serif",
};

// ── Helpers ────────────────────────────────────────────────────
const initials = (name = "") =>
  name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?";

// ── Mock data ─────────────────────────────────────────────────
const MOCK_DESIGNERS = [
  { id:1, slug:"sara-alharbi",     name:"Sara Al-Harbi",     specialty:"Industrial • Modern • Rustic", completed_projects:12, rating:4.7, years_experience:7,  starting_price:8000,  profile_image:null, portfolio_images:[] },
  { id:2, slug:"khalid-alotaibi",  name:"Khalid Al-Otaibi",  specialty:"Minimal • Functional",         completed_projects:27, rating:4.7, years_experience:10, starting_price:5000,  profile_image:null, portfolio_images:[] },
  { id:3, slug:"nora-aldosari",    name:"Nora Al-Dosari",    specialty:"Classic • Warmth • Heritage",  completed_projects:8,  rating:4.8, years_experience:4,  starting_price:6500,  profile_image:null, portfolio_images:[] },
  { id:4, slug:"faisal-alrashidi", name:"Faisal Al-Rashidi", specialty:"Contemporary • Majlis",        completed_projects:34, rating:5.0, years_experience:14, starting_price:12000, profile_image:null, portfolio_images:[] },
  { id:5, slug:"lama-alqahtani",   name:"Lama Al-Qahtani",   specialty:"Boho • Natural Living",        completed_projects:15, rating:4.6, years_experience:5,  starting_price:4000,  profile_image:null, portfolio_images:[] },
  { id:6, slug:"ahmed-alshehri",   name:"Ahmed Al-Shehri",   specialty:"Execution • Management",       completed_projects:51, rating:4.9, years_experience:18, starting_price:10000, profile_image:null, portfolio_images:[] },
];

// ── Skeleton ──────────────────────────────────────────────────
const SkeletonCard = () => (
  <div style={{
    background: C.card, border: `0.5px solid ${C.border}`,
    borderRadius: 16, padding: "18px 18px 14px",
    display: "flex", flexDirection: "column", gap: 14,
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div style={{ height: 17, width: "42%", background: C.border, borderRadius: 4 }} />
      <div style={{ height: 13, width: "28%", background: C.border, borderRadius: 4 }} />
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.border, flexShrink: 0 }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ height: 11, width: "65%", background: C.border, borderRadius: 3 }} />
        <div style={{ height: 10, width: "45%", background: C.border, borderRadius: 3 }} />
      </div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 5 }}>
      {[1,2,3].map(i => <div key={i} style={{ height: 52, background: C.border, borderRadius: 8 }} />)}
    </div>
    <div style={{ height: 38, background: C.border, borderRadius: 10 }} />
  </div>
);

// ── Empty portfolio slot ───────────────────────────────────────
const EmptySlot = () => (
  <div style={{
    height: 52, borderRadius: 8,
    background: C.sec, border: `0.5px dashed ${C.border}`,
    display: "flex", alignItems: "center", justifyContent: "center",
  }}>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.border} strokeWidth="1.2" strokeLinecap="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  </div>
);

// ── Designer Card ─────────────────────────────────────────────
const DesignerCard = ({ designer, onView }) => {
  const { name, specialty, completed_projects, rating, starting_price, profile_image, portfolio_images } = designer;
  const slots = [...(portfolio_images ?? []).slice(0, 3), null, null, null].slice(0, 3);

  return (
    <div
      style={{
        background: C.card, border: `0.5px solid ${C.border}`,
        borderRadius: 16, padding: "18px 18px 14px",
        display: "flex", flexDirection: "column", gap: 14,
        transition: "border-color .18s, box-shadow .18s, transform .18s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = C.stone;
        e.currentTarget.style.boxShadow = "0 6px 24px rgba(44,34,26,0.08)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = C.border;
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Row 1: Name + Starting at */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ fontFamily: f.serif, fontSize: 18, fontWeight: 400, color: C.dark, lineHeight: 1.2 }}>
          {name}
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 9, fontWeight: 400, color: C.muted, fontFamily: f.sans, letterSpacing: "0.04em", marginBottom: 1 }}>
            Starting at
          </div>
          <div style={{ fontFamily: f.serif, fontSize: 13, fontWeight: 400, color: C.dark }}>
            {starting_price.toLocaleString()} SAR
          </div>
        </div>
      </div>

      {/* Row 2: Avatar + Specialty + Stats */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
          overflow: "hidden", background: C.sand,
          display: "flex", alignItems: "center", justifyContent: "center",
          border: `0.5px solid ${C.border}`,
        }}>
          {profile_image
            ? <img src={profile_image} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <span style={{ fontFamily: f.serif, fontSize: 13, fontWeight: 400, color: C.dark }}>{initials(name)}</span>
          }
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 11, fontWeight: 300, color: C.stone, fontFamily: f.sans,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: 4,
          }}>
            {specialty}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <span style={{ color: "#C9A96E", fontSize: 11 }}>★</span>
              <span style={{ fontFamily: f.serif, fontSize: 13, color: C.dark }}>{rating.toFixed(1)}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="1.5" strokeLinecap="round">
                <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
              </svg>
              <span style={{ fontSize: 11, color: C.muted, fontFamily: f.sans, fontWeight: 300 }}>
                {completed_projects} Projects
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Portfolio strip */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 5 }}>
        {slots.map((url, i) =>
          url
            ? <div key={i} style={{ height: 52, borderRadius: 8, overflow: "hidden", background: C.sec }}>
                <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            : <EmptySlot key={i} />
        )}
      </div>

      {/* Row 4: CTA */}
      <button
        onClick={() => onView(designer)}
        style={{
          width: "100%", padding: "10px", border: "none", borderRadius: 10,
          background: C.dark, color: C.sand,
          fontSize: 10, fontWeight: 500, letterSpacing: "0.13em",
          textTransform: "uppercase", fontFamily: f.sans,
          cursor: "pointer", transition: "background .15s",
        }}
        onMouseEnter={e => e.currentTarget.style.background = C.mid}
        onMouseLeave={e => e.currentTarget.style.background = C.dark}
      >
        View Profile
      </button>
    </div>
  );
};

// ── Empty State ───────────────────────────────────────────────
const EmptyState = ({ onClear, hasQuery }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "72px 24px 80px" }}>
    <div style={{
      width: 80, height: 80, borderRadius: "50%",
      background: C.sec, border: `1px dashed ${C.border}`,
      display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24,
    }}>
      <svg width="32" height="32" viewBox="0 0 38 38" fill="none">
        <rect x="4" y="9" width="30" height="22" rx="3" stroke={C.border} strokeWidth="1.2"/>
        <circle cx="13" cy="17" r="3" stroke={C.border} strokeWidth="1.2"/>
        <path d="M4 25l7-5 5 4 5-6 9 8" stroke={C.border} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <circle cx="28" cy="9" r="5" fill={C.sec} stroke={C.border} strokeWidth="1.2"/>
        <path d="M28 7v4M26 9h4" stroke={C.border} strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    </div>
    <div style={{ fontFamily: f.serif, fontSize: 22, fontWeight: 400, color: C.dark, marginBottom: 8 }}>
      {hasQuery ? "No designers found" : "No designers yet"}
    </div>
    <p style={{ fontSize: 12.5, color: C.muted, fontWeight: 300, fontFamily: f.sans, lineHeight: 1.75, marginBottom: 24, maxWidth: 300 }}>
      {hasQuery
        ? "Try a different style, service, or space type."
        : "Be the first to join — or come back soon."}
    </p>
    {hasQuery && (
      <button
        onClick={onClear}
        style={{
          padding: "10px 22px", border: `0.5px solid ${C.border}`, borderRadius: 10,
          background: "#fff", color: C.stone, fontSize: 10.5, fontWeight: 500,
          letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: f.sans, cursor: "pointer",
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = C.stone}
        onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
      >
        Clear search
      </button>
    )}
  </div>
);

// ── Main ──────────────────────────────────────────────────────
export default function ExploreDesigners() {
  const navigate = useNavigate();
  const [designers, setDesigners] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [query, setQuery]         = useState("");

  const user     = JSON.parse(localStorage.getItem("user") || "{}");
  const userInit = user?.name?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?";

  useEffect(() => {
    setLoading(true);
    fetch("http://127.0.0.1:5000/designers")
      .then(r => r.json())
      .then(d => setDesigners(d.designers ?? []))
      .catch(() => setDesigners(MOCK_DESIGNERS))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return designers;
    const q = query.toLowerCase();
    return designers.filter(d =>
      d.specialty?.toLowerCase().includes(q) ||
      d.name?.toLowerCase().includes(q) ||
      d.styles?.some(s => s.toLowerCase().includes(q)) ||
      d.service_types?.some(s => s.toLowerCase().includes(q)) ||
      d.space_types?.some(s => s.toLowerCase().includes(q))
    );
  }, [designers, query]);

  const handleView = (d) => navigate(d.slug ? `/designers/${d.slug}` : `/designers/${d.id}`);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::placeholder { color: rgba(140,123,107,0.4); font-size: 12px; font-weight: 300; font-family: 'Jost', sans-serif; }
        .sw-search:focus { outline: none; border-color: #8C7B6B !important; box-shadow: 0 0 0 3px rgba(140,123,107,0.09); }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .card-in { animation: fadeUp .32s ease both; }
      `}</style>

      <div style={{ display: "flex", height: "100vh", fontFamily: f.sans, background: C.bg }}>
        <ClientSidebar variant="light" />

        <main style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>

          {/* Top bar */}
          <div style={{ padding: "32px 44px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.18em", color: C.muted, textTransform: "uppercase" }}>
              DESIGNER MARKETPLACE
            </div>
            <div style={{
              width: 34, height: 34, borderRadius: "50%", background: C.dark, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: f.serif, fontSize: 13, fontWeight: 600, color: C.sand,
            }}>
              {userInit}
            </div>
          </div>

          {/* Heading + Search */}
          <div style={{ padding: "22px 44px 26px" }}>
            <h1 style={{
              fontFamily: f.serif, fontSize: 42, fontWeight: 400, color: C.dark,
              marginBottom: 10, lineHeight: 1.1, letterSpacing: "-0.01em",
            }}>
              Explore Interior Designers
            </h1>
            <p style={{ fontSize: 14, color: C.stone, fontWeight: 300, lineHeight: 1.75, marginBottom: 20, maxWidth: 480 }}>
              Discover talented interior designers and find the perfect match for your dream space. Browse portfolios, reviews, and expertise to make an informed choice.
            </p>

            <div style={{ position: "relative", maxWidth: 460 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="1.5" strokeLinecap="round"
                style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                className="sw-search"
                type="text"
                placeholder="Search designers by name, specialty, or style…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                style={{
                  width: "100%", padding: "10px 14px 10px 34px",
                  background: "#fff", border: `0.5px solid ${C.border}`,
                  borderRadius: 10, fontSize: 12, fontFamily: f.sans,
                  fontWeight: 300, color: C.dark, transition: "border-color .15s, box-shadow .15s",
                }}
              />
            </div>
          </div>

          {/* Grid */}
          <div style={{ padding: "0 44px 52px" }}>
            {!loading && (
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 16, fontWeight: 300, letterSpacing: "0.03em" }}>
                {filtered.length} designer{filtered.length !== 1 ? "s" : ""} found
              </div>
            )}

            {loading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState onClear={() => setQuery("")} hasQuery={!!query.trim()} />
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                {filtered.map((d, i) => (
                  <div key={d.id} className="card-in" style={{ animationDelay: `${i * 0.05}s` }}>
                    <DesignerCard designer={d} onView={handleView} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
