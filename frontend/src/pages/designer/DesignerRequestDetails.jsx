import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DesignerSidebar from "../../components/DesignerSidebar";
import {
  ArrowLeft, MapPin, Layers, Ruler, Calendar, Clock,
  Palette, Star, CheckCircle, XCircle, User,
} from "lucide-react";
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
rejected:             { label: "Rejected",     bg: "rgba(176,80,48,0.08)",   color: "#B05030", dot: "#C97D4E" },
};
const StatusBadge = ({ status }) => {
const s = STATUS[status] || STATUS.pending;
return (
<span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 20, fontSize: 11, fontFamily: f.font, letterSpacing: ".06em", background: s.bg, color: s.color }}>
<span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot }} />
{s.label}
</span>
  );
};
const DetailRow = ({ icon, label, value }) => (
<div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 0", borderBottom: `0.5px solid ${C.border}` }}>
<div style={{ color: C.muted, flexShrink: 0, marginTop: 1 }}>{icon}</div>
<div style={{ flex: 1 }}>
<div style={{ fontSize: 9, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3 }}>{label}</div>
<div style={{ fontSize: 13, color: C.dark, fontWeight: 400 }}>{value || "—"}</div>
</div>
</div>
);
export default function DesignerRequestDetails() {
const { id }   = useParams();
const navigate = useNavigate();
const [request, setRequest] = useState(null);
const [loading, setLoading] = useState(true);
const [acting, setActing]   = useState(false);
const [error, setError]     = useState("");
const designer = JSON.parse(localStorage.getItem("user") || "{}");
const initials = designer?.name?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?";
useEffect(() => {
const load = async () => {
setLoading(true);
try {
const token = localStorage.getItem("token");
const res = await fetch(`http://127.0.0.1:5000/design-requests/${id}`, {
headers: { Authorization: `Bearer ${token}` },
        });
const data = await res.json();
if (res.ok) setRequest(data.request ?? data);
else setError("Failed to load request.");
      } catch { setError("Network error."); }
finally { setLoading(false); }
    };
load();
  }, [id]);
const handleAction = async (action) => {
setActing(true); setError("");
try {
const token = localStorage.getItem("token");
const res = await fetch(`http://127.0.0.1:5000/design-requests/${id}/${action}`, {
method: "POST",
headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
body: JSON.stringify({ designer_id: designer?.id }),
      });
const data = await res.json();
if (res.ok) {
if (action === "accept") {
          // ✅ بعد Accept يروح لـ Manage Projects
navigate("/designer/manage");
        } else {
          // ✅ بعد Reject يروح لصفحة الطلبات المتاحة
navigate("/designer/requests");
        }
      } else setError(data.message || "Something went wrong.");
    } catch { setError("Network error."); }
finally { setActing(false); }
  };
const fmt = (date) => {
if (!date) return "—";
return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };
return (
<>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
<style>{`* { box-sizing: border-box; margin: 0; padding: 0; } body { margin: 0; }`}</style>
<div style={{ display: "flex", height: "100vh", fontFamily: f.font, background: C.bg }}>
<DesignerSidebar variant="light" />
<main style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }}>
<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
<button onClick={() => navigate("/designer/requests")}
style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: C.stone, fontSize: 12, fontFamily: f.font, letterSpacing: "0.05em" }}
onMouseEnter={e => e.currentTarget.style.color = C.dark}
onMouseLeave={e => e.currentTarget.style.color = C.stone}>
<ArrowLeft size={14} strokeWidth={1.5} />
              Back to Dashboard
