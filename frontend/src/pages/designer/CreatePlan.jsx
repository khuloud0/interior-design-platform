import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DesignerSidebar from "../../components/DesignerSidebar";
import {
  ArrowLeft, Plus, Trash2, Send, CheckCircle, Edit3,
  Clock, DollarSign, User, Home, Palette, Maximize2,
  Upload, X, FileText, Image, File
} from "lucide-react";

const C = {
  dark: "#2C221A", mid: "#3D3128", sand: "#D4C4B0",
  stone: "#8C7B6B", muted: "#B0A090", border: "#C8B8A8",
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

const OFFER_STATUS = {
  pending:             { label: "Waiting",          bg: "rgba(176,160,144,0.15)", color: "#8C7B6B", dot: "#B0A090" },
  submitted:           { label: "Provider Replied", bg: "rgba(201,144,42,0.12)",  color: "#9B5E2A", dot: "#C9902A" },
  selected_for_client: { label: "Sent to Client",   bg: "rgba(30,107,94,0.10)",   color: "#1E6B5E", dot: "#1E6B5E" },
  active:              { label: "Active",            bg: "rgba(74,102,69,0.10)",   color: "#4A6645", dot: "#5C7057" },
  declined:            { label: "Declined",          bg: "rgba(176,80,48,0.08)",   color: "#B05030", dot: "#C97D4E" },
};

const OfferStatusBadge = ({ status }) => {
  const s = OFFER_STATUS[status] || OFFER_STATUS.pending;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 9, padding: "3px 8px", borderRadius: 20, background: s.bg, color: s.color, fontFamily: f.font, letterSpacing: ".06em", whiteSpace: "nowrap" }}>
      <span style={{ width: 4, height: 4, borderRadius: "50%", background: s.dot }} />
      {s.label}
    </span>
  );
};

