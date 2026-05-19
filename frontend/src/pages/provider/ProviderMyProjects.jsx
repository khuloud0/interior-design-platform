import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ProviderSidebar from "../../components/ProviderSidebar";
import { Search, Briefcase, DollarSign, Clock, ArrowRight } from "lucide-react";

const C = {
  dark: "#2C221A", mid: "#3D3128", sand: "#D4C4B0",
  stone: "#8C7B6B", muted: "#B0A090", border: "#E2D8CE",
  bg: "#F5F0EA", sec: "#F7F3EF", card: "#FFFFFF",
  accent: "#C9902A", success: "#4A6645",
};
const f = { font: "'Jost', sans-serif", serif: "'Cormorant Garamond', serif" };

// ✅ حالات العرض عند المقاول بمسميات واضحة
const STATUS = {
  submitted: {
    label: "Awaiting Client",         // وافق المقاول — بانتظار اختيار العميل
    bg:    "rgba(201,144,42,0.10)",
    color: "#9B5E2A",
    dot:   "#C9902A",
  },
  active: {
    label: "Active Project",          // اختاره العميل — مشروع فعلي
    bg:    "rgba(74,102,69,0.10)",
    color: "#4A6645",
    dot:   "#5C7057",
  },
  declined: {
    label: "Declined",                // رفضه المقاول
    bg:    "rgba(176,80,48,0.08)",
    color: "#B05030",
    dot:   "#C97D4E",
  },
};

const StatusBadge = ({ status }) => {
  const s = STATUS[status] || STATUS.submitted;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, fontSize: 10, fontFamily: f.font, letterSpacing: ".06em", background: s.bg, color: s.color, whiteSpace: "nowrap" }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.dot }} />
      {s.label}
    </span>
  );
};

const SkeletonCard = () => (
  <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 16, padding: "22px", display: "flex", flexDirection: "column", gap: 14 }}>
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div style={{ height: 14, width: "45%", background: C.border, borderRadius: 4 }} />
      <div style={{ height: 22, width: 80, background: C.border, borderRadius: 20 }} />
    </div>
    <div style={{ height: 10, width: "30%", background: C.border, borderRadius: 4 }} />
    <div style={{ height: 10, width: "60%", background: C.border, borderRadius: 4 }} />
    <div style={{ height: 0.5, background: C.border }} />
    <div style={{ height: 36, background: C.border, borderRadius: 8 }} />
  </div>
);

