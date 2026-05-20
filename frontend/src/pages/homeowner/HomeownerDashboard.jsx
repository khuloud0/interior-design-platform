import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClientSidebar from "../../components/ClientSidebar";
import { Plus, Clock, Wallet } from "lucide-react";

export default function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [user, setUser]         = useState(null);
  const navigate = useNavigate();

  const c = {
    dark: "#2C221A", sand: "#D4C4B0", stone: "#8C7B6B",
    muted: "#B0A090", border: "#E2D8CE", bg: "#F5F0EA", card: "#FFFFFF",
  };

  const statusConfig = {
    "Pending Designer Review": { dot: "#D97706", bg: "#FEF3C7", color: "#92400E", label: "pending" },
    "Execution Plan Ready":    { dot: "#2563EB", bg: "#DBEAFE", color: "#1E40AF", label: "plan ready" },
    "Offers Ready":            { dot: "#7C3AED", bg: "#EDE9FE", color: "#5B21B6", label: "offers ready" },
    "Completed":               { dot: "#059669", bg: "#D1FAE5", color: "#065F46", label: "completed" },
    "pending":                 { dot: "#D97706", bg: "#FEF3C7", color: "#92400E", label: "pending" },
    "in_progress":             { dot: "#C97D4E", bg: "rgba(201,125,78,0.10)", color: "#9B5E2A", label: "in progress" },
    "rejected":                { dot: "#C97D4E", bg: "rgba(176,80,48,0.08)", color: "#B05030", label: "rejected" },
    "completed":               { dot: "#059669", bg: "#D1FAE5", color: "#065F46", label: "completed" },
  };

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://127.0.0.1:5000/design-requests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          const cu = JSON.parse(localStorage.getItem("user"));
          setRequests((data.design_requests || []).filter(r => r.homeowner_id === cu?.id));
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (iso) => iso
    ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : "—";

  const initials = user?.name?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?";

  const StatusBadge = ({ status }) => {
    const cfg = statusConfig[status] || statusConfig["pending"];
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 100, fontSize: 11, background: cfg.bg, color: cfg.color, fontWeight: 400 }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
        {cfg.label}
      </span>
    );
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; }
        .req-card:hover  { border-color: #B0A090 !important; }
        .btn-view:hover  { border-color: #2C221A !important; color: #2C221A !important; }
        .btn-primary:hover { background: #3D3128 !important; }
      `}</style>

      <div style={{ display: "flex", height: "100vh", fontFamily: "'Jost', sans-serif", background: c.bg }}>

        <ClientSidebar variant="light" />

        <main style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }}>

          {/* Top bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
            <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.16em", color: c.muted, textTransform: "uppercase" }}>
              DESIGNER MARKETPLACE
            </div>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: c.dark, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond', serif", fontSize: 14, fontWeight: 600, color: c.sand }}>
              {initials}
            </div>
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 400, color: c.dark, marginBottom: 6 }}>
            My Design Requests
          </h1>
          <p style={{ fontSize: 12, color: c.muted, fontWeight: 300, marginBottom: 28, lineHeight: 1.7 }}>
            All the design requests you've submitted — track their status and review updates.
          </p>

          {/* MY REQUESTS */}
          <div style={{ background: c.card, border: `0.5px solid ${c.border}`, borderRadius: 16, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: `0.5px solid ${c.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: c.muted }}>MY REQUESTS</span>
                <div style={{ height: "0.5px", width: 20, background: c.border }} />
              </div>
              <button className="btn-primary" onClick={() => navigate("/designers")}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, background: c.dark, color: c.sand, border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 10, fontFamily: "'Jost', sans-serif", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", transition: "background 0.15s" }}>
                <Plus size={11} strokeWidth={2} /> Browse Designers
              </button>
            </div>

            {loading ? (
              <div style={{ padding: "48px", textAlign: "center", fontSize: 12, color: c.muted }}>Loading...</div>
            ) : requests.length === 0 ? (
              <div style={{ padding: "48px 32px", textAlign: "center" }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 300, color: c.dark, marginBottom: 8 }}>No requests yet</div>
                <p style={{ fontSize: 12, color: c.muted, fontWeight: 300, lineHeight: 1.75, maxWidth: 300, margin: "0 auto 24px" }}>
                  You haven't submitted any design requests yet. Tell us about your space and we'll match you with the right designer.
                </p>
                <button className="btn-primary" onClick={() => navigate("/designers")}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, background: c.dark, color: c.sand, border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 10, fontFamily: "'Jost', sans-serif", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer" }}>
                  <Plus size={11} strokeWidth={2} /> Create Your First Request
                </button>
              </div>
            ) : (
              <div style={{ padding: "20px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
                {requests.map(req => {
                  const isRejected = req.status === "rejected";
                  return (
                  <div key={req.id} className={isRejected ? "" : "req-card"} style={{ background: "#fff", border: `0.5px solid ${c.border}`, borderRadius: 14, padding: "16px 18px", transition: "border-color .15s", opacity: isRejected ? 0.5 : 1 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 10 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: c.dark }}>{req.space_type} Design</div>
                      <StatusBadge status={req.status} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 14 }}>
                      <span style={{ fontSize: 11, color: c.muted, display: "flex", alignItems: "center", gap: 4 }}>
                        <Clock size={11} strokeWidth={1.3} />{formatDate(req.created_at)}
                      </span>
                      <span style={{ fontSize: 11, color: c.muted, display: "flex", alignItems: "center", gap: 4 }}>
                        <Wallet size={11} strokeWidth={1.3} />{Number(req.budget).toLocaleString()} SAR
                      </span>
                      <span style={{ fontSize: 11, color: c.muted }}>{req.service_type}</span>
                    </div>
                    {isRejected ? (
                      <div style={{ width: "100%", background: "transparent", border: `0.5px solid ${c.border}`, color: c.muted, borderRadius: 8, padding: "7px 0", fontSize: 11, fontFamily: "'Jost', sans-serif", letterSpacing: "0.03em", textAlign: "center", cursor: "not-allowed" }}>
                        Rejected
                      </div>
                    ) : (
                      <button className="btn-view" onClick={() => navigate(`/requests/${req.id}`)}
                        style={{ width: "100%", background: "transparent", border: `0.5px solid ${c.border}`, color: c.stone, borderRadius: 8, padding: "7px 0", fontSize: 11, fontFamily: "'Jost', sans-serif", cursor: "pointer", letterSpacing: "0.03em", transition: "all .15s" }}>
                        View Details
                      </button>
                    )}
                  </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}