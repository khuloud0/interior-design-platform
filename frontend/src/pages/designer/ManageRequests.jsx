import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DesignerSidebar from "../../components/DesignerSidebar";
import { Search, SlidersHorizontal, Clock, DollarSign, ArrowRight } from "lucide-react";

const C = {
  dark: "#2C221A", mid: "#3D3128", sand: "#D4C4B0",
  stone: "#8C7B6B", muted: "#B0A090", border: "#C8B8A8",
  bg: "#F5F0EA", sec: "#F7F3EF", card: "#FFFFFF",
  accent: "#C9902A",
};
const f = { font: "'Jost', sans-serif", serif: "'Cormorant Garamond', serif" };

const STATUS = {
  in_progress:          { label: "In Progress",  bg: "rgba(201,125,78,0.10)",  color: "#9B5E2A", dot: "#C97D4E", accent: "#C97D4E" },
  execution_plan_ready: { label: "Plan Ready",   bg: "rgba(30,107,94,0.10)",   color: "#1E6B5E", dot: "#1E6B5E", accent: "#1E6B5E" },
  offers_ready:         { label: "Offers Ready", bg: "rgba(74,102,69,0.12)",   color: "#4A6645", dot: "#5C7057", accent: "#4A6645" },
  completed:            { label: "Completed",    bg: "rgba(44,34,26,0.10)",    color: "#2C221A", dot: "#3D3128", accent: "#2C221A" },
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
  <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
    <div style={{ height: 4, background: C.border }} />
    <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ height: 14, width: "45%", background: C.border, borderRadius: 4 }} />
        <div style={{ height: 22, width: 80, background: C.border, borderRadius: 20 }} />
      </div>
      <div style={{ height: 10, width: "30%", background: C.border, borderRadius: 4 }} />
      <div style={{ height: 0.5, background: C.border }} />
      <div style={{ height: 36, background: C.border, borderRadius: 8 }} />
    </div>
  </div>
);

