import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DesignerSidebar from "../../components/DesignerSidebar";
import { Search, Clock, ArrowRight, Layers, DollarSign } from "lucide-react";

const C = {
  dark: "#2C221A", mid: "#3D3128", sand: "#D4C4B0",
  stone: "#8C7B6B", muted: "#B0A090", border: "#E2D8CE",
  bg: "#F5F0EA", sec: "#F7F3EF", card: "#FFFFFF",
  accent: "#C9902A",
};
const f = { font: "'Jost', sans-serif", serif: "'Cormorant Garamond', serif" };

const STATUS = {
  in_progress:          { label: "In Progress",  bg: "rgba(201,125,78,0.10)",  color: "#9B5E2A", dot: "#C97D4E" },
  execution_plan_ready: { label: "Plan Ready",   bg: "rgba(92,112,87,0.10)",   color: "#4A6645", dot: "#5C7057" },
  offers_ready:         { label: "Offers Ready", bg: "rgba(44,34,26,0.08)",    color: "#2C221A", dot: "#3D3128" },
  completed:            { label: "Completed",    bg: "rgba(140,123,107,0.10)", color: "#6B5C4E", dot: "#8C7B6B" },
};

const StatusBadge = ({ status }) => {
  const s = STATUS[status] || STATUS.in_progress;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, fontSize: 10, fontFamily: f.font, letterSpacing: ".06em", background: s.bg, color: s.color, whiteSpace: "nowrap" }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      {s.label}
    </span>
  );
};

const SkeletonCard = () => (
  <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 16, padding: "24px", display: "flex", flexDirection: "column", gap: 14 }}>
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div style={{ height: 16, width: "50%", background: C.border, borderRadius: 4 }} />
      <div style={{ height: 22, width: 80, background: C.border, borderRadius: 20 }} />
    </div>
    <div style={{ height: 10, width: "30%", background: C.border, borderRadius: 4 }} />
    <div style={{ height: 0.5, background: C.border }} />
    <div style={{ display: "flex", gap: 20 }}>
      {[1, 2, 3].map(i => <div key={i} style={{ height: 10, width: 80, background: C.border, borderRadius: 4 }} />)}
    </div>
    <div style={{ height: 36, background: C.border, borderRadius: 8 }} />
  </div>
);

const RequestCard = ({ request, onManage }) => {
  const { client_name, space_type, preferred_style, budget, status, service_type, duration, created_at } = request;
  const ini = (client_name || "?").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  const [hovered, setHovered] = useState(false);

  const fmt = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.card,
        border: `0.5px solid ${hovered ? C.stone : C.border}`,
        borderRadius: 16,
        overflow: "hidden",
        transition: "all .2s",
        boxShadow: hovered ? "0 8px 32px rgba(44,34,26,0.10)" : "none",
      }}
    >
      {/* Top accent bar */}
      <div style={{ height: 3, background: hovered ? `linear-gradient(90deg, ${C.accent}, ${C.stone})` : C.border, transition: "background .2s" }} />

      <div style={{ padding: "20px 22px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6, gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: hovered ? C.dark : C.sand, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background .2s", border: `0.5px solid ${C.border}` }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: hovered ? C.sand : C.dark, fontFamily: f.serif, transition: "color .2s" }}>{ini}</span>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: C.dark, fontFamily: f.font }}>{client_name || "Anonymous"}</div>
              <div style={{ fontSize: 10, color: C.muted, marginTop: 1 }}>Since {fmt(created_at)}</div>
            </div>
          </div>
          <StatusBadge status={status} />
        </div>

        {/* Title */}
        <div style={{ fontFamily: f.serif, fontSize: 20, fontWeight: 400, color: C.dark, margin: "12px 0 14px", lineHeight: 1.2 }}>
          {space_type} {service_type ? `· ${service_type}` : "Design"}
        </div>

        {/* Meta row */}
        <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: C.stone }}>
            <Layers size={11} strokeWidth={1.5} />
            {preferred_style || "—"}
          </div>
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
        <div style={{ height: "0.5px", background: C.border, marginBottom: 16 }} />

        {/* Action */}
        <button
          onClick={() => onManage(request)}
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
          Manage Plan & Offers
          <ArrowRight size={11} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
};

export default function ManageRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const designer = JSON.parse(localStorage.getItem("user") || "{}");
  const initials = designer?.name?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?";

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://127.0.0.1:5000/design-requests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          const all = data.design_requests ?? data.requests ?? data ?? [];
          // ✅ فقط الطلبات المقبولة (in_progress وما بعدها)
          setRequests(all.filter(r => !["pending", "rejected"].includes(r.status)));
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return requests;
    return requests.filter(r =>
      r.client_name?.toLowerCase().includes(q) ||
      r.space_type?.toLowerCase().includes(q) ||
      r.preferred_style?.toLowerCase().includes(q)
    );
  }, [requests, query]);

  const onManage = (r) => navigate(`/designer/requests/${r.id}/create-plan`);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; } body { margin: 0; }
        ::placeholder { color: rgba(176,160,144,0.5); font-size: 12px; font-weight: 300; }
        .mn-search:focus { outline: none; border-color: #8C7B6B !important; box-shadow: 0 0 0 3px rgba(140,123,107,0.08); }
      `}</style>

      <div style={{ display: "flex", height: "100vh", fontFamily: f.font, background: C.bg }}>
        <DesignerSidebar variant="light" />

        <main style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }}>

          {/* Top bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
            <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.16em", color: C.muted, textTransform: "uppercase" }}>
              DESIGNER PORTAL
            </div>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: f.serif, fontSize: 14, fontWeight: 600, color: C.sand }}>
              {initials}
            </div>
          </div>

          {/* Header */}
          <h1 style={{ fontFamily: f.serif, fontSize: 36, fontWeight: 400, color: C.dark, marginBottom: 8, lineHeight: 1.15 }}>
            Manage Projects
          </h1>
          <p style={{ fontSize: 13, color: C.muted, fontWeight: 300, marginBottom: 28, lineHeight: 1.75, maxWidth: 480 }}>
            Track your active projects — update design plans, review contractor offers,<br />
            <span style={{ color: C.stone }}>and send curated proposals to your clients.</span>
          </p>

          {/* Search */}
          <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: "14px 18px", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
            <Search size={13} strokeWidth={1.5} color={C.muted} style={{ flexShrink: 0 }} />
            <input
              className="mn-search"
              type="text"
              placeholder="Search by client, space, or style..."
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
              {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 24px", textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: C.card, border: `0.5px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: C.muted, marginBottom: 16 }}>◫</div>
              <div style={{ fontFamily: f.serif, fontSize: 22, fontWeight: 300, color: C.dark, marginBottom: 8 }}>
                {query ? "No matching projects." : "No active projects yet."}
              </div>
              <div style={{ fontSize: 12, color: C.muted, fontWeight: 300, lineHeight: 1.7, maxWidth: 260 }}>
                {query ? "Try a different search." : "Accept a request to start managing projects here."}
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
              {filtered.map(r => <RequestCard key={r.id} request={r} onManage={onManage} />)}
            </div>
          )}

        </main>
      </div>
    </>
  );
}
