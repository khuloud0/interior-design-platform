import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const C = {
  dark:   "#2C221A",
  mid:    "#3D3128",
  sand:   "#D4C4B0",
  stone:  "#8C7B6B",
  muted:  "#B0A090",
  border: "#E2D8CE",
  bg:     "#F5F0EA",
  sec:    "#F7F3EF",
};
const f = { font: "'Jost', sans-serif", serif: "'Cormorant Garamond', serif" };

const SectionDivider = ({ label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
    <span style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: C.muted, whiteSpace: "nowrap" }}>
      {label}
    </span>
    <div style={{ flex: 1, height: "0.5px", background: C.border }} />
  </div>
);

const inputStyle = (hasError = false) => ({
  width: "100%",
  background: "#fff",
  border: `0.5px solid ${hasError ? "#B05030" : C.border}`,
  borderRadius: 8,
  padding: "9px 12px",
  fontSize: 12,
  fontFamily: f.font,
  fontWeight: 300,
  color: C.dark,
  outline: "none",
  boxSizing: "border-box",
});

const STYLES_OPTIONS  = ["Luxury", "Modern", "Minimal", "Classic", "Boho", "Contemporary"];
const SERVICE_OPTIONS = ["Full Interior Design", "Execution Supervision", "3D Visualization", "Space Planning", "Furniture Selection", "Color Consultation"];
const SPACE_OPTIONS   = ["Majlis", "Bedroom", "Living Room", "Kitchen", "Villa", "Office"];

const ChipGroup = ({ options, selected, onChange }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
    {options.map(opt => {
      const active = selected.includes(opt);
      return (
        <button
          key={opt} type="button"
          onClick={() => onChange(active ? selected.filter(s => s !== opt) : [...selected, opt])}
          style={{
            padding: "5px 12px", borderRadius: 20, fontSize: 10,
            fontFamily: f.font, cursor: "pointer", transition: "all .15s",
            border: `0.5px solid ${active ? C.dark : C.border}`,
            background: active ? C.dark : "transparent",
            color: active ? C.sand : C.stone,
          }}
        >
          {opt}
        </button>
      );
    })}
  </div>
);