const RequestCard = ({ request, onManage }) => {
  const { client_name, space_type, preferred_style, budget, status, service_type, duration } = request;
  const ini = (client_name || "?").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  const s = STATUS[status] || STATUS.in_progress;
  const [hovered, setHovered] = useState(false);
  const isCompleted = status === "completed";

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
      <div style={{ height: 4, background: hovered ? s.accent : `${s.accent}80`, transition: "background .2s" }} />

      <div style={{ padding: "18px 20px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10, gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: hovered ? C.dark : C.sand, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background .2s", border: `0.5px solid ${C.border}` }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: hovered ? C.sand : C.dark, fontFamily: f.serif, transition: "color .2s" }}>{ini}</span>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: C.dark, fontFamily: f.font }}>{client_name || "Anonymous"}</div>
              <div style={{ fontSize: 10, color: C.muted, marginTop: 1 }}>{service_type || space_type}</div>
            </div>
          </div>
          <StatusBadge status={status} />
        </div>

        {/* Title */}
        <div style={{ fontFamily: f.serif, fontSize: 18, fontWeight: 400, color: C.dark, marginBottom: 12, lineHeight: 1.2 }}>
          {space_type} {preferred_style ? `· ${preferred_style}` : ""}
        </div>

        {/* Meta */}
        <div style={{ display: "flex", gap: 16, marginBottom: 14, flexWrap: "wrap" }}>
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

        {/* ✅ زر يتغير حسب الـ status */}
        <button
          onClick={() => onManage(request)}
          style={{
            width: "100%", padding: "10px", borderRadius: 10,
            border: `0.5px solid ${hovered ? (isCompleted ? C.stone : C.dark) : C.border}`,
            background: hovered ? (isCompleted ? C.sec : C.dark) : "transparent",
            color: hovered ? (isCompleted ? C.dark : C.sand) : C.stone,
            fontSize: 10, fontWeight: 500, fontFamily: f.font,
            letterSpacing: ".12em", textTransform: "uppercase",
            cursor: "pointer", transition: "all .2s",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          {isCompleted ? "View Project Summary" : "View Plan & Offers"}
          <ArrowRight size={11} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
};

export default function ManageRequests() {
  const navigate = useNavigate();
  const [requests, setRequests]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [query, setQuery]               = useState("");
  const [filterSpace, setFilterSpace]   = useState("");
  const [filterBudget, setFilterBudget] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

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
          setRequests(all.filter(r => !["pending", "rejected"].includes(r.status)));
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const spaceOptions = useMemo(() => [...new Set(requests.map(r => r.space_type).filter(Boolean))], [requests]);

  const budgetRanges = [
    { label: "Under 5,000",    min: 0,     max: 5000    },
    { label: "5,000 – 15,000", min: 5000,  max: 15000   },
    { label: "Above 15,000",   min: 15000, max: Infinity },
  ];

  const statusOptions = [
    { value: "in_progress",          label: "In Progress"  },
    { value: "execution_plan_ready", label: "Plan Ready"   },
    { value: "offers_ready",         label: "Offers Ready" },
    { value: "completed",            label: "Completed"    },
  ];

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return requests.filter(r => {
      const matchSearch = !q || r.client_name?.toLowerCase().includes(q) || r.space_type?.toLowerCase().includes(q) || r.preferred_style?.toLowerCase().includes(q);
      const matchSpace  = !filterSpace  || r.space_type === filterSpace;
      const matchStatus = !filterStatus || r.status === filterStatus;
      const matchBudget = !filterBudget || (() => {
        const range = budgetRanges.find(b => b.label === filterBudget);
        return range ? Number(r.budget) >= range.min && Number(r.budget) < range.max : true;
      })();
      return matchSearch && matchSpace && matchStatus && matchBudget;
    });
  }, [requests, query, filterSpace, filterStatus, filterBudget]);

  const hasFilters = query || filterSpace || filterBudget || filterStatus;
  const clearFilters = () => { setQuery(""); setFilterSpace(""); setFilterBudget(""); setFilterStatus(""); };
  const onManage = (r) => navigate(`/designer/requests/${r.id}/create-plan`);

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
        .mn-search:focus { outline: none; border-color: #8C7B6B !important; box-shadow: 0 0 0 3px rgba(140,123,107,0.08); }
        .mn-sel:focus { outline: none; border-color: #8C7B6B !important; }
      `}</style>

      <div style={{ display: "flex", height: "100vh", fontFamily: f.font, background: C.bg }}>
        <DesignerSidebar variant="light" />

        <main style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }}>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
            <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.16em", color: C.muted, textTransform: "uppercase" }}>DESIGNER PORTAL</div>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: f.serif, fontSize: 14, fontWeight: 600, color: C.sand }}>{initials}</div>
          </div>

          <h1 style={{ fontFamily: f.serif, fontSize: 36, fontWeight: 400, color: C.dark, marginBottom: 8, lineHeight: 1.15 }}>
            Manage Projects
          </h1>
          <p style={{ fontSize: 13, color: C.muted, fontWeight: 300, marginBottom: 28, lineHeight: 1.75, maxWidth: 480 }}>
            Track your active projects — update design plans, review contractor offers,<br />
            <span style={{ color: C.stone }}>and send curated proposals to your clients.</span>
          </p>

          {/* Search + Filters */}
          <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: "16px 20px", marginBottom: 24, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
              <Search size={13} strokeWidth={1.5} color={C.muted} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
              <input className="mn-search" type="text" placeholder="Search by client, space, or style..." value={query} onChange={e => setQuery(e.target.value)}
                style={{ width: "100%", padding: "8px 12px 8px 32px", background: C.sec, border: `0.5px solid ${C.border}`, borderRadius: 8, fontSize: 11, fontFamily: f.font, fontWeight: 300, color: C.dark, transition: "all .15s" }} />
            </div>
            <SlidersHorizontal size={13} strokeWidth={1.5} color={C.muted} />
            <select className="mn-sel" value={filterSpace} onChange={e => setFilterSpace(e.target.value)} style={selSt}>
              <option value="">All Spaces</option>
              {spaceOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="mn-sel" value={filterBudget} onChange={e => setFilterBudget(e.target.value)} style={selSt}>
              <option value="">All Budgets</option>
              {budgetRanges.map(b => <option key={b.label} value={b.label}>{b.label}</option>)}
            </select>
            <select className="mn-sel" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={selSt}>
              <option value="">All Statuses</option>
              {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            {hasFilters && (
              <button onClick={clearFilters}
                style={{ padding: "8px 14px", borderRadius: 8, border: `0.5px solid ${C.border}`, background: "transparent", color: C.muted, fontSize: 11, fontFamily: f.font, cursor: "pointer" }}>
                Clear
              </button>
            )}
            <div style={{ fontSize: 11, color: C.muted, marginLeft: "auto", whiteSpace: "nowrap" }}>
              {!loading && `${filtered.length} project${filtered.length !== 1 ? "s" : ""}`}
            </div>
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
                {hasFilters ? "No matching projects." : "No active projects yet."}
              </div>
              <div style={{ fontSize: 12, color: C.muted, fontWeight: 300, lineHeight: 1.7, maxWidth: 260 }}>
                {hasFilters ? "Try adjusting your filters." : "Accept a request to start managing projects here."}
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