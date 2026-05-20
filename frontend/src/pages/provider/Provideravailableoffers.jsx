import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ProviderSidebar from "../../components/ProviderSidebar";
import { Search, Briefcase, DollarSign, Clock, ArrowRight } from "lucide-react";

const C = {
  dark: "#2C221A", mid: "#3D3128", sand: "#D4C4B0",
  stone: "#8C7B6B", muted: "#B0A090", border: "#E2D8CE",
  bg: "#F5F0EA", sec: "#F7F3EF", card: "#FFFFFF",
  accent: "#C9902A",
};
const f = { font: "'Jost', sans-serif", serif: "'Cormorant Garamond', serif" };

const WORK_TYPES = ["Carpentry", "Painting", "Flooring", "Electrical", "Plumbing", "HVAC", "General Contracting", "Other"];

const SkeletonCard = () => (
  <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 16, padding: "22px", display: "flex", flexDirection: "column", gap: 14 }}>
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div style={{ height: 14, width: "45%", background: C.border, borderRadius: 4 }} />
      <div style={{ height: 22, width: 80, background: C.border, borderRadius: 20 }} />
    </div>
    <div style={{ height: 10, width: "30%", background: C.border, borderRadius: 4 }} />
    <div style={{ height: 10, width: "60%", background: C.border, borderRadius: 4 }} />
    <div style={{ height: 0.5, background: C.border }} />
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div style={{ height: 10, width: "25%", background: C.border, borderRadius: 4 }} />
      <div style={{ height: 32, width: 100, background: C.border, borderRadius: 8 }} />
    </div>
  </div>
);

