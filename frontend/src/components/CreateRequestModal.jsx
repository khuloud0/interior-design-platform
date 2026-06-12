import React, { useState, useEffect, useRef } from "react";
const C = {
  dark: "#2C221A", sand: "#D4C4B0", stone: "#8C7B6B",
  muted: "#B0A090", border: "#E2D8CE", bg: "#F5F0EA",
  sec: "#F9F6F2", error: "#B05030", success: "#4A6645",
};
const f = { font: "'Jost', sans-serif", serif: "'Cormorant Garamond', serif" };
const Label = ({ children, required }) => (
  <label style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: C.muted, fontFamily: f.font, marginBottom: 6, display: "flex", alignItems: "center", gap: 3 }}>
    {children}
    {required && <span style={{ color: C.error, fontSize: 10, lineHeight: 1 }}>*</span>}
  </label>
);
const Field = ({ label, required, children, half }) => (
  <div style={{ display: "flex", flexDirection: "column", gridColumn: half ? "span 1" : "span 2" }}>
    <Label required={required}>{label}</Label>
    {children}
  </div>
);
const ErrMsg = ({ msg }) => msg
  ? <div style={{ fontSize: 10.5, color: C.error, marginTop: 4 }}>{msg}</div>
  : null;
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
const Sel = ({ name, value, onChange, options, err }) => (
  <div style={{ position: "relative" }}>
    <select name={name} value={value} onChange={onChange}
      style={{ ...selSt, border: `0.5px solid ${err ? C.error : C.border}` }}
      onFocus={e => e.target.style.borderColor = C.stone}
      onBlur={e => e.target.style.borderColor = err ? C.error : C.border}>
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
    <svg style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
      width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M2 3.5L5 6.5L8 3.5" stroke={C.muted} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);
const DEFAULT = {
  service_type: "Full Interior Design", space_type: "Living Room",
  preferred_style: "Modern Luxury", preferred_colors: "",
  space_size: "", budget: "", desired_start: "",
  duration: "1 — 2 Weeks", space_details: "",
  city: "", country: "Saudi Arabia",
};
// ✅ دالة الـ validation
function validate(form) {
  const e = {};
  const lettersOnly = /^[\u0600-\u06FFa-zA-Z\s]+$/;
  // Service Type & Space Type & Style — dropdowns دائماً فيها قيمة
  // Color Preference — مطلوب
  if (!form.preferred_colors.trim()) {
    e.preferred_colors = "Required";
  }
  // Space Size — رقم موجب، حد أدنى 10
  if (!form.space_size) {
    e.space_size = "Required";
  } else if (isNaN(Number(form.space_size)) || Number(form.space_size) <= 0) {
    e.space_size = "Must be a positive number";
  } else if (Number(form.space_size) < 10) {
    e.space_size = "Minimum space size is 10 m²";
  } else if (Number(form.space_size) < 10) {
    e.space_size = "Minimum space size is 10 m²";
  }
  // Budget — رقم موجب
  if (!form.budget) {
    e.budget = "Required";
  } else if (isNaN(Number(form.budget)) || Number(form.budget) <= 0) {
    e.budget = "Must be a positive number";
  }
  // City — مطلوب من القائمة
  if (!form.city) {
    e.city = "Please select a city";
  }
  // Desired Start Date — مطلوب + مو في الماضي
  if (!form.desired_start.trim()) {
    e.desired_start = "Required";
  } else {
    const entered = new Date(form.desired_start);
    const today   = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(entered.getTime())) {
      e.desired_start = "Invalid date";
    } else if (entered < today) {
      e.desired_start = "Date cannot be in the past";
    }
  }
  // Space Description — اختياري، لو كتب لازم حروف فقط + مسافة + بحد أقصى 300
  if (form.space_details.trim()) {
    if (!lettersOnly.test(form.space_details.trim())) {
      e.space_details = "Letters and spaces only (no numbers or symbols)";
    } else if (!form.space_details.trim().includes(" ")) {
      e.space_details = "Please write a proper description (at least two words)";
    } else if (form.space_details.trim().length > 300) {
      e.space_details = "Maximum 300 characters";
    }
  }
  return e;
}
export default function CreateRequestModal({
  open = false, onClose, onSuccess,
  initialData = null, mode = "create", requestId = null,
}) {
  const [form, setForm]       = useState(DEFAULT);
  const [files, setFiles]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});
  const [apiError, setApiError] = useState("");
  const overlayRef            = useRef();
  const fileRef               = useRef();
  useEffect(() => {
    if (initialData) {
      setForm({
        service_type:     initialData.service_type     ?? DEFAULT.service_type,
        space_type:       initialData.space_type       ?? DEFAULT.space_type,
        preferred_style:  initialData.preferred_style  ?? DEFAULT.preferred_style,
        preferred_colors: initialData.preferred_colors ?? "",
        space_size:       initialData.space_size       ?? "",
        budget:           initialData.budget           ?? "",
        desired_start:    initialData.desired_start    ?? "",
        duration:         initialData.duration         ?? DEFAULT.duration,
        space_details:    initialData.space_details    ?? "",
        city:             initialData.city             ?? "",
        country:          "Saudi Arabia",
      });
    } else { setForm(DEFAULT); }
    setFiles([]); setErrors({}); setApiError("");
  }, [initialData, open]);
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape" && open) onClose?.(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open, onClose]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  if (!open) return null;
  const set = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    // مسح الخطأ عند التعديل
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };
  const handleSubmit = async () => {
    setApiError("");
    const e = validate(form);
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const homeowner_id = user?.id;
      const url = mode === "edit"
        ? `https://interior-design-platform-production.up.railway.app/design-requests/${requestId}`
        : "https://interior-design-platform-production.up.railway.app/design-requests";
      const res = await fetch(url, {
        method: mode === "edit" ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, budget: Number(form.budget), homeowner_id }),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.message ?? d.error ?? "Something went wrong."); }
      onSuccess?.();
    } catch (err) { setApiError(err.message); }
    finally { setLoading(false); }
  };
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        .cr-inp:focus { border-color: #8C7B6B !important; background: #fff !important; outline: none; box-shadow: 0 0 0 3px rgba(140,123,107,0.08); }
        .cr-ta:focus  { border-color: #8C7B6B !important; background: #fff !important; outline: none; box-shadow: 0 0 0 3px rgba(140,123,107,0.08); }
        ::placeholder { color: #C8BEB4; font-size: 12px; font-weight: 300; }
        .cr-cancel:hover { border-color: #B0A090 !important; color: #5C4A3C !important; }
        .cr-submit:not(:disabled):hover { background: #3D3128 !important; }
      `}</style>
      <div ref={overlayRef} onClick={e => { if (e.target === overlayRef.current) onClose?.(); }}
        style={{ position: "fixed", inset: 0, background: "rgba(44,34,26,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24, backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)" }}>
        <div style={{ background: "#fff", borderRadius: 18, width: "100%", maxWidth: 560, maxHeight: "92vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(44,34,26,0.22)" }}>
          {/* Header */}
          <div style={{ background: C.dark, borderRadius: "18px 18px 0 0", padding: "22px 28px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
            <div>
              <div style={{ fontFamily: f.serif, fontSize: 24, fontWeight: 300, color: "#fff", marginBottom: 4 }}>
                {mode === "edit" ? "Edit Design Request" : "New Design Request"}
              </div>
              <div style={{ fontSize: 11, color: "rgba(212,196,176,0.5)", fontWeight: 300 }}>
                Tell us about your space and we'll match you with the right designer.
              </div>
            </div>
            <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: "50%", border: "0.5px solid rgba(212,196,176,0.25)", background: "transparent", color: "rgba(212,196,176,0.6)", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✕</button>
          </div>
          {/* Form */}
          <div style={{ padding: "24px 28px 28px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 14px" }}>
            <Field label="Service Type" required half>
              <Sel name="service_type" value={form.service_type} onChange={set}
                options={["Full Interior Design", "Space Planning", "Decoration Only", "Furniture Selection", "Execution Supervision"]} />
            </Field>
            <Field label="Space Type" required half>
              <Sel name="space_type" value={form.space_type} onChange={set}
                options={["Living Room", "Bedroom", "Kitchen", "Majlis", "Office", "Dining Room"]} />
            </Field>
            <Field label="Preferred Style" required half>
              <Sel name="preferred_style" value={form.preferred_style} onChange={set}
                options={["Modern Luxury", "Contemporary", "Classic", "Minimalist", "Arabic Heritage"]} />
            </Field>
            <Field label="Color Preference" required half>
              <input className="cr-inp" name="preferred_colors" value={form.preferred_colors}
                onChange={e => {
                  const { name, value } = e.target;
                  setForm(f => ({ ...f, [name]: value }));
                  const lettersOnly = /^[\u0600-\u06FFa-zA-Z\s]+$/;
                  if (!value.trim()) {
                    setErrors(prev => ({ ...prev, preferred_colors: "Required" }));
                  } else if (!lettersOnly.test(value.trim())) {
                    setErrors(prev => ({ ...prev, preferred_colors: "Letters only (Arabic or English)" }));
                  } else {
                    setErrors(prev => ({ ...prev, preferred_colors: "" }));
                  }
                }}
                placeholder="e.g. Neutral, Warm Tones" style={inpSt(!!errors.preferred_colors)}
                onFocus={e => e.target.style.borderColor = C.stone}
                onBlur={e => e.target.style.borderColor = errors.preferred_colors ? C.error : C.border} />
              <ErrMsg msg={errors.preferred_colors} />
            </Field>
            <Field label="Space Size (m²)" required half>
              <input className="cr-inp" name="space_size" type="number" min="10" value={form.space_size}
                onChange={e => {
                  set(e);
                  const val = Number(e.target.value);
                  if (!e.target.value) {
                    setErrors(prev => ({ ...prev, space_size: "Required" }));
                  } else if (val <= 0) {
                    setErrors(prev => ({ ...prev, space_size: "Must be a positive number" }));
                  } else if (val < 10) {
                    setErrors(prev => ({ ...prev, space_size: "Minimum space size is 10 m²" }));
                  } else {
                    setErrors(prev => ({ ...prev, space_size: "" }));
                  }
                }}
                placeholder="e.g. 40" style={inpSt(!!errors.space_size)}
                onFocus={e => e.target.style.borderColor = C.stone}
                onBlur={e => e.target.style.borderColor = errors.space_size ? C.error : C.border} />
              <ErrMsg msg={errors.space_size} />
            </Field>
            <Field label="Budget (SAR)" required half>
              <input className="cr-inp" name="budget" type="number" min="1" value={form.budget} onChange={set}
                placeholder="e.g. 15,000" style={inpSt(!!errors.budget)}
                onFocus={e => e.target.style.borderColor = C.stone}
                onBlur={e => e.target.style.borderColor = errors.budget ? C.error : C.border} />
              <ErrMsg msg={errors.budget} />
            </Field>
            <Field label="City" required half>
              <Sel name="city" value={form.city}
                err={!!errors.city}
                onChange={e => {
                  const { name, value } = e.target;
                  setForm(f => ({ ...f, [name]: value }));
                  if (!value) {
                    setErrors(prev => ({ ...prev, city: "Required" }));
                  } else {
                    setErrors(prev => ({ ...prev, city: "" }));
                  }
                }}
                options={[
                  "", "Riyadh", "Mecca", "Medina", "Tabuk",
                  "Abha", "Jeddah", "Hail", "Al Baha",
                  "Buraidah", "Jizan", "Dammam", "Najran",
                ]}
              />
              <ErrMsg msg={errors.city} />
            </Field>
            <Field label="Country" half>
              <div style={{ ...inpSt(), color: C.muted, display: "flex", alignItems: "center" }}>
                Saudi Arabia
              </div>
            </Field>
            <Field label="Desired Start Date" required half>
              <input className="cr-inp" name="desired_start" type="date" value={form.desired_start} onChange={set}
                min={new Date().toISOString().split("T")[0]}
                style={inpSt(!!errors.desired_start)}
                onFocus={e => e.target.style.borderColor = C.stone}
                onBlur={e => e.target.style.borderColor = errors.desired_start ? C.error : C.border} />
              <ErrMsg msg={errors.desired_start} />
            </Field>
            <Field label="Project Duration" required half>
              <Sel name="duration" value={form.duration} onChange={set}
                options={["1 — 2 Weeks", "2 — 4 Weeks", "4 — 6 Weeks", "6 — 12 Weeks", "3+ Months"]} />
            </Field>
            <Field label="Space Description">
              <textarea className="cr-ta" name="space_details" value={form.space_details}
                onChange={e => {
                  set(e);
                  const val = e.target.value.trim();
                  const lettersOnly = /^[\u0600-\u06FFa-zA-Z\s]+$/;
                  if (!val) {
                    setErrors(prev => ({ ...prev, space_details: "" }));
                  } else if (!lettersOnly.test(val)) {
                    setErrors(prev => ({ ...prev, space_details: "Letters and spaces only (no numbers or symbols)" }));
                  } else if (!val.includes(" ")) {
                    setErrors(prev => ({ ...prev, space_details: "Please write a proper description (at least two words)" }));
                  } else if (val.length > 300) {
                    setErrors(prev => ({ ...prev, space_details: "Maximum 300 characters" }));
                  } else {
                    setErrors(prev => ({ ...prev, space_details: "" }));
                  }
                }}
                rows={4} placeholder="Describe your space, goals, and any specific requirements..."
                maxLength={300}
                style={{ ...inpSt(!!errors.space_details), resize: "none", lineHeight: 1.65 }}
                onFocus={e => e.target.style.borderColor = C.stone}
                onBlur={e => e.target.style.borderColor = errors.space_details ? C.error : C.border} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                <ErrMsg msg={errors.space_details} />
                <span style={{ fontSize: 10, color: C.muted, marginLeft: "auto" }}>{form.space_details.length} / 300</span>
              </div>
            </Field>
            <Field label="Attachments">
              <div onClick={() => fileRef.current?.click()}
                style={{ border: `0.5px dashed ${C.border}`, borderRadius: 8, padding: "20px", textAlign: "center", background: C.sec, cursor: "pointer", transition: "border-color .15s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.stone}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                <input ref={fileRef} type="file" multiple accept="image/*,.pdf" style={{ display: "none" }} onChange={e => setFiles(Array.from(e.target.files))} />
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.border} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 6 }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <div style={{ fontSize: 12, color: C.muted }}>
                  {files.length === 0
                    ? <>Drop files here or <span style={{ color: C.stone, textDecoration: "underline" }}>browse</span></>
                    : `${files.length} file${files.length > 1 ? "s" : ""} selected`}
                </div>
                <div style={{ fontSize: 10, color: C.border, marginTop: 3 }}>PNG, JPG, PDF — up to 10 MB</div>
              </div>
            </Field>
            {apiError && (
              <div style={{ gridColumn: "span 2", padding: "10px 14px", borderRadius: 8, background: "rgba(176,80,48,0.07)", border: "0.5px solid rgba(176,80,48,0.2)", fontSize: 12, color: C.error }}>
                {apiError}
              </div>
            )}
            <div style={{ gridColumn: "span 2", display: "flex", gap: 10, paddingTop: 4 }}>
              <button className="cr-cancel" onClick={onClose}
                style={{ flex: 1, padding: 12, borderRadius: 10, border: `0.5px solid ${C.border}`, background: "transparent", color: C.stone, fontSize: 11, fontFamily: f.font, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", transition: "all .15s" }}>
                Cancel
              </button>
              <button className="cr-submit" onClick={handleSubmit} disabled={loading}
                style={{ flex: 2, padding: 12, borderRadius: 10, border: "none", background: loading ? C.stone : C.dark, color: C.sand, fontSize: 11, fontFamily: f.font, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer", transition: "background .15s" }}>
                {loading ? "Submitting..." : mode === "edit" ? "Save Changes →" : "Submit Request →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}