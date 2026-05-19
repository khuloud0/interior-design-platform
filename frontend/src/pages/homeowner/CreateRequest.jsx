import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ClientSidebar from "../../components/ClientSidebar";

const C = {
  dark: "#2C221A", mid: "#3D3128", sand: "#D4C4B0",
  stone: "#8C7B6B", muted: "#B0A090", border: "#E2D8CE",
  bg: "#F5F0EA", sec: "#F9F6F2", sectionBg: "#F7F3EF",
  error: "#B05030", success: "#4A6645",
};
const f = { font: "'Jost', sans-serif", serif: "'Cormorant Garamond', serif" };

const Label = ({ children }) => (
  <label style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: C.muted, fontFamily: f.font, marginBottom: 7, display: "block" }}>
    {children}
  </label>
);

const Field = ({ label, children }) => (
  <div style={{ display: "flex", flexDirection: "column" }}>
    <Label>{label}</Label>
    {children}
  </div>
);

const Row = ({ children }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>{children}</div>
);

const SectionDivider = ({ label, optional }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
    <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: C.muted, whiteSpace: "nowrap" }}>
      {label}
      {optional && <span style={{ fontSize: 9, color: "#C8BEB4", fontWeight: 300, letterSpacing: 0, textTransform: "none", marginLeft: 6 }}>— optional</span>}
    </span>
    <div style={{ flex: 1, height: "0.5px", background: C.border }} />
  </div>
);

