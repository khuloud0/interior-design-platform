import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DesignerSidebar from "../../components/DesignerSidebar";

const C = {
  dark: "#2C221A", sand: "#D4C4B0", stone: "#8C7B6B",
  muted: "#B0A090", border: "#E2D8CE", bg: "#F8F5F0",
};
const f = { font: "'Jost', sans-serif", serif: "'Cormorant Garamond', serif" };

const inputStyle = () => ({
  width: "100%", background: "#fff", border: `0.5px solid ${C.border}`,
  borderRadius: 8, padding: "10px 14px", fontSize: 12,
  fontFamily: f.font, fontWeight: 300, color: C.dark,
  outline: "none", boxSizing: "border-box",
});

const labelStyle = {
  display: "block", fontSize: 9, fontWeight: 500,
  color: C.stone, letterSpacing: ".14em",
  textTransform: "uppercase", marginBottom: 6,
};

const sectionStyle = {
  minHeight: 145,
  borderBottom: "0.5px solid #E2D8CE",
  paddingBottom: 24,
  marginBottom: 24,
};

const SPACE_OPTIONS = ["Majlis", "Bedroom", "Living Room", "Kitchen", "Villa", "Office"];
const STYLE_OPTIONS = ["Luxury", "Modern", "Minimal", "Classic", "Boho", "Contemporary"];

