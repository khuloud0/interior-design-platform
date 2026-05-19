import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProviderSidebar from "../../components/ProviderSidebar";
import { ArrowLeft, Briefcase, DollarSign, Clock, FileText, CheckCircle, XCircle, Send } from "lucide-react";

const C = {
  dark: "#2C221A", mid: "#3D3128", sand: "#D4C4B0",
  stone: "#8C7B6B", muted: "#B0A090", border: "#E2D8CE",
  bg: "#F5F0EA", sec: "#F7F3EF", card: "#FFFFFF",
  error: "#B05030", success: "#4A6645", accent: "#C9902A",
};
const f = { font: "'Jost', sans-serif", serif: "'Cormorant Garamond', serif" };

const Label = ({ children }) => (
  <label style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: C.muted, fontFamily: f.font, marginBottom: 6, display: "block" }}>
    {children}
  </label>
);

const inpSt = () => ({
  width: "100%", padding: "10px 12px", borderRadius: 8,
  border: `0.5px solid ${C.border}`,
  background: C.sec, fontSize: 12.5, color: C.dark,
  fontFamily: f.font, outline: "none", boxSizing: "border-box",
  transition: "border-color .15s",
});

const DetailRow = ({ icon, label, value }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 0", borderBottom: `0.5px solid ${C.border}` }}>
    <div style={{ color: C.muted, flexShrink: 0, marginTop: 1 }}>{icon}</div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 9, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 13, color: C.dark, fontWeight: 400 }}>{value || "—"}</div>
    </div>
  </div>
);