const serviceTypes = [
  { value: "Full Interior Design", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { value: "Furniture Selection", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"/><path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0z"/></svg> },
  { value: "Space Planning", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg> },
  { value: "Color Consultation", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20c-5.523 0-8-2.5-8-5 0-1.5 1-3 3-3h10c2 0 3-1.5 3-3a10 10 0 0 1-8-9z"/></svg> },
  { value: "Execution Supervision", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
];

const spaceTypes  = ["Living Room", "Bedroom", "Kitchen", "Office", "Majlis"];
const styles      = ["Modern", "Minimal", "Classic", "Luxury", "Boho"];
const stepLabels  = ["SERVICE", "SPACE", "STYLE", "BUDGET"];
const stepSubtitles = [
  "Tell us about your space — we'll match you with the right designer.",
  "Where is your space, and what should we know about it?",
  "What's your design taste and color vision?",
  "Set your budget and review your request.",
];
const nextSteps = [
  { num: "01", title: "Designer reviews your request", desc: "Your request is sent to qualified designers in your area." },
  { num: "02", title: "Execution plan is prepared",    desc: "The designer prepares a tailored plan for your space." },
  { num: "03", title: "Providers submit offers",       desc: "You receive competitive offers from vetted professionals." },
  { num: "04", title: "You review and select",         desc: "Compare offers and choose the best option for your needs." },
];

const DEFAULT = { service_type: "", space_type: "", space_details: "", preferred_style: "", preferred_colors: "", budget: "" };

export default function CreateRequest() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const editMode  = location.state?.mode === "edit";
  const existing  = location.state?.request;

  const [form, setForm]       = useState(editMode && existing ? {
    service_type:     existing.service_type     || "",
    space_type:       existing.space_type       || "",
    space_details:    existing.space_details    || "",
    preferred_style:  existing.preferred_style  || "",
    preferred_colors: existing.preferred_colors || "",
    budget:           existing.budget           || "",
  } : DEFAULT);
  const [step, setStep]       = useState(0);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [files, setFiles]     = useState([]);
  const inputRef              = useRef();

  const setField = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: "" }));
  };

  const ChipGroup = ({ field, options }) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {options.map(opt => (
        <button key={opt} type="button" onClick={() => setField(field, opt)} style={{
          padding: "8px 16px", borderRadius: 100, fontSize: 11.5,
          fontFamily: f.font, fontWeight: 400, cursor: "pointer",
          border: `1px solid ${form[field] === opt ? C.dark : C.border}`,
          background: form[field] === opt ? C.dark : C.sec,
          color: form[field] === opt ? C.sand : "#9A8878",
          letterSpacing: "0.02em", transition: "all 0.15s",
        }}>{opt}</button>
      ))}
    </div>
  );

  const validateStep = () => {
    const e = {};
    if (step === 0 && !form.service_type)    e.service_type    = "Please select a service";
    if (step === 1 && !form.space_type)      e.space_type      = "Required";
    if (step === 1 && !form.space_details)   e.space_details   = "Required";
    if (step === 2 && !form.preferred_style) e.preferred_style = "Required";
    if (step === 2 && !form.preferred_colors)e.preferred_colors= "Required";
    if (step === 3 && !form.budget)          e.budget          = "Required";
    return e;
  };

  const goNext = () => {
    const e = validateStep();
    if (Object.keys(e).length) { setErrors(e); return; }
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    const e = validateStep();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true); setMessage("");
    try {
      const user  = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");
      const url   = editMode ? `http://127.0.0.1:5000/design-requests/${existing.id}` : "http://127.0.0.1:5000/design-requests";
      const res   = await fetch(url, {
        method: editMode ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, budget: Number(form.budget), homeowner_id: user?.id, designer_id: location.state?.designer_id || null }),
      });
      const data = await res.json();
      if (!res.ok) { setMessage(data.error || "Failed."); setIsError(true); }
      else { setMessage(editMode ? "Request updated!" : "Request submitted!"); setIsError(false); setTimeout(() => navigate("/dashboard"), 1500); }
    } catch { setMessage("Something went wrong."); setIsError(true); }
    finally { setLoading(false); }
  };

  const user     = JSON.parse(localStorage.getItem("user") || "{}");
  const initials = user?.name?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?";

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; }
        ::placeholder { color: #C8BEB4; font-size: 12px; font-weight: 300; }
        .sw-inp:focus, .sw-ta:focus { border-color: #8C7B6B !important; background: #fff !important; outline: none; box-shadow: 0 0 0 3px rgba(140,123,107,0.08); }
        .sw-svc:hover { border-color: #B0A090 !important; }
        .sw-submit:not(:disabled):hover { background: #3D3128 !important; }
        .sw-back:hover { border-color: #B0A090 !important; color: #5C4A3C !important; }
        .sw-step-enter { animation: stepIn 0.25s ease; }
        @keyframes stepIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      <div style={{ display: "flex", height: "100vh", fontFamily: f.font, background: C.bg }}>

        {/* Sidebar */}
        <ClientSidebar variant="light" />

        {/* Main */}
        <main style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }}>

          {/* Top bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
            <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.16em", color: C.muted, textTransform: "uppercase" }}>
              DESIGNER MARKETPLACE
            </div>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: f.serif, fontSize: 14, fontWeight: 600, color: C.sand }}>
              {initials}
            </div>
          </div>

          <div style={{ maxWidth: 580, margin: "0 auto" }}>

            {/* Main card */}
            <div style={{ background: "#fff", border: `0.5px solid ${C.border}`, borderRadius: 18, overflow: "hidden", marginBottom: 16 }}>

              {/* Dark header */}
              <div style={{ background: C.dark, padding: "28px 32px 22px" }}>
                <div style={{ fontFamily: f.serif, fontSize: 28, fontWeight: 300, color: "#fff", marginBottom: 5 }}>
                  {editMode ? "Edit Design Request" : "New Design Request"}
                </div>
                <div style={{ fontSize: 12, color: "rgba(212,196,176,0.65)", fontWeight: 300, lineHeight: 1.6 }}>
                  {stepSubtitles[step]}
                </div>

                {/* Progress */}
                <div style={{ marginTop: 22 }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {stepLabels.map((label, i) => (
                      <React.Fragment key={label}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, transition: "all 0.35s", border: `1.5px solid ${i <= step ? C.sand : "rgba(212,196,176,0.22)"}`, background: i < step ? C.sand : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {i < step
                            ? <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#2C221A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            : <span style={{ fontSize: 10, fontWeight: 500, color: i === step ? C.sand : "rgba(212,196,176,0.28)" }}>{i + 1}</span>}
                        </div>
                        {i < 3 && <div style={{ flex: 1, height: 1, margin: "0 4px", transition: "background 0.4s", background: i < step ? "rgba(212,196,176,0.45)" : "rgba(212,196,176,0.15)" }} />}
                      </React.Fragment>
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                    {stepLabels.map((label, i) => (
                      <span key={label} style={{ fontSize: 9.5, letterSpacing: "0.1em", color: i <= step ? C.sand : "rgba(212,196,176,0.3)" }}>{label}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form body */}
              <div key={step} className="sw-step-enter" style={{ padding: "28px 32px 32px" }}>

                {/* Step 0 */}
                {step === 0 && (
                  <div>
                    <SectionDivider label="What do you need help with?" />
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {serviceTypes.map(({ value, icon }) => {
                        const sel = form.service_type === value;
                        return (
                          <button key={value} type="button" className="sw-svc" onClick={() => setField("service_type", value)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10, cursor: "pointer", border: `1px solid ${sel ? C.dark : C.border}`, background: sel ? C.dark : C.sec, color: sel ? C.sand : "#9A8878", fontFamily: f.font, fontSize: 13, textAlign: "left", transition: "all 0.15s" }}>
                            <span style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, background: sel ? "rgba(212,196,176,0.14)" : "#EDE5DC", display: "flex", alignItems: "center", justifyContent: "center", color: sel ? C.sand : C.stone }}>{icon}</span>
                            <span style={{ flex: 1 }}>{value}</span>
                            {sel && <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#D4C4B0" strokeWidth="1.2"/><path d="M5 8l2 2 4-4" stroke="#D4C4B0" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          </button>
                        );
                      })}
                    </div>
                    {errors.service_type && <div style={{ fontSize: 10.5, color: C.error, marginTop: 6 }}>{errors.service_type}</div>}
                  </div>
                )}

                {/* Step 1 */}
                {step === 1 && (
                  <div>
                    <div style={{ marginBottom: 20 }}>
                      <SectionDivider label="Space type" />
                      <ChipGroup field="space_type" options={spaceTypes} />
                      {errors.space_type && <div style={{ fontSize: 10.5, color: C.error, marginTop: 4 }}>{errors.space_type}</div>}
                    </div>
                    <div>
                      <SectionDivider label="Describe your space" />
                      <textarea className="sw-ta" placeholder="e.g. Medium-sized living room, needs full redesign..." value={form.space_details} onChange={e => setField("space_details", e.target.value)} rows={4} style={{ width: "100%", background: C.sec, resize: "vertical", border: `1px solid ${errors.space_details ? C.error : C.border}`, borderRadius: 10, padding: "10px 14px", fontSize: 12.5, fontFamily: f.font, fontWeight: 300, color: C.mid, lineHeight: 1.7 }} />
                      {errors.space_details && <div style={{ fontSize: 10.5, color: C.error, marginTop: 4 }}>{errors.space_details}</div>}
                    </div>
                  </div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <div>
                    <div style={{ marginBottom: 20 }}>
                      <SectionDivider label="Preferred style" />
                      <ChipGroup field="preferred_style" options={styles} />
                      {errors.preferred_style && <div style={{ fontSize: 10.5, color: C.error, marginTop: 4 }}>{errors.preferred_style}</div>}
                    </div>
                    <div>
                      <SectionDivider label="Color palette" />
                      <input className="sw-inp" type="text" placeholder="e.g. Beige, off-white, warm wood tones" value={form.preferred_colors} onChange={e => setField("preferred_colors", e.target.value)} style={{ width: "100%", background: C.sec, fontSize: 13, border: `1px solid ${errors.preferred_colors ? C.error : C.border}`, borderRadius: 10, padding: "10px 14px", fontFamily: f.font, fontWeight: 300, color: C.mid }} />
                      {errors.preferred_colors && <div style={{ fontSize: 10.5, color: C.error, marginTop: 4 }}>{errors.preferred_colors}</div>}
                    </div>
                  </div>
                )}

                {/* Step 3 */}
                {step === 3 && (
                  <div>
                    <div style={{ marginBottom: 22 }}>
                      <SectionDivider label="Budget" />
                      <div style={{ position: "relative" }}>
                        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "#9A8878", pointerEvents: "none" }}>SAR</span>
                        <input className="sw-inp" type="number" placeholder="e.g. 15000" value={form.budget} onChange={e => setField("budget", e.target.value)} style={{ width: "100%", background: C.sec, fontSize: 13, border: `1px solid ${errors.budget ? C.error : C.border}`, borderRadius: 10, padding: "10px 14px 10px 46px", fontFamily: f.font, fontWeight: 300, color: C.mid }} />
                      </div>
                      {errors.budget && <div style={{ fontSize: 10.5, color: C.error, marginTop: 4 }}>{errors.budget}</div>}
                    </div>

                    {/* Summary */}
                    <div style={{ background: C.sectionBg, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: "16px 18px", marginBottom: 22 }}>
                      <SectionDivider label="Summary" />
                      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                        {[
                          { label: "Service", val: form.service_type || "—" },
                          { label: "Space",   val: form.space_type   || "—" },
                          { label: "Style",   val: form.preferred_style || "—" },
                          { label: "Colors",  val: form.preferred_colors || "—" },
                          { label: "Budget",  val: form.budget ? `${Number(form.budget).toLocaleString()} SAR` : "—" },
                        ].map(({ label, val }) => (
                          <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                            <span style={{ color: C.muted }}>{label}</span>
                            <span style={{ color: C.dark, fontWeight: 400 }}>{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Upload */}
                    <SectionDivider label="Attachments" optional />
                    <div onClick={() => inputRef.current?.click()} style={{ border: `0.5px dashed ${C.border}`, borderRadius: 10, padding: "18px 20px", textAlign: "center", background: C.sec, cursor: "pointer" }}>
                      <input ref={inputRef} type="file" multiple accept="image/*,.pdf" style={{ display: "none" }} onChange={e => setFiles(Array.from(e.target.files))} />
                      <div style={{ fontSize: 12, color: C.muted }}>{files.length === 0 ? <>Drop files or <span style={{ color: C.stone, textDecoration: "underline" }}>browse</span></> : `${files.length} file${files.length > 1 ? "s" : ""} selected`}</div>
                    </div>
                  </div>
                )}

                {/* Nav buttons */}
                <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                  {step > 0 && (
                    <button type="button" className="sw-back" onClick={() => setStep(s => s - 1)} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.stone, borderRadius: 12, padding: "13px 20px", fontSize: 11.5, fontFamily: f.font, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.15s" }}>← Back</button>
                  )}
                  {step < 3 ? (
                    <button type="button" onClick={goNext} style={{ flex: 1, padding: "13px", border: "none", borderRadius: 12, background: C.dark, color: C.sand, fontSize: 11.5, fontWeight: 500, fontFamily: f.font, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      Continue
                      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="8" x2="13" y2="8"/><polyline points="9 4 13 8 9 12"/></svg>
                    </button>
                  ) : (
                    <button type="button" className="sw-submit" onClick={handleSubmit} disabled={loading} style={{ flex: 1, padding: "13px", border: "none", borderRadius: 12, background: C.dark, color: C.sand, fontSize: 11.5, fontWeight: 500, fontFamily: f.font, letterSpacing: "0.15em", textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.15s" }}>
                      {loading ? "Submitting…" : <>{editMode ? "Save Changes" : "Submit Request"} →</>}
                    </button>
                  )}
                </div>

                {message && (
                  <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, fontSize: 12, textAlign: "center", background: isError ? "rgba(176,80,48,0.07)" : "rgba(74,102,69,0.08)", color: isError ? C.error : C.success, border: `0.5px solid ${isError ? "rgba(176,80,48,0.2)" : "rgba(74,102,69,0.22)"}` }}>
                    {isError ? "✕" : "✓"} {message}
                  </div>
                )}
              </div>
            </div>

            {/* What happens next */}
            <div style={{ background: "#fff", border: `0.5px solid ${C.border}`, borderRadius: 18, padding: "24px 32px 28px" }}>
              <SectionDivider label="What happens next?" />
              <div style={{ display: "flex", flexDirection: "column" }}>
                {nextSteps.map(({ num, title, desc }, i) => (
                  <div key={num} style={{ display: "flex", gap: 16, paddingBottom: i < nextSteps.length - 1 ? 22 : 0, position: "relative" }}>
                    {i < nextSteps.length - 1 && <div style={{ position: "absolute", left: 19, top: 38, bottom: 0, width: 1, background: C.border }} />}
                    <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: C.sectionBg, border: `0.5px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: f.serif, fontSize: 14, fontWeight: 600, color: C.stone, zIndex: 1 }}>{num}</div>
                    <div style={{ paddingTop: 8 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: C.dark, marginBottom: 3 }}>{title}</div>
                      <div style={{ fontSize: 12, color: C.muted, fontWeight: 300, lineHeight: 1.6 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
}