export default function DesignerEditProfile() {
  const navigate = useNavigate();
  const user = (() => { try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; } })();
  const token = localStorage.getItem("token")?.trim();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [spaceInput, setSpaceInput] = useState("");
  const [styleInput, setStyleInput] = useState("");

  const [form, setForm] = useState({
    slug: "", full_name: "", specialty: "", bio: "",
    city: "Riyadh", phone: "", email: "", availability: "available",
    years_experience: "", starting_price: "",
    styles: [], space_types: [],
    profile_image: "", portfolio_images: [],
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://127.0.0.1:5000/designers/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
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
            full_name:        data.full_name        || "",
            specialty:        data.specialty        || "",
            bio:              data.bio              || "",
            city:             data.city             || "Riyadh",
            phone:            data.phone            || "",
            email:            data.email            || user.email || "",
            availability:     data.availability     || "available",
            years_experience: data.years_experience || "",
            starting_price:   data.starting_price   || "",
            styles:           data.styles           || [],
            space_types:      data.space_types      || [],
            profile_image:    data.profile_image    || "",
            portfolio_images: data.portfolio_images || [],
          });
          setIsNew(false);
        } else {
          setForm(f => ({ ...f, email: user.email || "" }));
          setIsNew(true);
        }
      } catch {
        setForm(f => ({ ...f, email: user.email || "" }));
        setIsNew(true);
      }
      finally { setLoading(false); }
    };
    fetchProfile();
  }, []);

  const setField = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const addChip = (field, value, setValue) => {
    const v = value.trim();
    if (!v || form[field].includes(v)) return;
    setField(field, [...form[field], v]);
    setValue("");
  };

  const removeChip = (field, value) =>
    setField(field, form[field].filter(s => s !== value));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const body = {
        ...form,
        user_id: user.id,
        years_experience: Number(form.years_experience),
        starting_price: Number(form.starting_price),
      };
      const res = await fetch(
        isNew ? "http://127.0.0.1:5000/designers" : "http://127.0.0.1:5000/designers/me",
        {
          method: isNew ? "POST" : "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(body),
        }
      );
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
        setTimeout(() => navigate("/designer/MyProfile"), 1200);
      }
    } catch {
      setMessage("Something went wrong.");
      setIsError(true);
    } finally { setSaving(false); }
  };

  if (loading) return (
    <div style={{ display: "flex", height: "100vh", background: C.bg }}>
      <DesignerSidebar variant="light" />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: f.font, fontSize: 12, color: C.muted }}>Loading...</div>
    </div>
  );

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::placeholder { color: #C8BEB4; font-size: 12px; font-weight: 300; }
        input:focus, textarea:focus, select:focus { border-color: #8C7B6B !important; outline: none; }
        .save-btn:not(:disabled):hover { background: #3D3128 !important; }
      `}</style>

      <div style={{ display: "flex", height: "100vh", background: C.bg, fontFamily: f.font }}>
        <DesignerSidebar variant="light" />

        <div style={{ flex: 1, overflowY: "auto" }}>
          <form onSubmit={handleSubmit}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "320px 1fr",
              minHeight: "100vh",
              background: "#fff",
            }}>

              {/* ── LEFT ── */}
              <div style={{
                borderRight: `0.5px solid ${C.border}`,
                padding: "48px 32px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 20,
                background: "#F8F5F0",
                overflowY: "auto",
              }}>

                {/* Photo */}
                <div style={{ position: "relative", width: 160, height: 160 }}>
                  <label style={{ cursor: "pointer", display: "block", width: "100%", height: "100%" }}>
                    <input
                      type="file" accept="image/*" style={{ display: "none" }}
                      onChange={e => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = ev => setField("profile_image", ev.target.result);
                        reader.readAsDataURL(file);
                      }}
                    />
                    <div style={{
                      width: "100%", height: "100%", borderRadius: 16,
                      background: form.profile_image ? "transparent" : "#EDE7DF",
                      border: `0.5px solid ${C.border}`, overflow: "hidden",
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center", gap: 8,
                    }}>
                      {form.profile_image
                        ? <img src={form.profile_image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B0A090" strokeWidth="1.5">
                              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                              <circle cx="12" cy="13" r="4"/>
                            </svg>
                            <span style={{ fontSize: 10, color: C.muted }}>Upload Profile Picture</span>
                          </>
                      }
                    </div>
                  </label>
                  {form.profile_image && (
                    <span
                      onClick={() => setField("profile_image", "")}
                      style={{
                        position: "absolute", top: 6, right: 6,
                        background: "rgba(0,0,0,0.45)", color: "#fff",
                        borderRadius: 4, padding: "2px 6px",
                        fontSize: 11, cursor: "pointer", lineHeight: 1.4, zIndex: 1,
                      }}
                    >×</span>
                  )}
                </div>

                {/* Edit fields */}
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Full Name</label>
                    <input type="text" placeholder="e.g. Nora Al-Harbi"
                      value={form.full_name} onChange={e => setField("full_name", e.target.value)}
                      style={inputStyle()} />
                  </div>
                  <div>
                    <label style={labelStyle}>Specialty</label>
                    <input type="text" placeholder="e.g. Luxury Residential Design"
                      value={form.specialty} onChange={e => setField("specialty", e.target.value)}
                      style={inputStyle()} />
                  </div>
                  <div>
                    <label style={labelStyle}>City</label>
                    <input type="text" placeholder="e.g. Riyadh"
                      value={form.city} onChange={e => setField("city", e.target.value)}
                      style={inputStyle()} />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone</label>
                    <input type="tel" placeholder="e.g. 966 55 000 0000"
                      value={form.phone} onChange={e => setField("phone", e.target.value)}
                      style={inputStyle()} />
                  </div>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input type="email" placeholder="e.g. email@example.com"
                      value={form.email} onChange={e => setField("email", e.target.value)}
                      style={inputStyle()} />
                  </div>
                  <div>
                    <label style={labelStyle}>Years of Experience</label>
                    <input type="number" placeholder="e.g. 4"
                      value={form.years_experience} onChange={e => setField("years_experience", e.target.value)}
                      style={inputStyle()} />
                  </div>
                  <div>
                    <label style={labelStyle}>Starting Price (SAR)</label>
                    <input type="number" placeholder="e.g. 6500"
                      value={form.starting_price} onChange={e => setField("starting_price", e.target.value)}
                      style={inputStyle()} />
                  </div>
                  <div>
                    <label style={labelStyle}>Availability</label>
                    <select value={form.availability} onChange={e => setField("availability", e.target.value)}
                      style={{ ...inputStyle(), cursor: "pointer" }}>
                      <option value="available">Available for work</option>
                      <option value="busy">Busy</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* ── RIGHT ── */}
              <div style={{
                padding: "48px 56px",
                display: "flex",
                flexDirection: "column",
                gap: 0,
              }}>

                {/* ABOUT */}
                <div style={{ ...sectionStyle, minHeight: 182 }}>
                  <label style={labelStyle}>About</label>
                  <textarea
                    placeholder="Describe your design philosophy and the spaces you bring to life"
                    value={form.bio}
                    onChange={e => setField("bio", e.target.value)}
                    rows={4}
                    maxLength={300}
                    style={{ ...inputStyle(), resize: "none", lineHeight: 1.75, height: 110 }}
                  />
                  <div style={{ fontSize: 10, color: C.muted, textAlign: "right", marginTop: 4 }}>
                    {form.bio.length} / 300 characters
                  </div>
                </div>

                {/* DESIGNED SPACES */}
                <div style={sectionStyle}>
                  <label style={labelStyle}>Designed Spaces</label>
                  <div
                    style={{
                      minHeight: 46, padding: "8px 12px",
                      background: "#F8F5F0", border: `0.5px solid ${C.border}`,
                      borderRadius: 8, display: "flex", flexWrap: "wrap",
                      gap: 6, alignItems: "center", cursor: "text",
                    }}
                    onClick={() => document.getElementById("space-input").focus()}
                  >
                    {form.space_types.map(s => (
                      <span key={s} style={{
                        padding: "4px 10px", borderRadius: 20, fontSize: 11,
                        background: C.dark, color: C.sand,
                        display: "flex", alignItems: "center", gap: 5,
                      }}>
                        {s}
                        <span
                          onClick={e => { e.stopPropagation(); removeChip("space_types", s); }}
                          style={{ cursor: "pointer", opacity: 0.6, fontSize: 13, lineHeight: 1 }}
                        >×</span>
                      </span>
                    ))}
                    <input
                      id="space-input" type="text" value={spaceInput}
                      onChange={e => setSpaceInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addChip("space_types", spaceInput, setSpaceInput); }
                        if (e.key === "Backspace" && spaceInput === "") removeChip("space_types", form.space_types[form.space_types.length - 1]);
                      }}
                      onBlur={() => addChip("space_types", spaceInput, setSpaceInput)}
                      placeholder={form.space_types.length === 0 ? "Which spaces do you design?  e.g. Majlis, Villa, Living Room" : ""}
                      style={{ border: "none", outline: "none", background: "transparent", fontSize: 12, fontFamily: f.font, color: C.dark, minWidth: 160, flex: 1 }}
                    />
                  </div>
                </div>

                {/* PREFERENCES */}
                <div style={sectionStyle}>
                  <label style={labelStyle}>Preferences</label>
                  <div
                    style={{
                      minHeight: 46, padding: "8px 12px",
                      background: "#F8F5F0", border: `0.5px solid ${C.border}`,
                      borderRadius: 8, display: "flex", flexWrap: "wrap",
                      gap: 6, alignItems: "center", cursor: "text",
                    }}
                    onClick={() => document.getElementById("style-input").focus()}
                  >
                    {form.styles.map(s => (
                      <span key={s} style={{
                        padding: "4px 10px", borderRadius: 20, fontSize: 11,
                        background: C.dark, color: C.sand,
                        display: "flex", alignItems: "center", gap: 5,
                      }}>
                        {s}
                        <span
                          onClick={e => { e.stopPropagation(); removeChip("styles", s); }}
                          style={{ cursor: "pointer", opacity: 0.6, fontSize: 13, lineHeight: 1 }}
                        >×</span>
                      </span>
                    ))}
                    <input
                      id="style-input" type="text" value={styleInput}
                      onChange={e => setStyleInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addChip("styles", styleInput, setStyleInput); }
                        if (e.key === "Backspace" && styleInput === "") removeChip("styles", form.styles[form.styles.length - 1]);
                      }}
                      onBlur={() => addChip("styles", styleInput, setStyleInput)}
                      placeholder={form.styles.length === 0 ? "What's your design style?  e.g. Luxury, Classic, Contemporary" : ""}
                      style={{ border: "none", outline: "none", background: "transparent", fontSize: 12, fontFamily: f.font, color: C.dark, minWidth: 160, flex: 1 }}
                    />
                  </div>
                </div>

                {/* PORTFOLIO PHOTOS */}
                <div style={sectionStyle}>
                  <label style={labelStyle}>Portfolio Photos</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {form.portfolio_images.map((url, i) => (
                      <div key={i} style={{ position: "relative", width: 88, height: 88 }}>
                        <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8, border: `0.5px solid ${C.border}` }} />
                        <span
                          onClick={() => setField("portfolio_images", form.portfolio_images.filter((_, idx) => idx !== i))}
                          style={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.45)", color: "#fff", borderRadius: 4, padding: "2px 6px", fontSize: 11, cursor: "pointer" }}
                        >×</span>
                      </div>
                    ))}
                    <label style={{
                      width: 88, height: 88, borderRadius: 8,
                      border: `1.5px dashed ${C.border}`,
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center",
                      cursor: "pointer", gap: 5,
                    }}>
                      <input
                        type="file" accept="image/*" style={{ display: "none" }}
                        onChange={e => {
                          const file = e.target.files[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = ev => setField("portfolio_images", [...form.portfolio_images, ev.target.result]);
                          reader.readAsDataURL(file);
                          e.target.value = "";
                        }}
                      />
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B0A090" strokeWidth="1.5">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                      </svg>
                      <span style={{ fontSize: 10, color: C.muted }}>Add Photo</span>
                    </label>
                  </div>
                </div>

                {/* SAVE */}
                <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 8 }}>
                  <button
                    type="submit" className="save-btn" disabled={saving}
                    style={{
                      padding: "12px 40px", border: "none", borderRadius: 8,
                      background: C.dark, color: C.sand,
                      fontSize: 11, fontWeight: 500, fontFamily: f.font,
                      letterSpacing: ".12em", textTransform: "uppercase",
                      cursor: saving ? "not-allowed" : "pointer",
                      opacity: saving ? 0.5 : 1, transition: "background .15s",
                    }}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>

                {message && (
                  <div style={{
                    marginTop: 16, padding: "10px 14px", borderRadius: 8,
                    fontSize: 12, textAlign: "center",
                    background: isError ? "rgba(176,80,48,0.07)" : "rgba(92,112,87,0.08)",
                    color: isError ? "#B05030" : "#4A6645",
                    border: `0.5px solid ${isError ? "rgba(176,80,48,0.2)" : "rgba(92,112,87,0.2)"}`,
                  }}>
                    {message}
                  </div>
                )}

              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}