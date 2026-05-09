import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function CreateRequest() {
  const navigate = useNavigate();
  const location = useLocation();
  const editMode = location.state?.mode === "edit";
  const existingRequest = location.state?.request;
 const [form, setForm] = useState({
  service_type: editMode ? existingRequest?.service_type || "" : "",
  space_type: editMode ? existingRequest?.space_type || "" : "",
  space_details: editMode ? existingRequest?.space_details || "" : "",
  preferred_style: editMode ? existingRequest?.preferred_style || "" : "",
  preferred_colors: editMode ? existingRequest?.preferred_colors || "" : "",
  budget: editMode ? existingRequest?.budget || "" : "",
});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [step, setStep] = useState(0);

  const serviceTypes = [
    {
      value: "Full Interior Design",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
    },
    {
      value: "Furniture Selection",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"/><path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0z"/>
        </svg>
      ),
    },
    {
      value: "Space Planning",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>
        </svg>
      ),
    },
    {
      value: "Color Consultation",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20c-5.523 0-8-2.5-8-5 0-1.5 1-3 3-3h10c2 0 3-1.5 3-3a10 10 0 0 1-8-9z"/>
        </svg>
      ),
    },
    {
      value: "Execution Supervision",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      ),
    },
  ];

  const spaceTypes = ["Living Room", "Bedroom", "Kitchen", "Office", "Majlis"];
  const styles = ["Modern", "Minimal", "Classic", "Luxury", "Boho"];

  const nextSteps = [
    { num: "01", title: "Designer reviews your request", desc: "Your request is sent to qualified designers in your area." },
    { num: "02", title: "Execution plan is prepared", desc: "The designer prepares a tailored plan for your space." },
    { num: "03", title: "Providers submit offers", desc: "You receive competitive offers from vetted professionals." },
    { num: "04", title: "You review and select the best option", desc: "Compare offers and choose the best option for your needs." },
  ];

  const stepSubtitles = [
    "Tell us about your space — we'll match you with the right designer.",
    "Where is your space, and what should we know about it?",
    "What's your design taste and color vision?",
    "Set your budget and review your request.",
  ];

  const c = {
    dark: "#2C221A",
    mid: "#3D3128",
    sand: "#D4C4B0",
    sandLight: "rgba(212,196,176,0.45)",
    stone: "#8C7B6B",
    muted: "#B0A090",
    border: "#E2D8CE",
    bg: "#F5F0EA",
    inputBg: "#FAF7F4",
    sectionBg: "#F7F3EF",
    error: "#B05030",
    success: "#4A6645",
  };

  const setField = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  };

  const validateStep = () => {
    const e = {};
    if (step === 0 && !form.service_type) e.service_type = "Please select a service to continue";
    if (step === 1) {
      if (!form.space_type) e.space_type = "Required";
      if (!form.space_details) e.space_details = "Required";
    }
    if (step === 2) {
      if (!form.preferred_style) e.preferred_style = "Required";
      if (!form.preferred_colors) e.preferred_colors = "Required";
    }
    if (step === 3 && !form.budget) e.budget = "Required";
    return e;
  };

  const goNext = () => {
    const e = validateStep();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setStep((s) => s + 1);
  };

  const goBack = () => setStep((s) => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validateStep();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }
    setLoading(true);
    setMessage("");
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const payload = {
        homeowner_id: user?.id,
        service_type: form.service_type,
        space_type: form.space_type,
        space_details: form.space_details,
        preferred_style: form.preferred_style,
        preferred_colors: form.preferred_colors,
        budget: Number(form.budget),
      };
      const token = localStorage.getItem("token");
      const url = editMode
     ? `http://127.0.0.1:5000/design-requests/${existingRequest.id}`
    : "http://127.0.0.1:5000/design-requests";

      const method = editMode ? "PUT" : "POST";

      const res = await fetch(url, {
      method,
      headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
     },
     body: JSON.stringify(payload),
     });
      const data = await res.json();
      if (!res.ok) {
        setMessage(
        editMode
       ? "Request updated successfully!"
       : "Request submitted successfully!"
     );
        setIsError(true);
      } else {
        setMessage("Request submitted successfully!");
        setIsError(false);
        setTimeout(() => { navigate("/dashboard"); }, 1500);
      }
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const SectionDivider = ({ label, optional }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: c.muted, whiteSpace: "nowrap" }}>
        {label}
        {optional && (
          <span style={{ fontSize: 9, color: "#C8BEB4", fontWeight: 300, letterSpacing: 0, textTransform: "none", marginLeft: 6 }}>— optional</span>
        )}
      </span>
      <div style={{ flex: 1, height: "0.5px", background: c.border }} />
    </div>
  );

  const ChipGroup = ({ field, options }) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => setField(field, opt)}
          style={{
            padding: "8px 16px", borderRadius: 100, fontSize: 11.5,
            fontFamily: "'Jost', sans-serif", fontWeight: 400, cursor: "pointer",
            border: `1px solid ${form[field] === opt ? c.dark : c.border}`,
            background: form[field] === opt ? c.dark : c.inputBg,
            color: form[field] === opt ? c.sand : "#9A8878",
            letterSpacing: "0.02em", transition: "all 0.15s",
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );

  const stepLabels = ["SERVICE", "SPACE", "STYLE", "BUDGET"];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::placeholder { color: #C8BEB4; font-size: 12px; font-weight: 300; }
        .sw-inp:focus, .sw-textarea:focus {
          border-color: #8C7B6B !important;
          background: #fff !important;
          outline: none;
          box-shadow: 0 0 0 3px rgba(140,123,107,0.08);
        }
        .sw-chip:hover { border-color: #B0A090 !important; color: #5C4A3C !important; }
        .sw-svc:hover { border-color: #B0A090 !important; }
        .sw-submit:not(:disabled):hover { background: #3D3128 !important; }
        .sw-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .sw-back:hover { border-color: #B0A090 !important; color: #5C4A3C !important; }
        .sw-step-enter { animation: stepIn 0.25s ease; }
        @keyframes stepIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ minHeight: "100vh", background: c.bg, padding: "32px 20px", fontFamily: "'Jost', sans-serif" }}>
        <div style={{ maxWidth: 580, margin: "0 auto" }}>

          {/* Main card */}
          <div style={{ background: "#fff", border: `0.5px solid ${c.border}`, borderRadius: 18, overflow: "hidden", marginBottom: 16 }}>

            {/* Dark header */}
            <div style={{ background: c.dark, padding: "28px 32px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                <div style={{ width: 26, height: 26, border: `1.5px solid ${c.sandLight}`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <rect x="2" y="2" width="5" height="5" stroke="#D4C4B0" strokeWidth="1.2" rx="1" />
                    <rect x="9" y="2" width="5" height="5" fill="rgba(212,196,176,0.4)" rx="1" />
                    <rect x="2" y="9" width="5" height="5" fill="rgba(212,196,176,0.4)" rx="1" />
                    <rect x="9" y="9" width="5" height="5" stroke="#D4C4B0" strokeWidth="1.2" rx="1" />
                  </svg>
                </div>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, fontWeight: 600, letterSpacing: "0.2em", color: c.sand, textTransform: "uppercase" }}>Swagne</span>
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: "#fff", marginBottom: 5 }}>Design Request</div>
              <div style={{ fontSize: 12, color: "rgba(212,196,176,0.65)", fontWeight: 300, lineHeight: 1.6 }}>{stepSubtitles[step]}</div>

              {/* Progress */}
              <div style={{ marginTop: 22 }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {stepLabels.map((label, i) => (
                    <React.Fragment key={label}>
                      <div style={{
                        width: 28, height: 28, borderRadius: "50%", flexShrink: 0, transition: "all 0.35s",
                        border: `1.5px solid ${i <= step ? c.sand : "rgba(212,196,176,0.22)"}`,
                        background: i < step ? c.sand : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {i < step
                          ? <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#2C221A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          : <span style={{ fontSize: 10, fontWeight: 500, color: i === step ? c.sand : "rgba(212,196,176,0.28)" }}>{i + 1}</span>
                        }
                      </div>
                      {i < 3 && (
                        <div style={{
                          flex: 1, height: 1, margin: "0 4px", transition: "background 0.4s",
                          background: i < step ? "rgba(212,196,176,0.45)" : "rgba(212,196,176,0.15)",
                        }} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  {stepLabels.map((label, i) => (
                    <span key={label} style={{ fontSize: 9.5, letterSpacing: "0.1em", color: i <= step ? c.sand : "rgba(212,196,176,0.3)" }}>
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Form body */}
            <div key={step} className="sw-step-enter" style={{ padding: "28px 32px 32px" }}>

              {/* Step 0: Service */}
              {step === 0 && (
                <div>
                  <SectionDivider label="What do you need help with?" />
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {serviceTypes.map(({ value, icon }) => {
                      const sel = form.service_type === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          className="sw-svc"
                          onClick={() => setField("service_type", value)}
                          style={{
                            display: "flex", alignItems: "center", gap: 12,
                            padding: "12px 16px", borderRadius: 10, cursor: "pointer",
                            border: `1px solid ${sel ? c.dark : c.border}`,
                            background: sel ? c.dark : c.inputBg,
                            color: sel ? c.sand : "#9A8878",
                            fontFamily: "'Jost', sans-serif", fontSize: 13, fontWeight: 400,
                            textAlign: "left", transition: "all 0.15s",
                          }}
                        >
                          <span style={{
                            width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                            background: sel ? "rgba(212,196,176,0.14)" : "#EDE5DC",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: sel ? c.sand : c.stone,
                          }}>{icon}</span>
                          <span style={{ flex: 1 }}>{value}</span>
                          {sel && (
                            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                              <circle cx="8" cy="8" r="7" stroke="#D4C4B0" strokeWidth="1.2" />
                              <path d="M5 8l2 2 4-4" stroke="#D4C4B0" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {errors.service_type && <div style={{ fontSize: 10.5, color: c.error, marginTop: 6 }}>{errors.service_type}</div>}
                </div>
              )}

              {/* Step 1: Space */}
              {step === 1 && (
                <div>
                  <div style={{ marginBottom: 20 }}>
                    <SectionDivider label="Space type" />
                    <ChipGroup field="space_type" options={spaceTypes} />
                    {errors.space_type && <div style={{ fontSize: 10.5, color: c.error, marginTop: 4 }}>{errors.space_type}</div>}
                  </div>
                  <div>
                    <SectionDivider label="Describe your space" />
                    <textarea
                      className="sw-textarea"
                      placeholder="e.g. Medium-sized living room, needs full redesign with seating area and TV wall."
                      value={form.space_details}
                      onChange={(e) => setField("space_details", e.target.value)}
                      rows={4}
                      style={{
                        width: "100%", background: c.inputBg, resize: "vertical",
                        border: `1px solid ${errors.space_details ? c.error : c.border}`,
                        borderRadius: 10, padding: "10px 14px", fontSize: 12.5,
                        fontFamily: "'Jost', sans-serif", fontWeight: 300, color: c.mid, lineHeight: 1.7,
                      }}
                    />
                    {errors.space_details && <div style={{ fontSize: 10.5, color: c.error, marginTop: 4 }}>{errors.space_details}</div>}
                  </div>
                </div>
              )}

              {/* Step 2: Style */}
              {step === 2 && (
                <div>
                  <div style={{ marginBottom: 20 }}>
                    <SectionDivider label="Preferred style" />
                    <ChipGroup field="preferred_style" options={styles} />
                    {errors.preferred_style && <div style={{ fontSize: 10.5, color: c.error, marginTop: 4 }}>{errors.preferred_style}</div>}
                  </div>
                  <div>
                    <SectionDivider label="Color palette" />
                    <input
                      className="sw-inp"
                      type="text"
                      placeholder="e.g. Beige, off-white, warm wood tones"
                      value={form.preferred_colors}
                      onChange={(e) => setField("preferred_colors", e.target.value)}
                      style={{
                        width: "100%", background: c.inputBg, fontSize: 13,
                        border: `1px solid ${errors.preferred_colors ? c.error : c.border}`,
                        borderRadius: 10, padding: "10px 14px",
                        fontFamily: "'Jost', sans-serif", fontWeight: 300, color: c.mid,
                      }}
                    />
                    {errors.preferred_colors && <div style={{ fontSize: 10.5, color: c.error, marginTop: 4 }}>{errors.preferred_colors}</div>}
                  </div>
                </div>
              )}

              {/* Step 3: Budget + Summary + Attachments */}
              {step === 3 && (
                <div>
                  <div style={{ marginBottom: 22 }}>
                    <SectionDivider label="Budget" />
                    <div style={{ position: "relative" }}>
                      <span style={{
                        position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                        fontSize: 12, color: "#9A8878", fontWeight: 400, pointerEvents: "none",
                      }}>SAR</span>
                      <input
                        className="sw-inp"
                        type="number"
                        placeholder="e.g. 15000"
                        value={form.budget}
                        onChange={(e) => setField("budget", e.target.value)}
                        style={{
                          width: "100%", background: c.inputBg, fontSize: 13,
                          border: `1px solid ${errors.budget ? c.error : c.border}`,
                          borderRadius: 10, padding: "10px 14px 10px 46px",
                          fontFamily: "'Jost', sans-serif", fontWeight: 300, color: c.mid,
                        }}
                      />
                    </div>
                    {errors.budget && <div style={{ fontSize: 10.5, color: c.error, marginTop: 4 }}>{errors.budget}</div>}
                  </div>

                  {/* Summary */}
                  <div style={{ background: c.sectionBg, border: `0.5px solid ${c.border}`, borderRadius: 12, padding: "16px 18px", marginBottom: 22 }}>
                    <SectionDivider label="Summary" />
                    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                      {[
                        { label: "Service", val: form.service_type || "—" },
                        { label: "Space", val: form.space_type || "—" },
                        { label: "Style", val: form.preferred_style || "—" },
                        { label: "Colors", val: form.preferred_colors || "—" },
                        { label: "Budget", val: form.budget ? `${Number(form.budget).toLocaleString()} SAR` : "—" },
                      ].map(({ label, val }) => (
                        <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
                          <span style={{ color: c.muted }}>{label}</span>
                          <span style={{ color: c.dark, fontWeight: 400 }}>{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Attachments */}
                  <div style={{ marginBottom: 22 }}>
                    <SectionDivider label="Attachments" optional />
                    {[
                      { title: "Inspiration images", hint: "JPG, PNG · up to 10 files", accept: "image/*", multiple: true, isImg: true },
                      { title: "Floor plan", hint: "PDF, DWG, PNG, JPG", accept: ".pdf,.dwg,.png,.jpg", isImg: false },
                    ].map(({ title, hint, accept, multiple, isImg }) => (
                      <label
                        key={title}
                        style={{
                          display: "flex", alignItems: "center", gap: 12, marginBottom: 8,
                          border: `1px dashed ${c.sand}`, borderRadius: 10, padding: "13px 15px",
                          background: c.inputBg, cursor: "pointer",
                        }}
                      >
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: "#EDE5DC", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {isImg ? (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8C7B6B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                            </svg>
                          ) : (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8C7B6B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                            </svg>
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, color: c.stone, fontWeight: 400 }}>{title}</div>
                          <div style={{ fontSize: 10.5, color: c.muted, marginTop: 2 }}>{hint}</div>
                        </div>
                        <span style={{ fontSize: 11, color: c.muted }}>Browse</span>
                        <input type="file" accept={accept} multiple={multiple} style={{ display: "none" }} />
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                {step > 0 && (
                  <button
                    type="button"
                    className="sw-back"
                    onClick={goBack}
                    style={{
                      background: "transparent", border: `1px solid ${c.border}`, color: c.stone,
                      borderRadius: 12, padding: "13px 20px", fontSize: 11.5,
                      fontFamily: "'Jost', sans-serif", letterSpacing: "0.1em",
                      textTransform: "uppercase", cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
                    }}
                  >← Back</button>
                )}
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    style={{
                      flex: 1, padding: "13px", border: "none", borderRadius: 12,
                      background: c.dark, color: c.sand, fontSize: 11.5, fontWeight: 500,
                      fontFamily: "'Jost', sans-serif", letterSpacing: "0.15em",
                      textTransform: "uppercase", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    }}
                  >
                    Continue
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="3" y1="8" x2="13" y2="8"/><polyline points="9 4 13 8 9 12"/>
                    </svg>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="sw-submit"
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{
                      flex: 1, padding: "13px", border: "none", borderRadius: 12,
                      background: c.dark, color: c.sand, fontSize: 11.5, fontWeight: 500,
                      fontFamily: "'Jost', sans-serif", letterSpacing: "0.15em",
                      textTransform: "uppercase", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      transition: "background 0.15s",
                    }}
                  >
                    {loading ? "Submitting…" : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                        </svg>
                        Submit request
                      </>
                    )}
                  </button>
                )}
              </div>

              {message && (
                <div style={{
                  marginTop: 12, padding: "10px 14px", borderRadius: 8,
                  fontSize: 12, textAlign: "center", fontWeight: 400,
                  background: isError ? "rgba(176,80,48,0.07)" : "rgba(74,102,69,0.08)",
                  color: isError ? c.error : c.success,
                  border: `0.5px solid ${isError ? "rgba(176,80,48,0.2)" : "rgba(74,102,69,0.22)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}>
                  {isError ? "✕" : "✓"} {message}
                </div>
              )}
            </div>
          </div>

          {/* What happens next */}
          <div style={{ background: "#fff", border: `0.5px solid ${c.border}`, borderRadius: 18, padding: "24px 32px 28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
              <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: c.muted, whiteSpace: "nowrap" }}>
                What happens next?
              </span>
              <div style={{ flex: 1, height: "0.5px", background: c.border }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {nextSteps.map(({ num, title, desc }, i) => (
                <div key={num} style={{ display: "flex", gap: 16, paddingBottom: i < nextSteps.length - 1 ? 22 : 0, position: "relative" }}>
                  {i < nextSteps.length - 1 && (
                    <div style={{ position: "absolute", left: 19, top: 38, bottom: 0, width: 1, background: c.border }} />
                  )}
                  <div style={{
                    width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                    background: c.sectionBg, border: `0.5px solid ${c.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Cormorant Garamond', serif", fontSize: 14,
                    fontWeight: 600, color: c.stone, letterSpacing: "0.04em", zIndex: 1,
                  }}>
                    {num}
                  </div>
                  <div style={{ paddingTop: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: c.dark, marginBottom: 3 }}>{title}</div>
                    <div style={{ fontSize: 12, color: c.muted, fontWeight: 300, lineHeight: 1.6 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
    );
}
