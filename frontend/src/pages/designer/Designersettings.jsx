import { useState } from "react";
import { Bell, Check, Eye, EyeOff, Lock, User } from "lucide-react";
import api from "../../services/api";
import { DesignerShell } from "./DesignerShell";

const C = {
  dark: "#2C221A",
  sand: "#D4C4B0",
  stone: "#8C7B6B",
  muted: "#B0A090",
  border: "#E2D8CE",
  bg: "#F5F2ED",
  sec: "#FAF7F4",
  card: "#FFFFFF",
  error: "#B05030",
  success: "#4A6645",
  accent: "#C9902A",
};

const f = { font: "'Jost', sans-serif", serif: "'Cormorant Garamond', serif" };

const TABS = [
  { key: "account", label: "Account", icon: User, soon: false },
  { key: "password", label: "Password", icon: Lock, soon: false },
  { key: "notifications", label: "Notifications", icon: Bell, soon: true },
];

const Label = ({ children }) => (
  <label style={{ display: "block", marginBottom: 6, color: C.muted, fontSize: 9, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase" }}>
    {children}
  </label>
);

const inputStyle = (focused) => ({
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: `0.5px solid ${focused ? C.stone : C.border}`,
  background: focused ? C.card : C.sec,
  color: C.dark,
  fontFamily: f.font,
  fontSize: 12.5,
  outline: "none",
  boxShadow: focused ? "0 0 0 3px rgba(140,123,107,0.08)" : "none",
  transition: "all .15s",
});

function TextInput({ label, value, onChange, placeholder, type = "text" }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <Label>{label}</Label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(event) => onChange(event.target.value)}
        style={inputStyle(focused)}
      />
    </div>
  );
}

function PasswordInput({ label, value, onChange, placeholder }) {
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);
  return (
    <div>
      <Label>{label}</Label>
      <div style={{ position: "relative" }}>
        <input
          type={show ? "text" : "password"}
          value={value}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(event) => onChange(event.target.value)}
          style={{ ...inputStyle(focused), paddingRight: 40 }}
        />
        <button
          type="button"
          onClick={() => setShow((current) => !current)}
          aria-label={show ? "Hide password" : "Show password"}
          style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", border: 0, background: "transparent", color: C.muted, cursor: "pointer" }}
        >
          {show ? <EyeOff size={14} strokeWidth={1.5} /> : <Eye size={14} strokeWidth={1.5} />}
        </button>
      </div>
    </div>
  );
}

const SectionCard = ({ children }) => (
  <section style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 14, padding: "28px 32px" }}>
    {children}
  </section>
);

