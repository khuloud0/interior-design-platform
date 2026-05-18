import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DesignerSidebar from "../../components/DesignerSidebar";
import { Search, SlidersHorizontal } from "lucide-react";
const C = {
dark: "#2C221A", mid: "#3D3128", sand: "#D4C4B0",
stone: "#8C7B6B", muted: "#B0A090", border: "#E2D8CE",
bg: "#F5F0EA", sec: "#F7F3EF", card: "#FFFFFF",
};
const f = { font: "'Jost', sans-serif", serif: "'Cormorant Garamond', serif" };
const STATUS = {
pending:              { label: "Pending",      bg: "rgba(176,160,144,0.12)", color: "#8C7B6B", dot: "#B0A090" },
in_progress:          { label: "In Progress",  bg: "rgba(201,125,78,0.10)",  color: "#9B5E2A", dot: "#C97D4E" },
execution_plan_ready: { label: "Plan Ready",   bg: "rgba(92,112,87,0.10)",   color: "#4A6645", dot: "#5C7057" },
offers_ready:         { label: "Offers Ready", bg: "rgba(44,34,26,0.08)",    color: "#2C221A", dot: "#3D3128" },
completed:            { label: "Completed",    bg: "rgba(140,123,107,0.10)", color: "#6B5C4E", dot: "#8C7B6B" },
};
const StatusBadge = ({ status }) => {
const s = STATUS[status] || STATUS.pending;
return (
<span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, fontSize: 10, fontFamily: f.font, letterSpacing: ".06em", background: s.bg, color: s.color, whiteSpace: "nowrap" }}>
<span style={{ width: 5, height: 5, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
{s.label}
</span>
  );
};
const Tag = ({ label }) => (
<span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 10, letterSpacing: ".05em", fontFamily: f.font, border: `0.5px solid ${C.border}`, color: C.stone }}>
{label}
</span>
);
const SkeletonCard = () => (
<div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 14, padding: "20px", display: "flex", flexDirection: "column", gap: 12 }}>
<div style={{ display: "flex", justifyContent: "space-between" }}>
<div style={{ height: 14, width: "45%", background: C.border, borderRadius: 4 }} />
<div style={{ height: 20, width: 70, background: C.border, borderRadius: 20 }} />
</div>
<div style={{ height: 10, width: "30%", background: C.border, borderRadius: 4 }} />
<div style={{ display: "flex", gap: 6 }}>
{[80, 70].map(w => <div key={w} style={{ height: 22, width: w, background: C.border, borderRadius: 20 }} />)}
</div>
<div style={{ height: "0.5px", background: C.border }} />
<div style={{ display: "flex", justifyContent: "space-between" }}>
<div style={{ height: 10, width: "25%", background: C.border, borderRadius: 4 }} />
<div style={{ height: 32, width: 90, background: C.border, borderRadius: 8 }} />
</div>
</div>
);
const RequestCard = ({ request, onView }) => {
const { client_name, space_type, preferred_style, budget, status, created_at, profile_image } = request;
const ini = (client_name || "?").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
return (
<div
style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 14, overflow: "hidden", transition: "border-color .18s, box-shadow .18s", cursor: "pointer" }}
onMouseEnter={e => { e.currentTarget.style.borderColor = C.stone; e.currentTarget.style.boxShadow = "0 4px 20px rgba(44,34,26,0.08)"; }}
onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none"; }}
>
<div style={{ padding: "18px 18px 14px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
<div style={{ fontSize: 15, fontWeight: 500, color: C.dark, fontFamily: f.font }}>{client_name || "Anonymous"}</div>
<div style={{ textAlign: "right", flexShrink: 0 }}>
<div style={{ fontSize: 9, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>Budget</div>
<div style={{ fontSize: 13, fontWeight: 500, color: C.dark }}>
{budget ? Number(budget).toLocaleString() : "—"} SAR
</div>
</div>
</div>
<div style={{ padding: "0 18px 16px", display: "flex", alignItems: "center", gap: 10 }}>
<div style={{ width: 36, height: 36, borderRadius: "50%", background: C.sand, flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", border: `0.5px solid ${C.border}` }}>
{profile_image
? <img src={profile_image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
: <span style={{ fontSize: 12, fontWeight: 500, color: C.dark }}>{ini}</span>}
</div>
<div style={{ fontSize: 11, color: C.stone, fontWeight: 300 }}>
{[space_type, preferred_style].filter(Boolean).join(" · ")}
</div>
</div>
<div style={{ borderTop: `0.5px solid ${C.border}`, padding: "12px 18px", display: "flex", justifyContent: "flex-end" }}>
<button onClick={() => onView(request)}
style={{ padding: "7px 16px", border: "none", borderRadius: 8, background: C.dark, color: C.sand, fontSize: 10, fontWeight: 500, fontFamily: f.font, letterSpacing: ".12em", textTransform: "uppercase", cursor: "pointer", transition: "background .15s" }}
onMouseEnter={e => e.currentTarget.style.background = C.mid}
onMouseLeave={e => e.currentTarget.style.background = C.dark}>
          View Details
</button>
</div>
</div>
  );
};
export default function DesignerRequests() {
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
const fetch_ = async () => {
setLoading(true);
try {
const token = localStorage.getItem("token");
        // ✅ التعديل: endpoint صحيح + parsing صحيح للـ response
const res = await fetch("http://127.0.0.1:5000/design-requests", {
headers: { Authorization: `Bearer ${token}` },
        });
const data = await res.json();
if (res.ok) {
          const all = data.design_requests ?? data.requests ?? data ?? [];
          setRequests(all.filter(r => r.status !== "rejected"));
        }
      } catch (err) { console.error(err); }
finally { setLoading(false); }
    };
fetch_();
  }, []);
const spaceOptions = useMemo(() => [...new Set(requests.map(r => r.space_type).filter(Boolean))], [requests]);
const budgetRanges = [
    { label: "Under 5,000",    min: 0,     max: 5000    },
    { label: "5,000 – 15,000", min: 5000,  max: 15000   },
    { label: "Above 15,000",   min: 15000, max: Infinity },
  ];
const statusOptions = [
    { value: "pending",              label: "Pending"      },
    { value: "in_progress",          label: "In Progress"  },
    { value: "execution_plan_ready", label: "Plan Ready"   },
    { value: "offers_ready",         label: "Offers Ready" },
    { value: "completed",            label: "Completed"    },
  ];
const filtered = useMemo(() => requests.filter(r => {
const q = query.toLowerCase();
const matchSearch  = !q || r.preferred_style?.toLowerCase().includes(q) || r.space_type?.toLowerCase().includes(q) || r.client_name?.toLowerCase().includes(q);
const matchSpace   = !filterSpace  || r.space_type === filterSpace;
const matchStatus  = !filterStatus || r.status === filterStatus;
const matchBudget  = !filterBudget || (() => {
const range = budgetRanges.find(b => b.label === filterBudget);
return range ? Number(r.budget) >= range.min && Number(r.budget) < range.max : true;
    })();
return matchSearch && matchSpace && matchStatus && matchBudget;
  }), [requests, query, filterSpace, filterStatus, filterBudget]);
const hasFilters = query || filterSpace || filterBudget || filterStatus;
const clearFilters = () => { setQuery(""); setFilterSpace(""); setFilterBudget(""); setFilterStatus(""); };
const onView = (r) => navigate(`/designer/requests/${r.id}`);
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
        .sw-search:focus { outline: none; border-color: ${C.stone} !important; box-shadow: 0 0 0 3px rgba(140,123,107,0.08); }
        .sw-sel:focus { outline: none; border-color: ${C.stone} !important; }
      `}</style>
<div style={{ display: "flex", height: "100vh", fontFamily: f.font, background: C.bg }}>
<DesignerSidebar variant="light" />
<main style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }}>
<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
<div>
<div style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.16em", color: C.muted, textTransform: "uppercase", marginBottom: 4 }}>
                DESIGNER PORTAL
</div>
</div>
<div style={{ width: 36, height: 36, borderRadius: "50%", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: f.serif, fontSize: 14, fontWeight: 600, color: C.sand }}>
{initials}
</div>
</div>
<h1 style={{ fontFamily: f.serif, fontSize: 36, fontWeight: 400, color: C.dark, marginBottom: 8, lineHeight: 1.15 }}>
            Available Client Requests
</h1>
<p style={{ fontSize: 13, color: C.muted, fontWeight: 300, marginBottom: 24, lineHeight: 1.75, maxWidth: 520 }}>
            Explore fresh opportunities from clients eager for your unique style.<br />
            Review detailed requests, pick your next inspiration,<br />
<span style={{ color: C.stone }}>and let your creativity transform their spaces.</span>
</p>
<div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: "16px 20px", marginBottom: 20, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
<div style={{ position: "relative", flex: 1, minWidth: 200 }}>
<Search size={13} strokeWidth={1.5} color={C.muted} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
<input className="sw-search" type="text" placeholder="Search by style, space, or client..." value={query} onChange={e => setQuery(e.target.value)}
style={{ width: "100%", padding: "8px 12px 8px 32px", background: C.sec, border: `0.5px solid ${C.border}`, borderRadius: 8, fontSize: 11, fontFamily: f.font, fontWeight: 300, color: C.dark, transition: "all .15s" }} />
</div>
<div style={{ display: "flex", alignItems: "center", gap: 6 }}>
<SlidersHorizontal size={13} strokeWidth={1.5} color={C.muted} />
</div>
<select className="sw-sel" value={filterSpace} onChange={e => setFilterSpace(e.target.value)} style={selSt}>
<option value="">All Spaces</option>
{spaceOptions.map(s => <option key={s} value={s}>{s}</option>)}
</select>
<select className="sw-sel" value={filterBudget} onChange={e => setFilterBudget(e.target.value)} style={selSt}>
<option value="">All Budgets</option>
{budgetRanges.map(b => <option key={b.label} value={b.label}>{b.label}</option>)}
</select>
<select className="sw-sel" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={selSt}>
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
{!loading && `${filtered.length} result${filtered.length !== 1 ? "s" : ""}`}
</div>
</div>
{loading ? (
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
{[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
</div>
          ) : filtered.length === 0 ? (
<div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "64px 24px", textAlign: "center" }}>
<div style={{ width: 52, height: 52, borderRadius: 14, background: C.card, border: `0.5px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: C.muted, marginBottom: 14 }}>◫</div>
<div style={{ fontFamily: f.serif, fontSize: 20, fontWeight: 300, color: C.dark, marginBottom: 6 }}>
{hasFilters ? "No matching requests." : "No available requests yet."}
</div>
<div style={{ fontSize: 12, color: C.muted, fontWeight: 300, lineHeight: 1.7, maxWidth: 260 }}>
{hasFilters ? "Try adjusting your filters." : "Check back later for new design requests."}
</div>
</div>
          ) : (
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
{filtered.map(r => <RequestCard key={r.id} request={r} onView={onView} />)}
</div>
          )}
</main>
</div>
</>
  );
}
