import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const c = {
    dark: "#2C221A",
    sand: "#D4C4B0",
    stone: "#8C7B6B",
    muted: "#B0A090",
    border: "#E2D8CE",
    bg: "#F5F0EA",
    sectionBg: "#F7F3EF",
  };

  const statusConfig = {
    "Pending Designer Review": { dot: "#D97706", bg: "#FEF3C7", color: "#92400E" },
    "Execution Plan Ready":    { dot: "#2563EB", bg: "#DBEAFE", color: "#1E40AF" },
    "Offers Ready":            { dot: "#7C3AED", bg: "#EDE9FE", color: "#5B21B6" },
    "Completed":               { dot: "#059669", bg: "#D1FAE5", color: "#065F46" },
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
      const currentUser = JSON.parse(localStorage.getItem("user"));

      const myRequests = (data.design_requests || []).filter(
        (req) => req.homeowner_id === currentUser?.id
      );

      setRequests(myRequests);
    }
  } catch (e) {
    console.error(e);
  } finally {
    setLoading(false);
  }
};
    fetchData();
  }, []);

  const formatDate = (iso) =>
    iso
      ? new Date(iso).toLocaleDateString("en-GB", {
          day: "numeric", month: "short", year: "numeric",
        })
      : "—";

  const firstName = user?.name?.split(" ")[0] || user?.username || "there";

  const StatusBadge = ({ status }) => {
    const cfg = statusConfig[status] || statusConfig["Pending Designer Review"];
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        padding: "4px 10px", borderRadius: 100,
        fontSize: 11, background: cfg.bg, color: cfg.color,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
        {status || "Pending Designer Review"}
      </span>
    );
  };

  const BtnPrimary = ({ children, onClick, style = {} }) => (
    <button
      onClick={onClick}
      style={{
        background: c.dark, color: c.sand, border: "none",
        borderRadius: 10, padding: "9px 16px", fontSize: 11.5,
        fontFamily: "'Jost', sans-serif", fontWeight: 500,
        letterSpacing: "0.12em", textTransform: "uppercase",
        cursor: "pointer", display: "inline-flex", alignItems: "center",
        gap: 7, transition: "background .15s", flexShrink: 0, ...style,
      }}
    >
      {children}
    </button>
  );

  const PlusIcon = ({ size = 11 }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="2" x2="8" y2="14" /><line x1="2" y1="8" x2="14" y2="8" />
    </svg>
  );

  const EmptyState = () => (
    <div style={{ background: "#fff", border: `0.5px solid ${c.border}`, borderRadius: 18, overflow: "hidden" }}>
      {/* Marble strip */}
      <div style={{ height: 120, background: "#EDE8E1", position: "relative", overflow: "hidden" }}>
        <svg width="100%" height="120" viewBox="0 0 660 120"
          preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <rect width="660" height="120" fill="#E8E1D8" />
          <path d="M-10 30 Q 80 10 150 45 Q 220 80 340 55 Q 460 30 560 60 Q 620 75 680 55"
            stroke="#D0C5B8" strokeWidth="1.4" fill="none" opacity="0.9" />
          <path d="M-10 32 Q 82 12 152 47 Q 222 82 342 57"
            stroke="#C4BAB0" strokeWidth="0.5" fill="none" opacity="0.45" />
          <path d="M0 75 Q 100 50 200 80 Q 300 110 420 85 Q 510 65 680 90"
            stroke="#CCC1B4" strokeWidth="1.8" fill="none" opacity="0.7" />
          <path d="M2 78 Q 102 53 202 83 Q 302 113 422 88"
            stroke="#C0B6A9" strokeWidth="0.5" fill="none" opacity="0.35" />
          <path d="M300 -5 Q 320 40 295 80 Q 275 110 290 125"
            stroke="#D2C7BA" strokeWidth="1.2" fill="none" opacity="0.6" />
          <circle cx="180" cy="38" r="1.2" fill="#E2D8CC" opacity="0.7" />
          <circle cx="420" cy="22" r="0.9" fill="#D8CECC" opacity="0.5" />
          <circle cx="520" cy="72" r="1.3" fill="#DDD4C8" opacity="0.6" />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: "rgba(255,255,255,0.7)", border: "1px solid rgba(210,198,185,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
              stroke={c.stone} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
        </div>
      </div>

      {/* Text + steps + CTA */}
      <div style={{ padding: "28px 32px 32px", textAlign: "center" }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: 22,
          fontWeight: 300, color: c.dark, marginBottom: 8,
        }}>No requests yet</div>
        <div style={{
          fontSize: 12.5, color: c.muted, fontWeight: 300,
          lineHeight: 1.75, maxWidth: 320, margin: "0 auto 24px",
        }}>
          You haven't submitted any design requests yet.<br />
          Tell us about your space and we'll match you with the right designer.
        </div>

        {/* Mini steps */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          {[
            {
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke={c.stone} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              ),
              label: "Submit your request",
            },
            {
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke={c.stone} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                </svg>
              ),
              label: "Get matched with a designer",
            },
            {
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke={c.stone} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 11 12 14 22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              ),
              label: "Review offers and confirm",
            },
          ].map(({ icon, label }, i, arr) => (
            <React.Fragment key={label}>
              <div style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", gap: 6, width: 110,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: c.sectionBg, border: `0.5px solid ${c.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {icon}
                </div>
                <span style={{ fontSize: 10.5, color: c.muted, lineHeight: 1.4, textAlign: "center" }}>
                  {label}
                </span>
              </div>
              {i < arr.length - 1 && (
                <div style={{ display: "flex", alignItems: "center", paddingBottom: 18 }}>
                  <div style={{ width: 28, height: "0.5px", background: c.border }} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <BtnPrimary
          onClick={() => navigate("/create-request")}
          style={{ margin: "0 auto" }}
        >
          <PlusIcon />
          Create Your First Request
        </BtnPrimary>
      </div>
    </div>
  );

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Jost:wght@300;400;500&display=swap"
        rel="stylesheet"
      />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .req-card:hover { border-color: #B0A090 !important; }
        .btn-view:hover { border-color: #2C221A !important; color: #2C221A !important; background: #F5F0EA !important; }
        .btn-p-hover:hover { background: #3D3128 !important; }
      `}</style>

      <div style={{ minHeight: "100vh", background: c.bg, padding: "28px 24px", fontFamily: "'Jost', sans-serif" }}>
  <div style={{ maxWidth: 680, margin: "0 auto" }}>

    {/* ── BACK / HOME ── */}
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          padding: "7px 16px",
          borderRadius: 8,
          border: `0.5px solid ${c.border}`,
          background: "transparent",
          color: c.stone,
          fontSize: 11,
          fontFamily: "'Jost', sans-serif",
          cursor: "pointer",
        }}
      >
        ← Back
      </button>

      <button
        onClick={() => navigate("/")}
        style={{
          padding: "7px 16px",
          borderRadius: 8,
          border: `0.5px solid ${c.border}`,
          background: "transparent",
          color: c.stone,
          fontSize: 11,
          fontFamily: "'Jost', sans-serif",
          cursor: "pointer",
        }}
      >
        Home
      </button>
    </div>

          {/* Navbar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 28, height: 28, border: "1.5px solid rgba(44,34,26,0.18)",
                borderRadius: 7, display: "flex", alignItems: "center",
                justifyContent: "center", background: "#fff",
              }}>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="5" height="5" stroke="#2C221A" strokeWidth="1.2" rx="1" />
                  <rect x="9" y="2" width="5" height="5" fill="rgba(44,34,26,0.25)" rx="1" />
                  <rect x="2" y="9" width="5" height="5" fill="rgba(44,34,26,0.25)" rx="1" />
                  <rect x="9" y="9" width="5" height="5" stroke="#2C221A" strokeWidth="1.2" rx="1" />
                </svg>
              </div>
              <span style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: 15,
                fontWeight: 600, letterSpacing: "0.18em",
                color: c.dark, textTransform: "uppercase",
              }}>Swagne</span>
            </div>
            <div style={{
              width: 34, height: 34, borderRadius: "50%", background: c.dark,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Cormorant Garamond', serif", fontSize: 13,
              fontWeight: 600, color: c.sand,
            }}>
              {user?.name?.[0]?.toUpperCase() || "?"}
            </div>
          </div>

          {/* Hero — no button here */}
          <div style={{
            background: c.dark, borderRadius: 16,
            padding: "26px 28px", marginBottom: 20,
          }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: 26,
              fontWeight: 300, color: "#fff", marginBottom: 5,
            }}>
              {requests.length === 0 && !loading
                ? `Welcome, ${firstName}`
                : `Welcome back, ${firstName}`}
            </div>
            <div style={{ fontSize: 12, color: "rgba(212,196,176,0.6)", fontWeight: 300, lineHeight: 1.65 }}>
              {requests.length === 0 && !loading
                ? "Your design journey starts here."
                : "Manage your design requests and review project updates."}
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0", fontSize: 12, color: c.muted }}>
              Loading...
            </div>
          ) : requests.length === 0 ? (
            <EmptyState />
          ) : (
            <div style={{ background: "#fff", border: `0.5px solid ${c.border}`, borderRadius: 16, overflow: "hidden" }}>

              {/* Section header with Create button */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "18px 22px 16px", borderBottom: `0.5px solid ${c.border}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 500, letterSpacing: "0.16em",
                    textTransform: "uppercase", color: c.muted,
                  }}>My Requests</span>
                  <div style={{ height: "0.5px", width: 20, background: c.border }} />
                </div>
                <BtnPrimary
                  onClick={() => navigate("/create-request")}
                  style={{ borderRadius: 8 }}
                >
                  <PlusIcon />
                  Create New Request
                </BtnPrimary>
              </div>

              {/* Cards */}
              <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
                {requests.map((req) => (
                  <div
                    key={req.id}
                    className="req-card"
                    style={{
                      background: "#fff", border: `0.5px solid ${c.border}`,
                      borderRadius: 14, padding: "18px 20px", transition: "border-color .15s",
                    }}
                  >
                    <div style={{
                      display: "flex", alignItems: "flex-start",
                      justifyContent: "space-between", gap: 12, marginBottom: 12,
                    }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 500, color: c.dark, marginBottom: 5 }}>
                          {req.space_type} Design
                        </div>
                        <StatusBadge status={req.status} />
                      </div>
                      <button
                        className="btn-view"
                        onClick={() => navigate(`/requests/${req.id}`)}
                        style={{
                          background: "transparent", border: `1px solid ${c.border}`,
                          color: "#5C4A3C", borderRadius: 8, padding: "7px 14px",
                          fontSize: 11.5, fontFamily: "'Jost', sans-serif",
                          fontWeight: 400, cursor: "pointer",
                          letterSpacing: "0.03em", transition: "all .15s", whiteSpace: "nowrap",
                        }}
                      >
                        View Details
                      </button>
                    </div>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 16,
                      paddingTop: 10, borderTop: "0.5px solid #F0EAE2", flexWrap: "wrap",
                    }}>
                      <span style={{ fontSize: 11.5, color: c.muted, display: "flex", alignItems: "center", gap: 4 }}>
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke={c.muted} strokeWidth="1.3" strokeLinecap="round">
                          <line x1="8" y1="1" x2="8" y2="4" /><circle cx="8" cy="8" r="6" /><line x1="8" y1="8" x2="11" y2="10" />
                        </svg>
                        {formatDate(req.created_at)}
                      </span>
                      <span style={{ fontSize: 11.5, color: c.muted, display: "flex", alignItems: "center", gap: 4 }}>
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke={c.muted} strokeWidth="1.3" strokeLinecap="round">
                          <rect x="1" y="3" width="14" height="10" rx="2" /><line x1="1" y1="7" x2="15" y2="7" />
                        </svg>
                        {Number(req.budget).toLocaleString()} SAR
                      </span>
                      <span style={{ fontSize: 11.5, color: c.muted }}>
                        {req.service_type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>
      </div>
    </>
  );
}