const ProjectCard = ({ offer, onView }) => {
  const [hovered, setHovered] = useState(false);
  const { work_type, description, budget, duration, request_id, designer_name, created_at, status } = offer;
  const isActive = status === "active";

  const fmt = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

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
      {/* Accent bar — أخضر للمشاريع الفعلية، ذهبي للمنتظرة */}
      <div style={{
        height: 3,
        background: hovered
          ? `linear-gradient(90deg, ${isActive ? C.success : C.accent}, ${C.stone})`
          : isActive ? "rgba(74,102,69,0.3)" : "rgba(201,144,42,0.3)",
        transition: "background .2s",
      }} />

      <div style={{ padding: "20px 22px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12, gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: hovered ? C.dark : isActive ? "rgba(74,102,69,0.12)" : "rgba(201,144,42,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background .2s" }}>
              <Briefcase size={15} strokeWidth={1.5} color={hovered ? C.sand : isActive ? C.success : C.accent} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: C.dark, fontFamily: f.font }}>{work_type}</div>
              <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>Request #{request_id}</div>
            </div>
          </div>
          <StatusBadge status={status} />
        </div>

        {/* Description */}
        {description && (
          <p style={{ fontSize: 12, color: C.stone, fontWeight: 300, lineHeight: 1.7, marginBottom: 14 }}>
            {description.length > 100 ? description.slice(0, 100) + "..." : description}
          </p>
        )}

        {/* Designer */}
        {designer_name && (
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 14 }}>
            Designer: <span style={{ color: C.stone }}>{designer_name}</span>
          </div>
        )}

        {/* Meta */}
        <div style={{ display: "flex", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
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

        <div style={{ fontSize: 10, color: C.muted, marginBottom: 14 }}>Submitted on {fmt(created_at)}</div>

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
          View Details
          <ArrowRight size={11} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
};

export default function ProviderMyProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [query, setQuery]       = useState("");

  const provider = JSON.parse(localStorage.getItem("user") || "{}");
  const initials = provider?.name?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?";

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        // ✅ نجلب العروض اللي وافق عليها المقاول (submitted) والمشاريع الفعلية (active)
        const [resSubmitted, resActive] = await Promise.all([
          fetch(`http://127.0.0.1:5000/contractor-offers?provider_id=${provider?.id}&status=submitted`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`http://127.0.0.1:5000/contractor-offers?provider_id=${provider?.id}&status=active`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        const [dataSubmitted, dataActive] = await Promise.all([resSubmitted.json(), resActive.json()]);
        const all = [
          ...(dataSubmitted.offers ?? []),
          ...(dataActive.offers ?? []),
        ];
        setProjects(all);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return projects;
    return projects.filter(o =>
      o.work_type?.toLowerCase().includes(q) ||
      o.description?.toLowerCase().includes(q) ||
      o.designer_name?.toLowerCase().includes(q)
    );
  }, [projects, query]);

  // إحصائيات سريعة
  const awaitingCount = projects.filter(p => p.status === "submitted").length;
  const activeCount   = projects.filter(p => p.status === "active").length;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; } body { margin: 0; }
        ::placeholder { color: rgba(176,160,144,0.5); font-size: 12px; font-weight: 300; }
        .pp-search:focus { outline: none; border-color: #8C7B6B !important; box-shadow: 0 0 0 3px rgba(140,123,107,0.08); }
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
            My Projects
          </h1>
          <p style={{ fontSize: 13, color: C.muted, fontWeight: 300, marginBottom: 20, lineHeight: 1.75, maxWidth: 480 }}>
            Track everything you've submitted — awaiting client selection<br />
            <span style={{ color: C.stone }}>or already confirmed as active projects.</span>
          </p>

          {/* Stats */}
          {!loading && projects.length > 0 && (
            <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
              <div style={{ padding: "10px 18px", borderRadius: 10, background: "rgba(201,144,42,0.08)", border: "0.5px solid rgba(201,144,42,0.2)" }}>
                <span style={{ fontSize: 10, color: C.accent, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Awaiting Client — {awaitingCount}
                </span>
              </div>
              <div style={{ padding: "10px 18px", borderRadius: 10, background: "rgba(74,102,69,0.08)", border: "0.5px solid rgba(74,102,69,0.2)" }}>
                <span style={{ fontSize: 10, color: C.success, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Active Projects — {activeCount}
                </span>
              </div>
            </div>
          )}

          {/* Search */}
          <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: "14px 18px", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
            <Search size={13} strokeWidth={1.5} color={C.muted} style={{ flexShrink: 0 }} />
            <input
              className="pp-search"
              type="text"
              placeholder="Search by work type or designer..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{ flex: 1, border: "none", background: "transparent", fontSize: 12, fontFamily: f.font, color: C.dark, outline: "none" }}
            />
            {!loading && (
              <span style={{ fontSize: 11, color: C.muted, whiteSpace: "nowrap" }}>
                {filtered.length} project{filtered.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Cards */}
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 16 }}>
              {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 24px", textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: C.card, border: `0.5px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: C.muted, marginBottom: 16 }}>◫</div>
              <div style={{ fontFamily: f.serif, fontSize: 22, fontWeight: 300, color: C.dark, marginBottom: 8 }}>
                {query ? "No matching projects." : "No projects yet."}
              </div>
              <div style={{ fontSize: 12, color: C.muted, fontWeight: 300, lineHeight: 1.7, maxWidth: 260 }}>
                {query ? "Try a different search." : "Accept an offer to start your first project."}
              </div>
              {!query && (
                <button onClick={() => navigate("/provider/offers")}
                  style={{ marginTop: 20, padding: "10px 24px", borderRadius: 8, border: "none", background: C.dark, color: C.sand, fontSize: 11, fontFamily: f.font, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", cursor: "pointer" }}>
                  Browse Offers →
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 16 }}>
              {filtered.map(o => (
                <ProjectCard key={o.id} offer={o} onView={o => navigate(`/provider/offers/${o.id}`)} />
              ))}
            </div>
          )}

        </main>
      </div>
    </>
  );
}