export default function DesignerEditProfile() {
  const navigate = useNavigate();
  const user  = (() => { try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; } })();
  const token = localStorage.getItem("token")?.trim();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isNew, setIsNew]     = useState(false);

  const [form, setForm] = useState({
    slug:             "",
    specialty:        "",
    bio:              "",
    city:             "Riyadh",
    years_experience: "",
    starting_price:   "",
    styles:           [],
    service_types:    [],
    space_types:      [],
    profile_image:    "",
    cover_image:      "",
  });

  // ── Fetch existing profile ──────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://127.0.0.1:5000/designers/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ── Token expired → redirect to login ──
        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }

        const data = await res.json();
        if (res.ok) {
          setForm({
            slug:             data.slug             || "",
            specialty:        data.specialty        || "",
            bio:              data.bio              || "",
            city:             data.city             || "Riyadh",
            years_experience: data.years_experience || "",
            starting_price:   data.starting_price   || "",
            styles:           data.styles           || [],
            service_types:    data.service_types    || [],
            space_types:      data.space_types      || [],
            profile_image:    data.profile_image    || "",
            cover_image:      data.cover_image      || "",
          });
          setIsNew(false);
        } else {
          setIsNew(true);
        }
      } catch {
        setIsNew(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const setField = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      let res;

      if (isNew) {
        res = await fetch("http://127.0.0.1:5000/designers", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            ...form,
            user_id:          user.id,
            years_experience: Number(form.years_experience),
            starting_price:   Number(form.starting_price),
          }),
        });
      } else {
        res = await fetch("http://127.0.0.1:5000/designers/me", {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            ...form,
            years_experience: Number(form.years_experience),
            starting_price:   Number(form.starting_price),
          }),
        });
      }

      // ── Token expired أثناء الحفظ ──
      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Failed to save profile.");
        setIsError(true);
      } else {
        setMessage("Profile saved successfully.");
        setIsError(false);
        setIsNew(false);
        setTimeout(() => navigate("/designer/requests"), 1200);
      }
    } catch {
      setMessage("Something went wrong.");
      setIsError(true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: f.font, fontSize: 12, color: C.muted }}>
      Loading...
    </div>
  );

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::placeholder { color: #C8BEB4; font-size: 12px; font-weight: 300; }
        input:focus, textarea:focus { border-color: #8C7B6B !important; box-shadow: 0 0 0 3px rgba(140,123,107,0.08); outline: none; }
        .save-btn:not(:disabled):hover { background: #3D3128 !important; }
        .back-btn:hover { border-color: #B0A090 !important; color: #5C4A3C !important; }
      `}</style>

      <div style={{ minHeight: "100vh", background: C.bg, padding: "28px 20px 48px", fontFamily: f.font }}>
        <div style={{ maxWidth: 600, margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 }}>

          {/* back nav */}
          <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
            <button className="back-btn" onClick={() => navigate("/designer/requests")} style={{ padding: "7px 14px", borderRadius: 8, border: `0.5px solid ${C.border}`, background: "transparent", color: C.stone, fontSize: 11, fontFamily: f.font, cursor: "pointer" }}>← Back</button>
            <button className="back-btn" onClick={() => navigate("/")} style={{ padding: "7px 14px", borderRadius: 8, border: `0.5px solid ${C.border}`, background: "transparent", color: C.stone, fontSize: 11, fontFamily: f.font, cursor: "pointer" }}>Home</button>
          </div>

          {/* MAIN CARD */}
          <div style={{ background: "#fff", border: `0.5px solid ${C.border}`, borderRadius: 18, overflow: "hidden" }}>

            {/* dark header */}
            <div style={{ background: C.dark, padding: "28px 32px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <div style={{ width: 24, height: 24, border: "1.5px solid rgba(212,196,176,.3)", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                    <rect x="2" y="2" width="5" height="5" stroke="#D4C4B0" strokeWidth="1.2" rx="1"/>
                    <rect x="9" y="2" width="5" height="5" fill="rgba(212,196,176,.35)" rx="1"/>
                    <rect x="2" y="9" width="5" height="5" fill="rgba(212,196,176,.35)" rx="1"/>
                    <rect x="9" y="9" width="5" height="5" stroke="#D4C4B0" strokeWidth="1.2" rx="1"/>
                  </svg>
                </div>
                <span style={{ fontFamily: f.serif, fontSize: 12, fontWeight: 600, letterSpacing: ".2em", color: C.sand, textTransform: "uppercase" }}>Swagne</span>
              </div>
              <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: ".22em", color: "rgba(212,196,176,.4)", textTransform: "uppercase", marginBottom: 8 }}>
                Designer Portal
              </div>
              <div style={{ fontFamily: f.serif, fontSize: 32, fontWeight: 300, color: "#fff", lineHeight: 1.1, marginBottom: 6 }}>
                {isNew ? "Set Up Your Profile" : "Edit Your Profile"}
              </div>
              <div style={{ fontSize: 12, color: "rgba(212,196,176,.5)", fontWeight: 300, lineHeight: 1.7 }}>
                {isNew
                  ? "Complete your profile so clients can find and contact you."
                  : "Update your profile details — changes reflect immediately."
                }
              </div>
            </div>

            {/* form body */}
            <form onSubmit={handleSubmit}>
              <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 22 }}>

                {/* Basic info */}
                <div>
                  <SectionDivider label="Basic Info" />
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {isNew && (
                      <div>
                        <label style={{ display: "block", fontSize: 9, fontWeight: 500, color: C.stone, letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 5 }}>
                          Profile URL (slug)
                        </label>
                        <input
                          type="text" placeholder="e.g. sara-alharbi"
                          value={form.slug}
                          onChange={e => setField("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                          style={inputStyle()}
                        />
                        <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>
                          swagne.com/designers/{form.slug || "your-slug"}
                        </div>
                      </div>
                    )}
                    <div>
                      <label style={{ display: "block", fontSize: 9, fontWeight: 500, color: C.stone, letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 5 }}>Specialty</label>
                      <input type="text" placeholder="e.g. Luxury & Modern Interiors" value={form.specialty} onChange={e => setField("specialty", e.target.value)} style={inputStyle()} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 9, fontWeight: 500, color: C.stone, letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 5 }}>Bio</label>
                      <textarea
                        placeholder="Tell clients about your experience and design philosophy…"
                        value={form.bio}
                        onChange={e => setField("bio", e.target.value)}
                        rows={4}
                        style={{ ...inputStyle(), resize: "vertical", lineHeight: 1.7 }}
                      />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div>
                        <label style={{ display: "block", fontSize: 9, fontWeight: 500, color: C.stone, letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 5 }}>Years of Experience</label>
                        <input type="number" placeholder="e.g. 7" value={form.years_experience} onChange={e => setField("years_experience", e.target.value)} style={inputStyle()} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: 9, fontWeight: 500, color: C.stone, letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 5 }}>Starting Price (SAR)</label>
                        <input type="number" placeholder="e.g. 8000" value={form.starting_price} onChange={e => setField("starting_price", e.target.value)} style={inputStyle()} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Styles */}
                <div>
                  <SectionDivider label="Design Styles" />
                  <ChipGroup options={STYLES_OPTIONS} selected={form.styles} onChange={v => setField("styles", v)} />
                </div>

                {/* Services */}
                <div>
                  <SectionDivider label="Services" />
                  <ChipGroup options={SERVICE_OPTIONS} selected={form.service_types} onChange={v => setField("service_types", v)} />
                </div>

                {/* Spaces */}
                <div>
                  <SectionDivider label="Space Types" />
                  <ChipGroup options={SPACE_OPTIONS} selected={form.space_types} onChange={v => setField("space_types", v)} />
                </div>

                {/* Images */}
                <div>
                  <SectionDivider label="Images" />
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 9, fontWeight: 500, color: C.stone, letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 5 }}>Profile Image URL</label>
                      <input type="url" placeholder="https://..." value={form.profile_image} onChange={e => setField("profile_image", e.target.value)} style={inputStyle()} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 9, fontWeight: 500, color: C.stone, letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 5 }}>Cover Image URL</label>
                      <input type="url" placeholder="https://..." value={form.cover_image} onChange={e => setField("cover_image", e.target.value)} style={inputStyle()} />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="save-btn"
                  disabled={saving}
                  style={{
                    width: "100%", padding: "13px", border: "none", borderRadius: 10,
                    background: C.dark, color: C.sand, fontSize: 10.5, fontWeight: 500,
                    fontFamily: f.font, letterSpacing: ".16em", textTransform: "uppercase",
                    cursor: saving ? "not-allowed" : "pointer",
                    opacity: saving ? 0.5 : 1, transition: "background .15s",
                  }}
                >
                  {saving ? "Saving..." : isNew ? "Create Profile" : "Save Changes"}
                </button>

                {/* Message */}
                {message && (
                  <div style={{
                    padding: "10px 14px", borderRadius: 8, fontSize: 12,
                    textAlign: "center", fontWeight: 400,
                    background: isError ? "rgba(176,80,48,0.07)" : "rgba(92,112,87,0.08)",
                    color: isError ? "#B05030" : "#4A6645",
                    border: `0.5px solid ${isError ? "rgba(176,80,48,0.2)" : "rgba(92,112,87,0.2)"}`,
                  }}>
                    {message}
                  </div>
                )}

              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

// <Route path="/designer/MyProfile" element={<DesignerEditProfile />} />