const SectionTitle = ({ children }) => (
  <div style={{ marginBottom: 20, paddingBottom: 12, borderBottom: `0.5px solid ${C.border}`, color: C.stone, fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" }}>
    {children}
  </div>
);

function SaveButton({ onClick, saving, saved }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={saving}
      style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 28px", border: 0, borderRadius: 8, background: saved ? C.success : C.dark, color: C.sand, fontFamily: f.font, fontSize: 11, fontWeight: 500, letterSpacing: ".12em", textTransform: "uppercase", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}
    >
      {saved ? <><Check size={12} strokeWidth={2} /> Saved</> : saving ? "Saving..." : "Save Changes"}
    </button>
  );
}

function Toast({ msg, type }) {
  return (
    <div style={{ position: "fixed", bottom: 32, left: "50%", zIndex: 999, transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: 8, background: type === "error" ? C.error : C.dark, color: C.sand, fontFamily: f.font, fontSize: 12, letterSpacing: "0.04em" }}>
      {type !== "error" && <Check size={13} strokeWidth={2} />}
      {msg}
    </div>
  );
}

function AccountTab() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [form, setForm] = useState({ name: user.name || "", email: user.email || "", phone: user.phone || "", city: user.city || "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState(null);

  const set = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await api.patch("/auth/me", form);
      const nextUser = { ...user, ...(response.data?.user || form) };
      localStorage.setItem("user", JSON.stringify(nextUser));
      setSaved(true);
      setToast({ msg: "Account updated successfully", type: "success" });
    } catch {
      setToast({ msg: "Failed to save account", type: "error" });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <>
      <SectionCard>
        <SectionTitle>Personal Information</SectionTitle>
        <div className="designer-settings-form-grid">
          <TextInput label="Full Name" value={form.name} onChange={(value) => set("name", value)} placeholder="Your full name" />
          <TextInput label="City" value={form.city} onChange={(value) => set("city", value)} placeholder="e.g. Riyadh" />
          <TextInput label="Email Address" value={form.email} onChange={(value) => set("email", value)} placeholder="you@example.com" type="email" />
          <TextInput label="Phone Number" value={form.phone} onChange={(value) => set("phone", value)} placeholder="+966 5X XXX XXXX" />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
          <SaveButton onClick={handleSave} saving={saving} saved={saved} />
        </div>
      </SectionCard>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </>
  );
}

function PasswordTab() {
  const [form, setForm] = useState({ current: "", newPass: "", confirm: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const set = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
    setSaved(false);
  };

  const handleSave = async () => {
    if (!form.current) return setError("Please enter your current password.");
    if (form.newPass.length < 8) return setError("New password must be at least 8 characters.");
    if (form.newPass !== form.confirm) return setError("Passwords don't match.");
    setSaving(true);
    try {
      await api.post("/auth/change-password", { current_password: form.current, new_password: form.newPass });
      setForm({ current: "", newPass: "", confirm: "" });
      setSaved(true);
      setToast({ msg: "Password changed successfully", type: "success" });
    } catch {
      setError("Failed to change password.");
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <>
      <SectionCard>
        <SectionTitle>Change Password</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 480 }}>
          <PasswordInput label="Current Password" value={form.current} onChange={(value) => set("current", value)} placeholder="Enter current password" />
          <PasswordInput label="New Password" value={form.newPass} onChange={(value) => set("newPass", value)} placeholder="Min. 8 characters" />
          <PasswordInput label="Confirm Password" value={form.confirm} onChange={(value) => set("confirm", value)} placeholder="Repeat new password" />
          {error && <div style={{ padding: "10px 14px", borderRadius: 8, border: "0.5px solid rgba(176,80,48,0.2)", background: "rgba(176,80,48,0.07)", color: C.error, fontSize: 12 }}>{error}</div>}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
          <SaveButton onClick={handleSave} saving={saving} saved={saved} />
        </div>
      </SectionCard>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </>
  );
}

function ComingSoon() {
  return (
    <SectionCard>
      <SectionTitle>Notifications</SectionTitle>
      <div style={{ display: "grid", minHeight: 220, placeItems: "center", borderRadius: 12, background: C.sec, color: C.muted, textAlign: "center", fontSize: 13, lineHeight: 1.7 }}>
        <div>
          <strong style={{ display: "block", marginBottom: 6, color: C.dark, fontFamily: f.serif, fontSize: 24, fontWeight: 400 }}>Coming Soon</strong>
          Notification preferences will be available shortly.
        </div>
      </div>
    </SectionCard>
  );
}

export default function DesignerSettings({ initialTab = "account" }) {
  const [tab, setTab] = useState(initialTab);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const initials = user?.name?.split(" ").map((word) => word[0]).slice(0, 2).join("").toUpperCase() || "?";

  return (
    <DesignerShell active="settings">
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
      <section style={{ minHeight: "calc(100vh - 122px)", fontFamily: f.font }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div style={{ color: C.muted, fontSize: 9, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase" }}>DESIGNER PORTAL</div>
          <div style={{ display: "grid", width: 36, height: 36, placeItems: "center", borderRadius: "50%", background: C.dark, color: C.sand, fontFamily: f.serif, fontSize: 14, fontWeight: 600 }}>{initials}</div>
        </div>

        <h1 style={{ margin: "0 0 8px", color: C.dark, fontFamily: f.serif, fontSize: 36, fontWeight: 400, lineHeight: 1.15 }}>Settings</h1>
        <p style={{ margin: "0 0 28px", color: C.muted, fontSize: 13, fontWeight: 300, lineHeight: 1.75 }}>Manage your account, designer profile, and security preferences.</p>

        <div className="designer-settings-layout">
          <aside className="designer-settings-tabs">
            {TABS.map((item) => {
              const active = tab === item.key;
              const Icon = item.icon;
              return (
                <button key={item.key} type="button" onClick={() => setTab(item.key)} className={active ? "is-active" : ""}>
                  <span><Icon size={14} strokeWidth={1.5} />{item.label}</span>
                  {item.soon && <b>Soon</b>}
                </button>
              );
            })}
          </aside>

          <div>
            {tab === "account" && <AccountTab />}
            {tab === "password" && <PasswordTab />}
            {tab === "notifications" && <ComingSoon />}
          </div>
        </div>
      </section>
    </DesignerShell>
  );
}
