import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DesignerSidebar from "../../components/DesignerSidebar";
import { ArrowLeft, Plus, Trash2, Send, CheckCircle, Edit3, Star, StarOff } from "lucide-react";

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

const inpSt = (err) => ({
  width: "100%", padding: "10px 12px", borderRadius: 8,
  border: `0.5px solid ${err ? C.error : C.border}`,
  background: C.sec, fontSize: 12.5, color: C.dark,
  fontFamily: f.font, outline: "none", boxSizing: "border-box",
  transition: "border-color .15s",
});

const selSt = {
  width: "100%", padding: "10px 30px 10px 12px",
  borderRadius: 8, border: `0.5px solid ${C.border}`,
  background: C.sec, fontSize: 12.5, color: C.dark,
  fontFamily: f.font, outline: "none",
  appearance: "none", WebkitAppearance: "none",
  cursor: "pointer", boxSizing: "border-box",
};

const EMPTY_OFFER = { work_type: "", description: "", budget: "", duration: "", notes: "" };
const EMPTY_STAGE = { title: "", duration: "", description: "" };

export default function CreatePlan() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest]         = useState(null);
  const [loadingReq, setLoadingReq]   = useState(true);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [isEditMode, setIsEditMode]   = useState(false);

  const [plan, setPlan] = useState({
    title: "", vision: "", materials: "", colors: "", estimated_budget: "",
  });
  const [stages, setStages]                   = useState([{ ...EMPTY_STAGE }]);
  const [offers, setOffers]                   = useState([{ ...EMPTY_OFFER }]);
  const [submittingPlan, setSubmittingPlan]   = useState(false);
  const [publishingOffer, setPublishingOffer] = useState(null);
  const [planSuccess, setPlanSuccess]         = useState(false);
  const [planError, setPlanError]             = useState("");
  const [offerErrors, setOfferErrors]         = useState({});
  const [offerSuccess, setOfferSuccess]       = useState({});

  // ✅ العروض الواردة من المقاولين
  const [incomingOffers, setIncomingOffers]   = useState([]);
  const [loadingOffers, setLoadingOffers]     = useState(true);
  const [selectedOffers, setSelectedOffers]   = useState({}); // { offer_id: { selected: true, recommendation: "" } }
  const [sendingToClient, setSendingToClient] = useState(false);
  const [sendSuccess, setSendSuccess]         = useState(false);
  const [sendError, setSendError]             = useState("");

  const designer = JSON.parse(localStorage.getItem("user") || "{}");
  const initials = designer?.name?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?";

  // جلب تفاصيل الطلب
  useEffect(() => {
    const load = async () => {
      setLoadingReq(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://127.0.0.1:5000/design-requests/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setRequest(data.request ?? data);
      } catch {}
      finally { setLoadingReq(false); }
    };
    load();
  }, [id]);

  // جلب الخطة المحفوظة
  useEffect(() => {
    const loadPlan = async () => {
      setLoadingPlan(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://127.0.0.1:5000/design-requests/${id}/plan`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.plan) {
          const p = data.plan;
          setPlan({
            title:            p.title            || "",
            vision:           p.vision           || "",
            materials:        p.materials        || "",
            colors:           p.colors           || "",
            estimated_budget: p.estimated_budget || "",
          });
          if (p.stages && p.stages.length > 0) {
            setStages(p.stages.map(s => ({
              title:       s.title       || "",
              duration:    s.duration    || "",
              description: s.description || "",
            })));
          }
          setIsEditMode(true);
        }
      } catch {}
      finally { setLoadingPlan(false); }
    };
    loadPlan();
  }, [id]);

  // ✅ جلب العروض الواردة من المقاولين
  useEffect(() => {
    const loadOffers = async () => {
      setLoadingOffers(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://127.0.0.1:5000/design-requests/${id}/contractor-offers/responses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setIncomingOffers(data.offers ?? []);
      } catch {}
      finally { setLoadingOffers(false); }
    };
    loadOffers();
  }, [id]);

  const setPlanField = (e) => setPlan(p => ({ ...p, [e.target.name]: e.target.value }));

  const setStage = (i, e) => {
    setStages(s => s.map((st, idx) => idx === i ? { ...st, [e.target.name]: e.target.value } : st));
  };
  const addStage    = () => setStages(s => [...s, { ...EMPTY_STAGE }]);
  const removeStage = (i) => setStages(s => s.filter((_, idx) => idx !== i));

  const setOffer = (i, e) => {
    setOffers(o => o.map((of, idx) => idx === i ? { ...of, [e.target.name]: e.target.value } : of));
  };
  const addOffer    = () => setOffers(o => [...o, { ...EMPTY_OFFER }]);
  const removeOffer = (i) => setOffers(o => o.filter((_, idx) => idx !== i));

  const handleSubmitPlan = async () => {
    setPlanError(""); setPlanSuccess(false);
    if (!plan.title)  { setPlanError("Plan title is required."); return; }
    if (!plan.vision) { setPlanError("Design vision is required."); return; }
    setSubmittingPlan(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:5000/design-requests/${id}/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...plan,
          estimated_budget: plan.estimated_budget ? Number(plan.estimated_budget) : null,
          stages,
          designer_id: designer?.id,
        }),
      });
      const data = await res.json();
      if (res.ok) { setPlanSuccess(true); setIsEditMode(true); }
      else setPlanError(data.message || data.error || "Something went wrong.");
    } catch { setPlanError("Network error."); }
    finally { setSubmittingPlan(false); }
  };

  const handlePublishOffer = async (i) => {
    const offer = offers[i];
    const errs = { ...offerErrors };
    delete errs[i];
    setOfferErrors(errs);
    if (!offer.work_type) { setOfferErrors(e => ({ ...e, [i]: "Work type is required." })); return; }
    if (!offer.budget || isNaN(Number(offer.budget))) { setOfferErrors(e => ({ ...e, [i]: "Valid budget is required." })); return; }
    setPublishingOffer(i);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:5000/design-requests/${id}/contractor-offers`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...offer,
          budget: Number(offer.budget),
          request_id: Number(id),
          designer_id: designer?.id,
        }),
      });
      const data = await res.json();
      if (res.ok) setOfferSuccess(s => ({ ...s, [i]: true }));
      else setOfferErrors(e => ({ ...e, [i]: data.message || data.error || "Something went wrong." }));
    } catch { setOfferErrors(e => ({ ...e, [i]: "Network error." })); }
    finally { setPublishingOffer(null); }
  };

  // ✅ تحديد/إلغاء تحديد عرض مقاول
  const toggleSelectOffer = (offerId) => {
    const selected = { ...selectedOffers };
    const alreadySelected = selected[offerId];
    const selectedCount = Object.values(selected).filter(v => v?.selected).length;

    if (alreadySelected?.selected) {
      selected[offerId] = { selected: false, recommendation: "" };
    } else {
      if (selectedCount >= 3) { setSendError("You can select up to 3 offers only."); return; }
      selected[offerId] = { selected: true, recommendation: selected[offerId]?.recommendation || "" };
    }
    setSendError("");
    setSelectedOffers(selected);
  };

  const setRecommendation = (offerId, text) => {
    setSelectedOffers(s => ({ ...s, [offerId]: { ...s[offerId], recommendation: text } }));
  };

  // ✅ إرسال الخطة + العروض المختارة للعميل
  const handleSendToClient = async () => {
    const selected = Object.entries(selectedOffers).filter(([, v]) => v?.selected);
    if (selected.length === 0) { setSendError("Please select at least one offer."); return; }
    setSendError(""); setSendingToClient(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:5000/design-requests/${id}/send-to-client`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          designer_id: designer?.id,
          selected_offers: selected.map(([offer_id, v]) => ({
            offer_id: Number(offer_id),
            recommendation: v.recommendation,
          })),
        }),
      });
      const data = await res.json();
      if (res.ok) setSendSuccess(true);
      else setSendError(data.message || data.error || "Something went wrong.");
    } catch { setSendError("Network error."); }
    finally { setSendingToClient(false); }
  };

  const selectedCount = Object.values(selectedOffers).filter(v => v?.selected).length;

  const sectionTitle = (label, badge) => (
    <div style={{ fontSize: 11, fontWeight: 500, color: C.stone, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20, paddingBottom: 10, borderBottom: `0.5px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      {label}
      {badge}
    </div>
  );

  if (loadingPlan || loadingReq) {
    return (
      <div style={{ display: "flex", height: "100vh", fontFamily: f.font, background: C.bg }}>
        <DesignerSidebar variant="light" />
        <main style={{ flex: 1, padding: "32px 40px", display: "flex", flexDirection: "column", gap: 16 }}>
          {[80, 300, 200].map((h, i) => (
            <div key={i} style={{ height: h, background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 14 }} />
          ))}
        </main>
      </div>
    );
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; } body { margin: 0; }
        ::placeholder { color: #C8BEB4; font-size: 12px; font-weight: 300; }
        .cp-inp:focus { border-color: #8C7B6B !important; background: #fff !important; outline: none; box-shadow: 0 0 0 3px rgba(140,123,107,0.08); }
        .cp-ta:focus  { border-color: #8C7B6B !important; background: #fff !important; outline: none; box-shadow: 0 0 0 3px rgba(140,123,107,0.08); }
        .cp-sel:focus { border-color: #8C7B6B !important; outline: none; }
        .add-btn:hover { border-color: #8C7B6B !important; color: #2C221A !important; }
        .remove-btn:hover { color: #B05030 !important; }
        .offer-card:hover { border-color: #8C7B6B !important; }
      `}</style>

      <div style={{ display: "flex", height: "100vh", fontFamily: f.font, background: C.bg }}>
        <DesignerSidebar variant="light" />

        <main style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }}>

          {/* Top bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
            <button onClick={() => navigate("/designer/manage")}
              style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: C.stone, fontSize: 12, fontFamily: f.font, letterSpacing: "0.05em" }}
              onMouseEnter={e => e.currentTarget.style.color = C.dark}
              onMouseLeave={e => e.currentTarget.style.color = C.stone}>
              <ArrowLeft size={14} strokeWidth={1.5} />
              Back to Projects
            </button>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: f.serif, fontSize: 14, fontWeight: 600, color: C.sand }}>
              {initials}
            </div>
          </div>

          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 9, color: C.muted, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 6 }}>
              REQUEST #{id} — {request?.space_type || ""}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <h1 style={{ fontFamily: f.serif, fontSize: 36, fontWeight: 400, color: C.dark, lineHeight: 1.15 }}>
                {isEditMode ? "Edit Design Plan" : "Create Design Plan"}
              </h1>
              {isEditMode && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 20, fontSize: 10, background: "rgba(74,102,69,0.10)", color: C.success, fontFamily: f.font, letterSpacing: ".06em" }}>
                  <Edit3 size={10} strokeWidth={1.5} />
                  Saved
                </span>
              )}
            </div>
            <p style={{ fontSize: 13, color: C.muted, fontWeight: 300, lineHeight: 1.75, maxWidth: 480 }}>
              {isEditMode
                ? "Your plan is saved — update it anytime or add new contractor offers."
                : "Define your design vision and send contractor offers — all from one place."}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 24, alignItems: "start" }}>

            {/* ── LEFT: Design Plan ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 14, padding: "24px 28px" }}>
                {sectionTitle("Design Plan")}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <Label>Plan Title</Label>
                    <input className="cp-inp" name="title" value={plan.title} onChange={setPlanField}
                      placeholder="e.g. Modern Luxury Living Room Concept"
                      style={inpSt(planError && !plan.title)} />
                  </div>
                  <div>
                    <Label>Design Vision</Label>
                    <textarea className="cp-ta" name="vision" value={plan.vision} onChange={setPlanField}
                      rows={4} placeholder="Describe your design vision, concept, and approach..."
                      style={{ ...inpSt(planError && !plan.vision), resize: "none", lineHeight: 1.65 }} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div>
                      <Label>Proposed Materials</Label>
                      <input className="cp-inp" name="materials" value={plan.materials} onChange={setPlanField}
                        placeholder="e.g. Marble, Oak Wood, Brass" style={inpSt()} />
                    </div>
                    <div>
                      <Label>Color Palette</Label>
                      <input className="cp-inp" name="colors" value={plan.colors} onChange={setPlanField}
                        placeholder="e.g. Ivory, Warm Grey, Gold" style={inpSt()} />
                    </div>
                  </div>
                  <div>
                    <Label>Estimated Budget (SAR)</Label>
                    <input className="cp-inp" name="estimated_budget" type="number" value={plan.estimated_budget} onChange={setPlanField}
                      placeholder="e.g. 25,000" style={inpSt()} />
                  </div>
                </div>
              </div>

              {/* Project Stages */}
              <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 14, padding: "24px 28px" }}>
                {sectionTitle("Project Stages")}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {stages.map((stage, i) => (
                    <div key={i} style={{ background: C.sec, borderRadius: 10, padding: "16px", border: `0.5px solid ${C.border}` }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                        <span style={{ fontSize: 10, fontWeight: 500, color: C.stone, letterSpacing: "0.1em", textTransform: "uppercase" }}>Stage {i + 1}</span>
                        {stages.length > 1 && (
                          <button className="remove-btn" onClick={() => removeStage(i)}
                            style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, transition: "color .15s", padding: 0 }}>
                            <Trash2 size={13} strokeWidth={1.5} />
                          </button>
                        )}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                        <div>
                          <Label>Stage Title</Label>
                          <input className="cp-inp" name="title" value={stage.title} onChange={e => setStage(i, e)}
                            placeholder="e.g. Site Survey" style={inpSt()} />
                        </div>
                        <div>
                          <Label>Duration</Label>
                          <input className="cp-inp" name="duration" value={stage.duration} onChange={e => setStage(i, e)}
                            placeholder="e.g. 1 Week" style={inpSt()} />
                        </div>
                      </div>
                      <div>
                        <Label>Description</Label>
                        <textarea className="cp-ta" name="description" value={stage.description} onChange={e => setStage(i, e)}
                          rows={2} placeholder="What happens in this stage..."
                          style={{ ...inpSt(), resize: "none", lineHeight: 1.65 }} />
                      </div>
                    </div>
                  ))}
                  <button className="add-btn" onClick={addStage}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px", borderRadius: 8, border: `0.5px dashed ${C.border}`, background: "transparent", color: C.muted, fontSize: 11, fontFamily: f.font, cursor: "pointer", transition: "all .15s" }}>
                    <Plus size={13} strokeWidth={1.5} />
                    Add Stage
                  </button>
                </div>
              </div>

              {planError && (
                <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(176,80,48,0.07)", border: "0.5px solid rgba(176,80,48,0.2)", fontSize: 12, color: C.error }}>
                  {planError}
                </div>
              )}
              {planSuccess && (
                <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(74,102,69,0.08)", border: "0.5px solid rgba(74,102,69,0.2)", fontSize: 12, color: C.success, display: "flex", alignItems: "center", gap: 8 }}>
                  <CheckCircle size={13} strokeWidth={1.5} />
                  Design plan saved successfully!
                </div>
              )}
              <button onClick={handleSubmitPlan} disabled={submittingPlan}
                style={{ padding: "13px", borderRadius: 10, border: "none", background: submittingPlan ? C.stone : C.dark, color: C.sand, fontSize: 11, fontWeight: 500, fontFamily: f.font, letterSpacing: ".12em", textTransform: "uppercase", cursor: submittingPlan ? "not-allowed" : "pointer", transition: "background .15s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                onMouseEnter={e => { if (!submittingPlan) e.currentTarget.style.background = C.mid; }}
                onMouseLeave={e => { if (!submittingPlan) e.currentTarget.style.background = C.dark; }}>
                {submittingPlan ? "Saving..." : isEditMode ? "Update Design Plan →" : "Save Design Plan →"}
              </button>

              {/* ✅ قسم العروض الواردة من المقاولين */}
              <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 14, padding: "24px 28px" }}>
                {sectionTitle("Contractor Responses",
                  <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: incomingOffers.length > 0 ? "rgba(201,144,42,0.10)" : C.sec, color: incomingOffers.length > 0 ? C.accent : C.muted }}>
                    {incomingOffers.length} received
                  </span>
                )}

                {loadingOffers ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[1, 2].map(i => <div key={i} style={{ height: 80, background: C.sec, borderRadius: 10 }} />)}
                  </div>
                ) : incomingOffers.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "32px 0", color: C.muted, fontSize: 12 }}>
                    No contractor responses yet. Check back later.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <p style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>
                      Select up to <strong>3 offers</strong> to recommend to your client. Add a note for each.
                    </p>
                    {incomingOffers.map((offer) => {
                      const isSelected = selectedOffers[offer.id]?.selected;
                      const budget = offer.provider_budget ?? offer.budget;
                      const duration = offer.provider_duration ?? offer.duration;
                      const description = offer.provider_description ?? offer.description;

                      return (
                        <div key={offer.id} className="offer-card"
                          style={{ borderRadius: 10, padding: "14px 16px", border: `0.5px solid ${isSelected ? C.accent : C.border}`, background: isSelected ? "rgba(201,144,42,0.04)" : C.sec, transition: "border-color .15s, background .15s", cursor: "pointer" }}
                          onClick={() => toggleSelectOffer(offer.id)}>
                          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                <span style={{ fontSize: 12, fontWeight: 500, color: C.dark }}>{offer.work_type}</span>
                                {offer.provider_name && (
                                  <span style={{ fontSize: 10, color: C.muted }}>by {offer.provider_name}</span>
                                )}
                              </div>
                              <div style={{ display: "flex", gap: 14, fontSize: 11, color: C.stone }}>
                                <span>{budget ? `${Number(budget).toLocaleString()} SAR` : "—"}</span>
                                {duration && <span>· {duration}</span>}
                              </div>
                              {description && (
                                <p style={{ fontSize: 11, color: C.muted, marginTop: 6, lineHeight: 1.6 }}>
                                  {description.length > 80 ? description.slice(0, 80) + "..." : description}
                                </p>
                              )}
                            </div>
                            <div style={{ flexShrink: 0, width: 22, height: 22, borderRadius: "50%", border: `0.5px solid ${isSelected ? C.accent : C.border}`, background: isSelected ? C.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s" }}>
                              {isSelected && <CheckCircle size={12} strokeWidth={2} color="#fff" />}
                            </div>
                          </div>

                          {/* حقل التوصية — يظهر عند التحديد */}
                          {isSelected && (
                            <div style={{ marginTop: 12 }} onClick={e => e.stopPropagation()}>
                              <Label>Your Recommendation</Label>
                              <textarea className="cp-ta"
                                value={selectedOffers[offer.id]?.recommendation || ""}
                                onChange={e => setRecommendation(offer.id, e.target.value)}
                                rows={2}
                                placeholder="Why do you recommend this contractor?"
                                style={{ ...inpSt(), resize: "none", lineHeight: 1.65 }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* زر Send to Client */}
                    <div style={{ marginTop: 8 }}>
                      {sendError && (
                        <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(176,80,48,0.07)", border: "0.5px solid rgba(176,80,48,0.2)", fontSize: 12, color: C.error, marginBottom: 10 }}>
                          {sendError}
                        </div>
                      )}
                      {sendSuccess ? (
                        <div style={{ padding: "12px 14px", borderRadius: 8, background: "rgba(74,102,69,0.08)", border: "0.5px solid rgba(74,102,69,0.2)", fontSize: 12, color: C.success, display: "flex", alignItems: "center", gap: 8 }}>
                          <CheckCircle size={13} strokeWidth={1.5} />
                          Sent to client successfully!
                        </div>
                      ) : (
                        <button onClick={handleSendToClient} disabled={sendingToClient || selectedCount === 0}
                          style={{ width: "100%", padding: "13px", borderRadius: 10, border: "none", background: selectedCount === 0 ? C.sec : C.dark, color: selectedCount === 0 ? C.muted : C.sand, fontSize: 11, fontWeight: 500, fontFamily: f.font, letterSpacing: ".12em", textTransform: "uppercase", cursor: (sendingToClient || selectedCount === 0) ? "not-allowed" : "pointer", transition: "background .15s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                          onMouseEnter={e => { if (selectedCount > 0 && !sendingToClient) e.currentTarget.style.background = C.mid; }}
                          onMouseLeave={e => { if (selectedCount > 0 && !sendingToClient) e.currentTarget.style.background = C.dark; }}>
                          <Send size={13} strokeWidth={1.5} />
                          {sendingToClient ? "Sending..." : `Send to Client (${selectedCount}/3) →`}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT: Contractor Offers ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 14, padding: "24px 28px" }}>
                {sectionTitle("Contractor Offers")}
                <p style={{ fontSize: 12, color: C.muted, fontWeight: 300, lineHeight: 1.7, marginBottom: 20 }}>
                  Publish offers to contractors — they'll review and accept or decline.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {offers.map((offer, i) => (
                    <div key={i} style={{ background: C.sec, borderRadius: 10, padding: "16px", border: `0.5px solid ${offerErrors[i] ? C.error : C.border}` }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                        <span style={{ fontSize: 10, fontWeight: 500, color: C.stone, letterSpacing: "0.1em", textTransform: "uppercase" }}>Offer {i + 1}</span>
                        {offers.length > 1 && (
                          <button className="remove-btn" onClick={() => removeOffer(i)}
                            style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, transition: "color .15s", padding: 0 }}>
                            <Trash2 size={13} strokeWidth={1.5} />
                          </button>
                        )}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <div>
                          <Label>Work Type</Label>
                          <div style={{ position: "relative" }}>
                            <select className="cp-sel" name="work_type" value={offer.work_type} onChange={e => setOffer(i, e)} style={selSt}>
                              <option value="">Select work type...</option>
                              <option>Carpentry</option>
                              <option>Painting</option>
                              <option>Flooring</option>
                              <option>Electrical</option>
                              <option>Plumbing</option>
                              <option>HVAC</option>
                              <option>General Contracting</option>
                              <option>Other</option>
                            </select>
                            <svg style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                              width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M2 3.5L5 6.5L8 3.5" stroke={C.muted} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <Label>Description</Label>
                          <textarea className="cp-ta" name="description" value={offer.description} onChange={e => setOffer(i, e)}
                            rows={2} placeholder="Describe the work needed..."
                            style={{ ...inpSt(), resize: "none", lineHeight: 1.65 }} />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                          <div>
                            <Label>Budget (SAR)</Label>
                            <input className="cp-inp" name="budget" type="number" value={offer.budget} onChange={e => setOffer(i, e)}
                              placeholder="e.g. 5,000" style={inpSt()} />
                          </div>
                          <div>
                            <Label>Duration</Label>
                            <input className="cp-inp" name="duration" value={offer.duration} onChange={e => setOffer(i, e)}
                              placeholder="e.g. 2 Weeks" style={inpSt()} />
                          </div>
                        </div>
                        <div>
                          <Label>Notes (optional)</Label>
                          <input className="cp-inp" name="notes" value={offer.notes} onChange={e => setOffer(i, e)}
                            placeholder="Any additional notes..." style={inpSt()} />
                        </div>
                        {offerErrors[i] && <div style={{ fontSize: 11, color: C.error }}>{offerErrors[i]}</div>}
                        {offerSuccess[i] && (
                          <div style={{ fontSize: 11, color: C.success, display: "flex", alignItems: "center", gap: 6 }}>
                            <CheckCircle size={12} strokeWidth={1.5} />
                            Published successfully!
                          </div>
                        )}
                        <button onClick={() => handlePublishOffer(i)} disabled={publishingOffer === i || offerSuccess[i]}
                          style={{ padding: "9px", borderRadius: 8, border: "none", background: offerSuccess[i] ? "rgba(74,102,69,0.12)" : C.dark, color: offerSuccess[i] ? C.success : C.sand, fontSize: 10, fontWeight: 500, fontFamily: f.font, letterSpacing: ".12em", textTransform: "uppercase", cursor: (publishingOffer === i || offerSuccess[i]) ? "not-allowed" : "pointer", transition: "background .15s", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                          onMouseEnter={e => { if (publishingOffer !== i && !offerSuccess[i]) e.currentTarget.style.background = C.mid; }}
                          onMouseLeave={e => { if (publishingOffer !== i && !offerSuccess[i]) e.currentTarget.style.background = C.dark; }}>
                          <Send size={11} strokeWidth={1.5} />
                          {publishingOffer === i ? "Publishing..." : offerSuccess[i] ? "Published" : "Publish Offer"}
                        </button>
                      </div>
                    </div>
                  ))}
                  <button className="add-btn" onClick={addOffer}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px", borderRadius: 8, border: `0.5px dashed ${C.border}`, background: "transparent", color: C.muted, fontSize: 11, fontFamily: f.font, cursor: "pointer", transition: "all .15s" }}>
                    <Plus size={13} strokeWidth={1.5} />
                    Add Another Offer
                  </button>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}