const OfferCard = ({ offer, onView }) => {
  const [hovered, setHovered] = useState(false);
  const { work_type, description, budget, duration, notes, request_id, designer_name } = offer;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.card,
        border: `0.5px solid ${hovered ? C.stone : C.border}`,
        borderRadius: 16, overflow: "hidden",
        transition: "all .2s",
        boxShadow: hovered ? "0 8px 32px rgba(44,34,26,0.10)" : "none",
      }}
    >
      {/* Accent bar */}
      <div style={{ height: 3, background: hovered ? `linear-gradient(90deg, ${C.accent}, ${C.stone})` : C.border, transition: "background .2s" }} />

      <div style={{ padding: "20px 22px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12, gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: hovered ? C.dark : C.sand, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background .2s" }}>
              <Briefcase size={15} strokeWidth={1.5} color={hovered ? C.sand : C.stone} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: C.dark, fontFamily: f.font }}>{work_type}</div>
              <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>Request #{request_id}</div>
            </div>
          </div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, fontSize: 10, background: "rgba(201,144,42,0.10)", color: C.accent, whiteSpace: "nowrap", fontFamily: f.font }}>
            Open
          </span>
        </div>

        {/* Description */}
        {description && (
          <p style={{ fontSize: 12, color: C.stone, fontWeight: 300, lineHeight: 1.7, marginBottom: 14 }}>
            {description.length > 100 ? description.slice(0, 100) + "..." : description}
          </p>
        )}

        {/* Meta */}
        <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: C.stone }}>
            <DollarSign size={11} strokeWidth={1.5} />
            {budget ? Number(budget).toLocaleString() : "—"} SAR
          </div>
          {duration && (
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: C.stone }}>
              <Clock size={11} strokeWidth={1.5} />
              {duration}
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ height: "0.5px", background: C.border, marginBottom: 14 }} />

        {/* Action */}
        <button
          onClick={() => onView(offer)}
          style={{
            width: "100%", padding: "11px", borderRadius: 10,
            border: `0.5px solid ${hovered ? C.dark : C.border}`,
            background: hovered ? C.dark : "transparent",
            color: hovered ? C.sand : C.stone,
            fontSize: 10, fontWeight: 500, fontFamily: f.font,
            letterSpacing: ".12em", textTransform: "uppercase",
            cursor: "pointer", transition: "all .2s",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          View & Respond
          <ArrowRight size={11} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
};

export default function ProviderAvailableOffers() {
  const navigate = useNavigate();
  const [offers, setOffers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery]     = useState("");
  const [filterType, setFilterType] = useState("");

  const provider = JSON.parse(localStorage.getItem("user") || "{}");
  const initials = provider?.name?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?";

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://127.0.0.1:5000/contractor-offers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          const all = data.offers ?? data ?? [];
          // فقط العروض المفتوحة (pending)
          setOffers(all.filter(o => o.status === "pending"));
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return offers.filter(o => {
      const matchSearch = !q || o.work_type?.toLowerCase().includes(q) || o.description?.toLowerCase().includes(q);
      const matchType   = !filterType || o.work_type === filterType;
      return matchSearch && matchType;
    });
  }, [offers, query, filterType]);

  const selSt = {
    padding: "8px 28px 8px 12px", borderRadius: 8,
    border: `0.5px solid ${C.border}`, background: C.card,
    color: C.stone, fontSize: 11, fontFamily: f.font,
    cursor: "pointer", outline: "none", appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23B0A090' stroke-width='1.2' stroke-linecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center",
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; } body { margin: 0; }
        ::placeholder { color: rgba(176,160,144,0.5); font-size: 12px; font-weight: 300; }
        .po-search:focus { outline: none; border-color: #8C7B6B !important; box-shadow: 0 0 0 3px rgba(140,123,107,0.08); }
        .po-sel:focus { outline: none; border-color: #8C7B6B !important; }
      `}</style>

      <div style={{ display: "flex", height: "100vh", fontFamily: f.font, background: C.bg }}>
        <ProviderSidebar variant="light" />

        <main style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }}>

          {/* Top bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
            <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.16em", color: C.muted, textTransform: "uppercase" }}>
              PROVIDER PORTAL
            </div>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: f.serif, fontSize: 14, fontWeight: 600, color: C.sand }}>
              {initials}
            </div>
          </div>

          {/* Header */}
          <h1 style={{ fontFamily: f.serif, fontSize: 36, fontWeight: 400, color: C.dark, marginBottom: 8, lineHeight: 1.15 }}>
            Available Offers
          </h1>
          <p style={{ fontSize: 13, color: C.muted, fontWeight: 300, marginBottom: 28, lineHeight: 1.75, maxWidth: 480 }}>
            Browse open work offers from designers — review the details,<br />
            <span style={{ color: C.stone }}>accept what fits your expertise, and grow your portfolio.</span>
          </p>

          {/* Search + Filter */}
          <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: "14px 18px", marginBottom: 24, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <Search size={13} strokeWidth={1.5} color={C.muted} style={{ flexShrink: 0 }} />
            <input
              className="po-search"
              type="text"
              placeholder="Search by work type or description..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{ flex: 1, minWidth: 180, border: "none", background: "transparent", fontSize: 12, fontFamily: f.font, color: C.dark, outline: "none" }}
            />
            <select className="po-sel" value={filterType} onChange={e => setFilterType(e.target.value)} style={selSt}>
              <option value="">All Types</option>
              {WORK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {(query || filterType) && (
              <button onClick={() => { setQuery(""); setFilterType(""); }}
                style={{ padding: "8px 14px", borderRadius: 8, border: `0.5px solid ${C.border}`, background: "transparent", color: C.muted, fontSize: 11, fontFamily: f.font, cursor: "pointer" }}>
                Clear
              </button>
            )}
            {!loading && (
              <span style={{ fontSize: 11, color: C.muted, marginLeft: "auto", whiteSpace: "nowrap" }}>
                {filtered.length} offer{filtered.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Cards */}
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 16 }}>
              {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 24px", textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: C.card, border: `0.5px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: C.muted, marginBottom: 16 }}>◫</div>
              <div style={{ fontFamily: f.serif, fontSize: 22, fontWeight: 300, color: C.dark, marginBottom: 8 }}>
                {query || filterType ? "No matching offers." : "No offers available yet."}
              </div>
              <div style={{ fontSize: 12, color: C.muted, fontWeight: 300, lineHeight: 1.7, maxWidth: 260 }}>
                {query || filterType ? "Try adjusting your search." : "Check back later for new offers from designers."}
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 16 }}>
              {filtered.map(o => <OfferCard key={o.id} offer={o} onView={o => navigate(`/provider/offers/${o.id}`)} />)}
            </div>
          )}

        </main>
      </div>
    </>
  );
}