const STATUS = {
  pending:   { label: "Open",            bg: "rgba(201,144,42,0.10)", color: "#9B5E2A", dot: "#C9902A" },
  submitted: { label: "Awaiting Client", bg: "rgba(201,144,42,0.10)", color: "#9B5E2A", dot: "#C9902A" },
  active:    { label: "Active Project",  bg: "rgba(74,102,69,0.10)",  color: "#4A6645", dot: "#5C7057" },
  declined:  { label: "Declined",        bg: "rgba(176,80,48,0.08)",  color: "#B05030", dot: "#C97D4E" },
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

export default function ProviderOfferDetails() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [offer, setOffer]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [acting, setActing]     = useState(false);
  const [error, setError]       = useState("");
  const [showForm, setShowForm] = useState(false);

  const [myOffer, setMyOffer] = useState({
    budget: "", duration: "", description: "", notes: "",
  });
  const [submittingOffer, setSubmittingOffer] = useState(false);
  const [offerError, setOfferError]           = useState("");

  const provider = JSON.parse(localStorage.getItem("user") || "{}");
  const initials = provider?.name?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?";

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://127.0.0.1:5000/contractor-offers/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setOffer(data.offer ?? data);
        else setError("Failed to load offer.");
      } catch { setError("Network error."); }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  const handleAcceptAsIs = async () => {
    setActing(true); setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:5000/contractor-offers/${id}/accept`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ provider_id: provider?.id }),
      });
      const data = await res.json();
      if (res.ok) navigate("/provider/projects");
      else setError(data.message || "Something went wrong.");
    } catch { setError("Network error."); }
    finally { setActing(false); }
  };

  const handleSubmitMyOffer = async () => {
    setOfferError("");
    if (!myOffer.budget || isNaN(Number(myOffer.budget))) { setOfferError("Please enter a valid budget."); return; }
    if (!myOffer.duration) { setOfferError("Please enter a duration."); return; }
    setSubmittingOffer(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:5000/contractor-offers/${id}/respond`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          ...myOffer,
          budget: Number(myOffer.budget),
          provider_id: provider?.id,
        }),
      });
      const data = await res.json();
      if (res.ok) navigate("/provider/projects");
      else setOfferError(data.message || "Something went wrong.");
    } catch { setOfferError("Network error."); }
    finally { setSubmittingOffer(false); }
  };

  const handleDecline = async () => {
    setActing(true); setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:5000/contractor-offers/${id}/decline`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ provider_id: provider?.id }),
      });
      const data = await res.json();
      if (res.ok) navigate("/provider/offers");
      else setError(data.message || "Something went wrong.");
    } catch { setError("Network error."); }
    finally { setActing(false); }
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; } body { margin: 0; }
        ::placeholder { color: #C8BEB4; font-size: 12px; font-weight: 300; }
        .po-inp:focus { border-color: #8C7B6B !important; background: #fff !important; outline: none; box-shadow: 0 0 0 3px rgba(140,123,107,0.08); }
        .po-ta:focus  { border-color: #8C7B6B !important; background: #fff !important; outline: none; box-shadow: 0 0 0 3px rgba(140,123,107,0.08); }
      `}</style>

      <div style={{ display: "flex", height: "100vh", fontFamily: f.font, background: C.bg }}>
        <ProviderSidebar variant="light" />

        <main style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }}>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
            <button onClick={() => navigate("/provider/offers")}
              style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: C.stone, fontSize: 12, fontFamily: f.font, letterSpacing: "0.05em" }}
              onMouseEnter={e => e.currentTarget.style.color = C.dark}
              onMouseLeave={e => e.currentTarget.style.color = C.stone}>
              <ArrowLeft size={14} strokeWidth={1.5} />
              Back to Offers
            </button>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: f.serif, fontSize: 14, fontWeight: 600, color: C.sand }}>
              {initials}
            </div>
          </div>

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[120, 300, 200].map((h, i) => (
                <div key={i} style={{ height: h, background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 14 }} />
              ))}
            </div>
          ) : error && !offer ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: C.muted, fontFamily: f.serif, fontSize: 20 }}>{error}</div>
          ) : offer && (
            <>
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: 9, color: C.muted, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 6 }}>
                      OFFER #{offer.id} — REQUEST #{offer.request_id}
                    </div>
                    <h1 style={{ fontFamily: f.serif, fontSize: 36, fontWeight: 400, color: C.dark, lineHeight: 1.15, marginBottom: 6 }}>
                      {offer.work_type}
                    </h1>
                    {offer.designer_name && (
                      <div style={{ fontSize: 11, color: C.muted, fontWeight: 300 }}>
                        Posted by {offer.designer_name}
                      </div>
                    )}
                  </div>
                  <StatusBadge status={offer.status} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>

                {/* Left */}
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                  {/* تفاصيل العرض الأصلي من المصمم */}
                  <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 14, padding: "24px 28px" }}>
                    <div style={{ fontSize: 11, fontWeight: 500, color: C.stone, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>
                      Designer's Offer
                    </div>
                    <DetailRow icon={<Briefcase size={14} strokeWidth={1.5} />} label="Work Type" value={offer.work_type} />
                    <DetailRow icon={<DollarSign size={14} strokeWidth={1.5} />} label="Budget"    value={offer.budget ? `${Number(offer.budget).toLocaleString()} SAR` : null} />
                    <DetailRow icon={<Clock      size={14} strokeWidth={1.5} />} label="Duration"  value={offer.duration} />
                    <DetailRow icon={<FileText   size={14} strokeWidth={1.5} />} label="Notes"     value={offer.notes} />
                  </div>

                  {offer.description && (
                    <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 14, padding: "24px 28px" }}>
                      <div style={{ fontSize: 11, fontWeight: 500, color: C.stone, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>
                        Description
                      </div>
                      <p style={{ fontSize: 13, color: C.dark, fontWeight: 300, lineHeight: 1.8 }}>{offer.description}</p>
                    </div>
                  )}

                  {/* ✅ عرض المقاول المخصص — يظهر بعد التقديم */}
                  {offer.status === "submitted" && offer.provider_budget && (
                    <div style={{ background: C.card, border: `0.5px solid rgba(201,144,42,0.3)`, borderRadius: 14, padding: "24px 28px" }}>
                      <div style={{ fontSize: 11, fontWeight: 500, color: C.accent, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                        <CheckCircle size={13} strokeWidth={1.5} />
                        My Submitted Offer
                      </div>
                      <DetailRow icon={<DollarSign size={14} strokeWidth={1.5} />} label="My Budget"      value={offer.provider_budget ? `${Number(offer.provider_budget).toLocaleString()} SAR` : null} />
                      <DetailRow icon={<Clock      size={14} strokeWidth={1.5} />} label="My Duration"    value={offer.provider_duration} />
                      <DetailRow icon={<FileText   size={14} strokeWidth={1.5} />} label="My Description" value={offer.provider_description} />
                      <DetailRow icon={<FileText   size={14} strokeWidth={1.5} />} label="My Notes"       value={offer.provider_notes} />
                    </div>
                  )}

                  {/* فورم العرض المخصص */}
                  {showForm && (
                    <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 14, padding: "24px 28px" }}>
                      <div style={{ fontSize: 11, fontWeight: 500, color: C.stone, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20, paddingBottom: 10, borderBottom: `0.5px solid ${C.border}` }}>
                        My Custom Offer
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                          <div>
                            <Label>My Budget (SAR)</Label>
                            <input className="po-inp" type="number" value={myOffer.budget}
                              onChange={e => setMyOffer(p => ({ ...p, budget: e.target.value }))}
                              placeholder="e.g. 4,500" style={inpSt()} />
                          </div>
                          <div>
                            <Label>My Duration</Label>
                            <input className="po-inp" value={myOffer.duration}
                              onChange={e => setMyOffer(p => ({ ...p, duration: e.target.value }))}
                              placeholder="e.g. 10 Days" style={inpSt()} />
                          </div>
                        </div>
                        <div>
                          <Label>Description</Label>
                          <textarea className="po-ta" value={myOffer.description}
                            onChange={e => setMyOffer(p => ({ ...p, description: e.target.value }))}
                            rows={3} placeholder="Describe what you'll deliver..."
                            style={{ ...inpSt(), resize: "none", lineHeight: 1.65 }} />
                        </div>
                        <div>
                          <Label>Notes (optional)</Label>
                          <input className="po-inp" value={myOffer.notes}
                            onChange={e => setMyOffer(p => ({ ...p, notes: e.target.value }))}
                            placeholder="Any additional notes..." style={inpSt()} />
                        </div>
                        {offerError && (
                          <div style={{ fontSize: 12, color: C.error }}>{offerError}</div>
                        )}
                        <div style={{ display: "flex", gap: 10 }}>
                          <button onClick={() => { setShowForm(false); setOfferError(""); }}
                            style={{ flex: 1, padding: "11px", borderRadius: 10, border: `0.5px solid ${C.border}`, background: "transparent", color: C.stone, fontSize: 10, fontFamily: f.font, letterSpacing: ".1em", textTransform: "uppercase", cursor: "pointer" }}>
                            Cancel
                          </button>
                          <button onClick={handleSubmitMyOffer} disabled={submittingOffer}
                            style={{ flex: 2, padding: "11px", borderRadius: 10, border: "none", background: C.dark, color: C.sand, fontSize: 10, fontWeight: 500, fontFamily: f.font, letterSpacing: ".12em", textTransform: "uppercase", cursor: submittingOffer ? "not-allowed" : "pointer", opacity: submittingOffer ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                            onMouseEnter={e => { if (!submittingOffer) e.currentTarget.style.background = C.mid; }}
                            onMouseLeave={e => { if (!submittingOffer) e.currentTarget.style.background = C.dark; }}>
                            <Send size={11} strokeWidth={1.5} />
                            {submittingOffer ? "Submitting..." : "Submit My Offer →"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 14, padding: "24px 28px" }}>
                    <div style={{ fontSize: 9, color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Offer Summary</div>
                    <div style={{ fontSize: 9, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Budget</div>
                    <div style={{ fontFamily: f.serif, fontSize: 36, fontWeight: 400, color: C.dark, marginBottom: 20 }}>
                      {offer.budget ? Number(offer.budget).toLocaleString() : "—"}
                      <span style={{ fontSize: 16, color: C.stone, marginLeft: 6 }}>SAR</span>
                    </div>

                    <div style={{ borderTop: `0.5px solid ${C.border}`, paddingTop: 16, marginBottom: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                        <span style={{ fontSize: 11, color: C.muted }}>Status</span>
                        <StatusBadge status={offer.status} />
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 11, color: C.muted }}>Duration</span>
                        <span style={{ fontSize: 11, color: C.dark }}>{offer.duration || "—"}</span>
                      </div>
                    </div>

                    {error && (
                      <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(176,80,48,0.07)", border: "0.5px solid rgba(176,80,48,0.2)", fontSize: 12, color: C.error, marginBottom: 12 }}>
                        {error}
                      </div>
                    )}

                    {/* الأزرار — pending فقط */}
                    {offer.status === "pending" && !showForm && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <button onClick={handleAcceptAsIs} disabled={acting}
                          style={{ width: "100%", padding: "13px", border: "none", borderRadius: 10, background: C.dark, color: C.sand, fontSize: 11, fontWeight: 500, fontFamily: f.font, letterSpacing: ".12em", textTransform: "uppercase", cursor: acting ? "not-allowed" : "pointer", opacity: acting ? 0.7 : 1, transition: "background .15s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                          onMouseEnter={e => { if (!acting) e.currentTarget.style.background = C.mid; }}
                          onMouseLeave={e => { if (!acting) e.currentTarget.style.background = C.dark; }}>
                          <CheckCircle size={14} strokeWidth={1.5} />
                          Accept As Is
                        </button>
                        <button onClick={() => setShowForm(true)} disabled={acting}
                          style={{ width: "100%", padding: "13px", borderRadius: 10, border: `0.5px solid ${C.border}`, background: "transparent", color: C.stone, fontSize: 11, fontWeight: 500, fontFamily: f.font, letterSpacing: ".12em", textTransform: "uppercase", cursor: "pointer", transition: "all .15s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = C.stone; e.currentTarget.style.color = C.dark; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.stone; }}>
                          <Send size={13} strokeWidth={1.5} />
                          Submit My Offer
                        </button>
                        <button onClick={handleDecline} disabled={acting}
                          style={{ width: "100%", padding: "11px", borderRadius: 10, border: "none", background: "transparent", color: C.muted, fontSize: 10, fontFamily: f.font, letterSpacing: ".1em", textTransform: "uppercase", cursor: acting ? "not-allowed" : "pointer", transition: "color .15s" }}
                          onMouseEnter={e => e.currentTarget.style.color = C.error}
                          onMouseLeave={e => e.currentTarget.style.color = C.muted}>
                          <XCircle size={12} strokeWidth={1.5} style={{ marginRight: 6, verticalAlign: "middle" }} />
                          Decline Offer
                        </button>
                      </div>
                    )}

                    {/* submitted */}
                    {offer.status === "submitted" && (
                      <div style={{ padding: "12px 14px", borderRadius: 8, background: "rgba(201,144,42,0.08)", border: "0.5px solid rgba(201,144,42,0.2)", fontSize: 12, color: "#9B5E2A", display: "flex", alignItems: "center", gap: 8 }}>
                        <CheckCircle size={13} strokeWidth={1.5} />
                        Submitted — awaiting client selection.
                      </div>
                    )}

                    {/* active */}
                    {offer.status === "active" && (
                      <div style={{ padding: "12px 14px", borderRadius: 8, background: "rgba(74,102,69,0.08)", border: "0.5px solid rgba(74,102,69,0.2)", fontSize: 12, color: C.success, display: "flex", alignItems: "center", gap: 8 }}>
                        <CheckCircle size={13} strokeWidth={1.5} />
                        Active project — client selected your offer.
                      </div>
                    )}

                    {/* declined */}
                    {offer.status === "declined" && (
                      <div style={{ padding: "12px 14px", borderRadius: 8, background: "rgba(176,80,48,0.07)", border: "0.5px solid rgba(176,80,48,0.2)", fontSize: 12, color: C.error, display: "flex", alignItems: "center", gap: 8 }}>
                        <XCircle size={13} strokeWidth={1.5} />
                        You declined this offer.
                      </div>
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