const sectionTitle = (label, badge) => (
  <div style={{ fontSize: 11, fontWeight: 500, color: C.stone, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20, paddingBottom: 10, borderBottom: `0.5px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    {label}{badge}
  </div>
);

const EMPTY_OFFER = { work_type: "", description: "", budget: "", duration: "", notes: "" };

// ── File type helpers ──
const getFileIcon = (file) => {
  const type = file.type || "";
  if (type.startsWith("image/")) return <Image size={14} strokeWidth={1.5} color={C.accent} />;
  if (type === "application/pdf") return <FileText size={14} strokeWidth={1.5} color="#B05030" />;
  return <File size={14} strokeWidth={1.5} color={C.stone} />;
};

const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function CreatePlan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // ── Request ──
  const [request, setRequest]       = useState(null);
  const [loadingReq, setLoadingReq] = useState(true);

  // ── Plan ──
  const [loadingPlan, setLoadingPlan]           = useState(true);
  const [isEditMode, setIsEditMode]             = useState(false);
  const [plan, setPlan]                         = useState({ title: "", vision: "", materials: "", colors: "", estimated_budget: "" });
  const [submittingPlan, setSubmittingPlan]     = useState(false);
  const [planSuccess, setPlanSuccess]           = useState(false);
  const [planError, setPlanError]               = useState("");

  // ── Attachments ──
  const [attachments, setAttachments]           = useState([]);   // { file, preview, path, uploading, uploaded, error }
  const [dragOver, setDragOver]                 = useState(false);

  // ── Published Offers ──
  const [publishedOffers, setPublishedOffers]   = useState([]);
  const [loadingPublished, setLoadingPublished] = useState(true);

  // ── New Offer Form ──
  const [offers, setOffers]                     = useState([{ ...EMPTY_OFFER }]);
  const [publishingOffer, setPublishingOffer]   = useState(null);
  const [offerErrors, setOfferErrors]           = useState({});
  const [offerSuccess, setOfferSuccess]         = useState({});

  // ── Contractor Responses ──
  const [incomingOffers, setIncomingOffers]     = useState([]);
  const [loadingOffers, setLoadingOffers]       = useState(true);
  const [selectedOffers, setSelectedOffers]     = useState({});
  const [sendingToClient, setSendingToClient]   = useState(false);
  const [sendSuccess, setSendSuccess]           = useState(false);
  const [sendError, setSendError]               = useState("");

  const designer = JSON.parse(localStorage.getItem("user") || "{}");
  const initials = designer?.name?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?";

  useEffect(() => {
    const load = async () => {
      setLoadingReq(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://127.0.0.1:5000/design-requests/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (res.ok) setRequest(data.request ?? data);
      } catch {}
      finally { setLoadingReq(false); }
    };
    load();
  }, [id]);

  useEffect(() => {
    const loadPlan = async () => {
      setLoadingPlan(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://127.0.0.1:5000/design-requests/${id}/plan`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (res.ok && data.plan) {
          const p = data.plan;
          setPlan({ title: p.title || "", vision: p.vision || "", materials: p.materials || "", colors: p.colors || "", estimated_budget: p.estimated_budget || "" });
          // Load saved attachments if any
          if (p.attachments?.length > 0) {
            setAttachments(p.attachments.map(a => ({ file: null, preview: a.url || null, path: a.path || a.url, name: a.name, size: a.size, type: a.type, uploading: false, uploaded: true, error: null })));
          }
          setIsEditMode(true);
        }
      } catch {}
      finally { setLoadingPlan(false); }
    };
    loadPlan();
  }, [id]);

  const loadPublishedOffers = async () => {
    setLoadingPublished(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:5000/design-requests/${id}/contractor-offers/published`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setPublishedOffers(data.offers ?? []);
    } catch {}
    finally { setLoadingPublished(false); }
  };
  useEffect(() => { loadPublishedOffers(); }, [id]);

  const loadIncomingOffers = async () => {
    setLoadingOffers(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:5000/design-requests/${id}/contractor-offers/responses`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setIncomingOffers(data.offers ?? []);
    } catch {}
    finally { setLoadingOffers(false); }
  };
  useEffect(() => { loadIncomingOffers(); }, [id]);

  // ── Plan handlers ──
  const setPlanField = (e) => setPlan(p => ({ ...p, [e.target.name]: e.target.value }));

  // ── Attachment handlers ──
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
  const MAX_SIZE = 20 * 1024 * 1024; // 20MB

  const processFiles = (files) => {
    const newItems = [];
    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        newItems.push({ file, name: file.name, size: file.size, type: file.type, preview: null, path: null, uploading: false, uploaded: false, error: "Unsupported file type." });
        continue;
      }
      if (file.size > MAX_SIZE) {
        newItems.push({ file, name: file.name, size: file.size, type: file.type, preview: null, path: null, uploading: false, uploaded: false, error: "File exceeds 20MB limit." });
        continue;
      }
      const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
      newItems.push({ file, name: file.name, size: file.size, type: file.type, preview, path: null, uploading: false, uploaded: false, error: null });
    }
    setAttachments(prev => {
      const updated = [...prev, ...newItems];
      // Auto-upload valid new items
      newItems.forEach((item, relIdx) => {
        if (!item.error) uploadFile(prev.length + relIdx, item.file, updated);
      });
      return updated;
    });
  };

  const uploadFile = async (index, file, currentList) => {
    setAttachments(prev => prev.map((a, i) => i === index ? { ...a, uploading: true } : a));
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("request_id", id);
      const res = await fetch(`http://127.0.0.1:5000/design-requests/${id}/plan/attachments`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setAttachments(prev => prev.map((a, i) => i === index ? { ...a, uploading: false, uploaded: true, path: data.path || data.url || file.name } : a));
      } else {
        setAttachments(prev => prev.map((a, i) => i === index ? { ...a, uploading: false, error: data.message || "Upload failed." } : a));
      }
    } catch {
      setAttachments(prev => prev.map((a, i) => i === index ? { ...a, uploading: false, error: "Network error." } : a));
    }
  };

  const retryUpload = (index) => {
    const item = attachments[index];
    if (item?.file) uploadFile(index, item.file, attachments);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => {
      const item = prev[index];
      if (item?.preview) URL.revokeObjectURL(item.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFiles(Array.from(e.dataTransfer.files));
  };

  const handleFileInput = (e) => {
    processFiles(Array.from(e.target.files));
    e.target.value = "";
  };

  const handleSubmitPlan = async () => {
    setPlanError(""); setPlanSuccess(false);
    if (!plan.title)  { setPlanError("Plan title is required."); return; }
    if (!plan.vision) { setPlanError("Design vision is required."); return; }
    setSubmittingPlan(true);
    try {
      const token = localStorage.getItem("token");
      const uploadedPaths = attachments.filter(a => a.uploaded && a.path).map(a => ({ path: a.path, name: a.name, type: a.type, size: a.size }));
      const res = await fetch(`http://127.0.0.1:5000/design-requests/${id}/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...plan, estimated_budget: plan.estimated_budget ? Number(plan.estimated_budget) : null, attachments: uploadedPaths, designer_id: designer?.id }),
      });
      const data = await res.json();
      if (res.ok) { setPlanSuccess(true); setIsEditMode(true); }
      else setPlanError(data.message || data.error || "Something went wrong.");
    } catch { setPlanError("Network error."); }
    finally { setSubmittingPlan(false); }
  };

  // ── New Offer handlers ──
  const setOffer = (i, e) => setOffers(o => o.map((of, idx) => idx === i ? { ...of, [e.target.name]: e.target.value } : of));
  const addOffer    = () => setOffers(o => [...o, { ...EMPTY_OFFER }]);
  const removeOffer = (i) => setOffers(o => o.filter((_, idx) => idx !== i));

  const handlePublishOffer = async (i) => {
    const offer = offers[i];
    const errs = { ...offerErrors }; delete errs[i]; setOfferErrors(errs);
    if (!offer.work_type) { setOfferErrors(e => ({ ...e, [i]: "Work type is required." })); return; }
    if (!offer.budget || isNaN(Number(offer.budget))) { setOfferErrors(e => ({ ...e, [i]: "Valid budget is required." })); return; }
    setPublishingOffer(i);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:5000/design-requests/${id}/contractor-offers`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...offer, budget: Number(offer.budget), request_id: Number(id), designer_id: designer?.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setOfferSuccess(s => ({ ...s, [i]: true }));
        loadPublishedOffers();
      } else setOfferErrors(e => ({ ...e, [i]: data.message || data.error || "Something went wrong." }));
    } catch { setOfferErrors(e => ({ ...e, [i]: "Network error." })); }
    finally { setPublishingOffer(null); }
  };

  // ── Contractor Response handlers ──
  const toggleSelectOffer = (offerId) => {
    const selected = { ...selectedOffers };
    const selectedCount = Object.values(selected).filter(v => v?.selected).length;
    if (selected[offerId]?.selected) {
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

  const handleSendToClient = async () => {
    const selected = Object.entries(selectedOffers).filter(([, v]) => v?.selected);
    if (selected.length === 0) { setSendError("Please select at least one offer."); return; }
    setSendError(""); setSendingToClient(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:5000/design-requests/${id}/send-to-client`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ designer_id: designer?.id, selected_offers: selected.map(([offer_id, v]) => ({ offer_id: Number(offer_id), recommendation: v.recommendation })) }),
      });
      const data = await res.json();
      if (res.ok) {
        setSendSuccess(true);
        loadPublishedOffers();
        loadIncomingOffers();
      } else setSendError(data.message || data.error || "Something went wrong.");
    } catch { setSendError("Network error."); }
    finally { setSendingToClient(false); }
  };

  const selectedCount = Object.values(selectedOffers).filter(v => v?.selected).length;

  if (loadingPlan || loadingReq) {
    return (
      <div style={{ display: "flex", height: "100vh", fontFamily: f.font, background: C.bg }}>
        <DesignerSidebar variant="light" />
        <main style={{ flex: 1, padding: "32px 40px", display: "flex", flexDirection: "column", gap: 16 }}>
          {[60, 80, 300, 200].map((h, i) => <div key={i} style={{ height: h, background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 14 }} />)}
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
        .attach-item:hover .attach-remove { opacity: 1 !important; }
        .dropzone-active { border-color: #8C7B6B !important; background: rgba(140,123,107,0.04) !important; }
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
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: f.serif, fontSize: 14, fontWeight: 600, color: C.sand }}>{initials}</div>
          </div>

          {/* Client Request Summary */}
          {request && (
            <div style={{ background: C.dark, borderRadius: 16, padding: "20px 24px", marginBottom: 28, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 24px,#D4C4B0 24px,#D4C4B0 25px),repeating-linear-gradient(90deg,transparent,transparent 24px,#D4C4B0 24px,#D4C4B0 25px)" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ fontSize: 9, color: "rgba(212,196,176,0.45)", letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 8 }}>
                  REQUEST #{id} — CLIENT PROJECT
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontFamily: f.serif, fontSize: 24, fontWeight: 400, color: "#fff", marginBottom: 4 }}>
                      {request.space_type} Design
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(212,196,176,0.5)", fontWeight: 300 }}>
                      {request.client_name}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {[
                      { icon: <Home size={10} strokeWidth={1.5} />, val: request.space_type },
                      { icon: <Palette size={10} strokeWidth={1.5} />, val: request.preferred_style },
                      { icon: <DollarSign size={10} strokeWidth={1.5} />, val: request.budget ? `${Number(request.budget).toLocaleString()} SAR` : null },
                      { icon: <Maximize2 size={10} strokeWidth={1.5} />, val: request.space_size ? `${request.space_size} m²` : null },
                    ].filter(t => t.val).map((t, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 99, background: "rgba(212,196,176,0.07)", border: "0.5px solid rgba(212,196,176,0.12)", fontSize: 10, color: "rgba(212,196,176,0.6)", fontFamily: f.font }}>
                        {t.icon} {t.val}
                      </div>
                    ))}
                  </div>
                </div>
                {request.space_details && (
                  <div style={{ marginTop: 12, fontSize: 12, color: "rgba(212,196,176,0.4)", fontWeight: 300, fontStyle: "italic", lineHeight: 1.6, maxWidth: 600 }}>
                    "{request.space_details}"
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Page header */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
              <h1 style={{ fontFamily: f.serif, fontSize: 32, fontWeight: 400, color: C.dark, lineHeight: 1.15 }}>
                {isEditMode ? "Edit Design Plan" : "Create Design Plan"}
              </h1>
              {isEditMode && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 20, fontSize: 10, background: "rgba(74,102,69,0.10)", color: C.success, fontFamily: f.font }}>
                  <Edit3 size={10} strokeWidth={1.5} /> Saved
                </span>
              )}
            </div>
            <p style={{ fontSize: 12, color: C.muted, fontWeight: 300, lineHeight: 1.7 }}>
              {isEditMode ? "Your plan is saved — update it or manage contractor offers below." : "Build your design vision and publish offers to contractors."}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24, alignItems: "start" }}>

            {/* ── LEFT ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Design Plan */}
              <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 14, padding: "24px 28px" }}>
                {sectionTitle("Design Plan")}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <Label>Plan Title</Label>
                    <input className="cp-inp" name="title" value={plan.title} onChange={setPlanField} placeholder="e.g. Modern Luxury Living Room Concept" style={inpSt(planError && !plan.title)} />
                  </div>
                  <div>
                    <Label>Design Vision</Label>
                    <textarea className="cp-ta" name="vision" value={plan.vision} onChange={setPlanField} rows={4} placeholder="Describe your design vision..." style={{ ...inpSt(planError && !plan.vision), resize: "none", lineHeight: 1.65 }} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div><Label>Proposed Materials</Label><input className="cp-inp" name="materials" value={plan.materials} onChange={setPlanField} placeholder="e.g. Marble, Oak Wood" style={inpSt()} /></div>
                    <div><Label>Color Palette</Label><input className="cp-inp" name="colors" value={plan.colors} onChange={setPlanField} placeholder="e.g. Ivory, Gold" style={inpSt()} /></div>
                  </div>
                  <div>
                    <Label>Estimated Budget (SAR)</Label>
                    <input className="cp-inp" name="estimated_budget" type="number" value={plan.estimated_budget} onChange={setPlanField} placeholder="e.g. 25,000" style={inpSt()} />
                  </div>
                </div>
              </div>

              {/* ── Attachments ── */}
              <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 14, padding: "24px 28px" }}>
                {sectionTitle("Attachments",
                  <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: attachments.length > 0 ? "rgba(201,144,42,0.10)" : C.sec, color: attachments.length > 0 ? C.accent : C.muted }}>
                    {attachments.length} file{attachments.length !== 1 ? "s" : ""}
                  </span>
                )}

                <p style={{ fontSize: 12, color: C.muted, fontWeight: 300, lineHeight: 1.7, marginBottom: 16 }}>
                  Upload inspiration images, floor plans, mood boards, or reference documents (PDF, DOCX, JPG, PNG — up to 20MB each).
                </p>

                {/* Drop Zone */}
                <div
                  className={dragOver ? "dropzone-active" : ""}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: `1.5px dashed ${dragOver ? C.stone : C.border}`,
                    borderRadius: 10,
                    padding: "28px 20px",
                    textAlign: "center",
                    cursor: "pointer",
                    background: dragOver ? "rgba(140,123,107,0.04)" : C.sec,
                    transition: "all .2s",
                    marginBottom: attachments.length > 0 ? 16 : 0,
                  }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(140,123,107,0.10)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Upload size={18} strokeWidth={1.3} color={C.stone} />
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500, color: C.dark, marginBottom: 4 }}>
                        Drop files here or <span style={{ color: C.accent, textDecoration: "underline" }}>browse</span>
                      </div>
                      <div style={{ fontSize: 11, color: C.muted }}>PDF, DOCX, JPG, PNG, GIF, WEBP · Max 20MB per file</div>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp"
                    style={{ display: "none" }}
                    onChange={handleFileInput}
                  />
                </div>

                {/* File list */}
                {attachments.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {attachments.map((item, index) => (
                      <div
                        key={index}
                        className="attach-item"
                        style={{
                          display: "flex", alignItems: "center", gap: 12,
                          padding: "10px 12px", borderRadius: 8,
                          border: `0.5px solid ${item.error ? C.error : item.uploaded ? "rgba(74,102,69,0.25)" : C.border}`,
                          background: item.error ? "rgba(176,80,48,0.04)" : item.uploaded ? "rgba(74,102,69,0.04)" : C.sec,
                          position: "relative",
                        }}>
                        {/* Thumbnail / Icon */}
                        <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 6, overflow: "hidden", background: "rgba(140,123,107,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {item.preview
                            ? <img src={item.preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            : getFileIcon(item)
                          }
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 500, color: C.dark, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                            <span style={{ fontSize: 10, color: C.muted }}>{formatFileSize(item.size)}</span>
                            {item.uploading && <span style={{ fontSize: 10, color: C.accent }}>Uploading...</span>}
                            {item.uploaded && !item.error && <span style={{ fontSize: 10, color: C.success, display: "flex", alignItems: "center", gap: 3 }}><CheckCircle size={9} strokeWidth={2} /> Uploaded</span>}
                            {item.error && (
                              <span style={{ fontSize: 10, color: C.error, display: "flex", alignItems: "center", gap: 4 }}>
                                {item.error}
                                {item.file && <button onClick={() => retryUpload(index)} style={{ background: "none", border: "none", cursor: "pointer", color: C.accent, fontSize: 10, fontFamily: f.font, padding: 0, textDecoration: "underline" }}>Retry</button>}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Remove */}
                        <button
                          className="attach-remove"
                          onClick={() => removeAttachment(index)}
                          style={{ opacity: 0, flexShrink: 0, background: "none", border: "none", cursor: "pointer", color: C.muted, padding: 4, borderRadius: 4, transition: "opacity .15s, color .15s" }}
                          onMouseEnter={e => e.currentTarget.style.color = C.error}
                          onMouseLeave={e => e.currentTarget.style.color = C.muted}>
                          <X size={13} strokeWidth={1.5} />
                        </button>

                        {/* Upload progress bar */}
                        {item.uploading && (
                          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, borderRadius: "0 0 8px 8px", background: C.border, overflow: "hidden" }}>
                            <div style={{ height: "100%", background: C.accent, width: "60%", animation: "progressPulse 1.2s ease-in-out infinite" }} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {planError && <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(176,80,48,0.07)", border: "0.5px solid rgba(176,80,48,0.2)", fontSize: 12, color: C.error }}>{planError}</div>}
              {planSuccess && (
                <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(74,102,69,0.08)", border: "0.5px solid rgba(74,102,69,0.2)", fontSize: 12, color: C.success, display: "flex", alignItems: "center", gap: 8 }}>
                  <CheckCircle size={13} strokeWidth={1.5} /> Design plan saved successfully!
                </div>
              )}
              <button onClick={handleSubmitPlan} disabled={submittingPlan}
                style={{ padding: "13px", borderRadius: 10, border: "none", background: submittingPlan ? C.stone : C.dark, color: C.sand, fontSize: 11, fontWeight: 500, fontFamily: f.font, letterSpacing: ".12em", textTransform: "uppercase", cursor: submittingPlan ? "not-allowed" : "pointer", transition: "background .15s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                onMouseEnter={e => { if (!submittingPlan) e.currentTarget.style.background = C.mid; }}
                onMouseLeave={e => { if (!submittingPlan) e.currentTarget.style.background = C.dark; }}>
                {submittingPlan ? "Saving..." : isEditMode ? "Update Design Plan →" : "Save Design Plan →"}
              </button>

              {/* Contractor Responses */}
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
                    {sendSuccess ? (
                      <div style={{ padding: "12px 14px", borderRadius: 8, background: "rgba(74,102,69,0.08)", border: "0.5px solid rgba(74,102,69,0.2)", fontSize: 12, color: C.success, display: "flex", alignItems: "center", gap: 8 }}>
                        <CheckCircle size={13} strokeWidth={1.5} /> Sent to client successfully!
                      </div>
                    ) : (
                      <>
                        <p style={{ fontSize: 11, color: C.muted }}>Select up to <strong>3 offers</strong> to recommend to your client.</p>
                        {incomingOffers.map((offer) => {
                          const isSelected = selectedOffers[offer.id]?.selected;
                          const budget = offer.provider_budget ?? offer.budget;
                          const duration = offer.provider_duration ?? offer.duration;
                          const description = offer.provider_description ?? offer.description;
                          return (
                            <div key={offer.id} className="offer-card"
                              style={{ borderRadius: 10, padding: "14px 16px", border: `0.5px solid ${isSelected ? C.accent : C.border}`, background: isSelected ? "rgba(201,144,42,0.04)" : C.sec, transition: "border-color .15s", cursor: "pointer" }}
                              onClick={() => toggleSelectOffer(offer.id)}>
                              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                                <div style={{ flex: 1 }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                    <span style={{ fontSize: 12, fontWeight: 500, color: C.dark }}>{offer.work_type}</span>
                                    {offer.provider_name && <span style={{ fontSize: 10, color: C.muted }}>by {offer.provider_name}</span>}
                                  </div>
                                  <div style={{ display: "flex", gap: 14, fontSize: 11, color: C.stone }}>
                                    <span>{budget ? `${Number(budget).toLocaleString()} SAR` : "—"}</span>
                                    {duration && <span>· {duration}</span>}
                                  </div>
                                  {description && <p style={{ fontSize: 11, color: C.muted, marginTop: 6, lineHeight: 1.6 }}>{description.length > 80 ? description.slice(0, 80) + "..." : description}</p>}
                                </div>
                                <div style={{ flexShrink: 0, width: 22, height: 22, borderRadius: "50%", border: `0.5px solid ${isSelected ? C.accent : C.border}`, background: isSelected ? C.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s" }}>
                                  {isSelected && <CheckCircle size={12} strokeWidth={2} color="#fff" />}
                                </div>
                              </div>
                              {isSelected && (
                                <div style={{ marginTop: 12 }} onClick={e => e.stopPropagation()}>
                                  <Label>Your Recommendation</Label>
                                  <textarea className="cp-ta" value={selectedOffers[offer.id]?.recommendation || ""} onChange={e => setRecommendation(offer.id, e.target.value)} rows={2} placeholder="Why do you recommend this contractor?" style={{ ...inpSt(), resize: "none", lineHeight: 1.65 }} />
                                </div>
                              )}
                            </div>
                          );
                        })}
                        {sendError && <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(176,80,48,0.07)", border: "0.5px solid rgba(176,80,48,0.2)", fontSize: 12, color: C.error }}>{sendError}</div>}
                        <button onClick={handleSendToClient} disabled={sendingToClient || selectedCount === 0}
                          style={{ width: "100%", padding: "13px", borderRadius: 10, border: "none", background: selectedCount === 0 ? C.sec : C.dark, color: selectedCount === 0 ? C.muted : C.sand, fontSize: 11, fontWeight: 500, fontFamily: f.font, letterSpacing: ".12em", textTransform: "uppercase", cursor: (sendingToClient || selectedCount === 0) ? "not-allowed" : "pointer", transition: "background .15s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                          onMouseEnter={e => { if (selectedCount > 0 && !sendingToClient) e.currentTarget.style.background = C.mid; }}
                          onMouseLeave={e => { if (selectedCount > 0 && !sendingToClient) e.currentTarget.style.background = C.dark; }}>
                          <Send size={13} strokeWidth={1.5} />
                          {sendingToClient ? "Sending..." : `Send to Client (${selectedCount}/3) →`}
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Published Offers */}
              <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 14, padding: "24px 28px" }}>
                {sectionTitle("Published Offers",
                  <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: "rgba(140,123,107,0.10)", color: C.stone }}>
                    {publishedOffers.length} sent
                  </span>
                )}
                {loadingPublished ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[1, 2].map(i => <div key={i} style={{ height: 70, background: C.sec, borderRadius: 10 }} />)}
                  </div>
                ) : publishedOffers.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "24px 0", color: C.muted, fontSize: 12 }}>
                    No offers published yet.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {publishedOffers.map((o, i) => (
                      <div key={o.id || i} style={{ borderRadius: 10, padding: "14px 16px", background: "#EDE8E2", border: `0.5px solid ${C.border}`, boxShadow: "0 2px 8px rgba(44,34,26,0.06)" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                          <span style={{ fontSize: 12, fontWeight: 500, color: C.dark }}>{o.work_type}</span>
                          <OfferStatusBadge status={o.status} />
                        </div>
                        <div style={{ display: "flex", gap: 16, fontSize: 11, color: C.stone }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <DollarSign size={10} strokeWidth={1.5} />
                            {o.budget ? Number(o.budget).toLocaleString() : "—"} SAR
                          </span>
                          {o.duration && (
                            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                              <Clock size={10} strokeWidth={1.5} />
                              {o.duration}
                            </span>
                          )}
                        </div>
                        {o.description && (
                          <p style={{ fontSize: 11, color: C.muted, marginTop: 6, lineHeight: 1.6 }}>
                            {o.description.length > 60 ? o.description.slice(0, 60) + "..." : o.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* New Contractor Offer */}
              <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 14, padding: "24px 28px" }}>
                {sectionTitle("New Contractor Offer")}
                <p style={{ fontSize: 12, color: C.muted, fontWeight: 300, lineHeight: 1.7, marginBottom: 20 }}>
                  Publish offers to contractors — they'll review and respond.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {offers.map((offer, i) => (
                    <div key={i} style={{ background: C.sec, borderRadius: 10, padding: "16px", border: `0.5px solid ${offerErrors[i] ? C.error : C.border}` }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                        <span style={{ fontSize: 10, fontWeight: 500, color: C.stone, letterSpacing: "0.1em", textTransform: "uppercase" }}>Offer {i + 1}</span>
                        {offers.length > 1 && (
                          <button className="remove-btn" onClick={() => removeOffer(i)} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, padding: 0, transition: "color .15s" }}>
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
                              <option>Carpentry</option><option>Painting</option><option>Flooring</option>
                              <option>Electrical</option><option>Plumbing</option><option>HVAC</option>
                              <option>General Contracting</option><option>Other</option>
                            </select>
                            <svg style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M2 3.5L5 6.5L8 3.5" stroke={C.muted} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <Label>Description</Label>
                          <textarea className="cp-ta" name="description" value={offer.description} onChange={e => setOffer(i, e)} rows={2} placeholder="Describe the work needed..." style={{ ...inpSt(), resize: "none", lineHeight: 1.65 }} />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                          <div><Label>Budget (SAR)</Label><input className="cp-inp" name="budget" type="number" value={offer.budget} onChange={e => setOffer(i, e)} placeholder="e.g. 5,000" style={inpSt()} /></div>
                          <div><Label>Duration</Label><input className="cp-inp" name="duration" value={offer.duration} onChange={e => setOffer(i, e)} placeholder="e.g. 2 Weeks" style={inpSt()} /></div>
                        </div>
                        <div><Label>Notes (optional)</Label><input className="cp-inp" name="notes" value={offer.notes} onChange={e => setOffer(i, e)} placeholder="Any additional notes..." style={inpSt()} /></div>
                        {offerErrors[i] && <div style={{ fontSize: 11, color: C.error }}>{offerErrors[i]}</div>}
                        {offerSuccess[i] && (
                          <div style={{ fontSize: 11, color: C.success, display: "flex", alignItems: "center", gap: 6 }}>
                            <CheckCircle size={12} strokeWidth={1.5} /> Published successfully!
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
                  <button className="add-btn" onClick={addOffer} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px", borderRadius: 8, border: `0.5px dashed ${C.border}`, background: "transparent", color: C.muted, fontSize: 11, fontFamily: f.font, cursor: "pointer", transition: "all .15s" }}>
                    <Plus size={13} strokeWidth={1.5} /> Add Another Offer
                  </button>
                </div>
              </div>

            </div>
          </div>

          <style>{`
            @keyframes progressPulse {
              0%   { transform: translateX(-100%); }
              100% { transform: translateX(200%); }
            }
          `}</style>
        </main>
      </div>
    </>
  );
}