</button>
<div style={{ width: 36, height: 36, borderRadius: "50%", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: f.serif, fontSize: 14, fontWeight: 600, color: C.sand }}>
{initials}
</div>
</div>
{loading ? (
<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
{[200, 400, 200].map((h, i) => (
<div key={i} style={{ height: h, background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 14 }} />
))}
</div>
) : error && !request ? (
<div style={{ textAlign: "center", padding: "80px 0", color: C.muted, fontFamily: f.serif, fontSize: 20 }}>{error}</div>
) : request && (
<>
<div style={{ marginBottom: 24 }}>
<div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
<div>
<div style={{ fontSize: 9, color: C.muted, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 6 }}>
                      REQUEST #{request.id}
</div>
<h1 style={{ fontFamily: f.serif, fontSize: 36, fontWeight: 400, color: C.dark, lineHeight: 1.15, marginBottom: 6 }}>
{request.space_type || "Design"} Room Design
</h1>
<div style={{ fontSize: 11, color: C.muted, fontWeight: 300 }}>
                      Requested on {fmt(request.submitted_at)}
</div>
</div>
<StatusBadge status={request.status} />
</div>
</div>
<div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>
<div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
<div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 14, padding: "24px 28px" }}>
<div style={{ fontSize: 11, fontWeight: 500, color: C.stone, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>
                      Request Details
</div>
<DetailRow icon={<User     size={14} strokeWidth={1.5} />} label="Client Name"        value={request.client_name} />
<DetailRow icon={<MapPin   size={14} strokeWidth={1.5} />} label="Location"           value={request.location} />
<DetailRow icon={<Layers   size={14} strokeWidth={1.5} />} label="Space Type"         value={request.space_type} />
<DetailRow icon={<Ruler    size={14} strokeWidth={1.5} />} label="Space Size"         value={request.space_size ? `${request.space_size} m²` : null} />
<DetailRow icon={<Calendar size={14} strokeWidth={1.5} />} label="Desired Start Date" value={fmt(request.desired_start)} />
<DetailRow icon={<Clock    size={14} strokeWidth={1.5} />} label="Project Duration"   value={request.duration} />
<DetailRow icon={<Star     size={14} strokeWidth={1.5} />} label="Design Style"       value={request.preferred_style} />
<DetailRow icon={<Palette  size={14} strokeWidth={1.5} />} label="Color Preference"   value={request.preferred_colors} />
</div>
{request.space_details && (
<div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 14, padding: "24px 28px" }}>
<div style={{ fontSize: 11, fontWeight: 500, color: C.stone, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>
                        Space Description
</div>
<p style={{ fontSize: 13, color: C.dark, fontWeight: 300, lineHeight: 1.8 }}>{request.space_details}</p>
</div>
)}
</div>
<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
<div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 14, padding: "24px 28px" }}>
<div style={{ fontSize: 9, color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Request Summary</div>
<div style={{ fontSize: 9, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Client Budget</div>
<div style={{ fontFamily: f.serif, fontSize: 36, fontWeight: 400, color: C.dark, marginBottom: 20 }}>
{request.budget ? Number(request.budget).toLocaleString() : "—"}
<span style={{ fontSize: 16, color: C.stone, marginLeft: 6 }}>SAR</span>
</div>
<div style={{ borderTop: `0.5px solid ${C.border}`, paddingTop: 16, marginBottom: 16 }}>
<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
<span style={{ fontSize: 11, color: C.muted }}>Status</span>
<StatusBadge status={request.status} />
</div>
<div style={{ display: "flex", justifyContent: "space-between" }}>
<span style={{ fontSize: 11, color: C.muted }}>Service Type</span>
<span style={{ fontSize: 11, color: C.dark }}>{request.service_type || "—"}</span>
</div>
</div>
{error && (
<div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(176,80,48,0.07)", border: "0.5px solid rgba(176,80,48,0.2)", fontSize: 12, color: "#B05030", marginBottom: 12 }}>
{error}
</div>
)}
{request.status === "pending" && (
<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
<button onClick={() => handleAction("accept")} disabled={acting}
style={{ width: "100%", padding: "13px", border: "none", borderRadius: 10, background: C.dark, color: C.sand, fontSize: 11, fontWeight: 500, fontFamily: f.font, letterSpacing: ".12em", textTransform: "uppercase", cursor: acting ? "not-allowed" : "pointer", opacity: acting ? 0.7 : 1, transition: "background .15s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
onMouseEnter={e => { if (!acting) e.currentTarget.style.background = C.mid; }}
onMouseLeave={e => { if (!acting) e.currentTarget.style.background = C.dark; }}>
<CheckCircle size={14} strokeWidth={1.5} />
{acting ? "Processing..." : "Accept Request"}
</button>
<button onClick={() => handleAction("reject")} disabled={acting}
style={{ width: "100%", padding: "13px", borderRadius: 10, border: `0.5px solid ${C.border}`, background: "transparent", color: C.stone, fontSize: 11, fontWeight: 500, fontFamily: f.font, letterSpacing: ".12em", textTransform: "uppercase", cursor: acting ? "not-allowed" : "pointer", opacity: acting ? 0.7 : 1, transition: "all .15s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
onMouseEnter={e => { if (!acting) { e.currentTarget.style.borderColor = C.stone; e.currentTarget.style.color = C.dark; } }}
onMouseLeave={e => { if (!acting) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.stone; } }}>
<XCircle size={14} strokeWidth={1.5} />
                          Reject Request
</button>
</div>
)}
{/* ✅ زر Manage Plan للطلبات المقبولة */}
{request.status !== "pending" && request.status !== "rejected" && (
<button onClick={() => navigate(`/designer/requests/${id}/create-plan`)}
style={{ width: "100%", padding: "13px", border: "none", borderRadius: 10, background: C.dark, color: C.sand, fontSize: 11, fontWeight: 500, fontFamily: f.font, letterSpacing: ".12em", textTransform: "uppercase", cursor: "pointer", transition: "background .15s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
onMouseEnter={e => e.currentTarget.style.background = C.mid}
onMouseLeave={e => e.currentTarget.style.background = C.dark}>
                      Manage Plan & Offers →
</button>
)}
</div>
</div>
</div>
</>
)}
</main>
</div>
</>
  );
}