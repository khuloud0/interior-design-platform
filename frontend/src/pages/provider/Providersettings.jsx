import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProviderSidebar from "../../components/ProviderSidebar";
import { User, Lock, Bell, CreditCard, Check, Eye, EyeOff, ChevronRight } from "lucide-react";

const C = {
  dark: "#2C221A", mid: "#3D3128", sand: "#D4C4B0",
  stone: "#8C7B6B", muted: "#B0A090", border: "#E2D8CE",
  bg: "#F5F0EA", sec: "#F7F3EF", card: "#FFFFFF",
  error: "#B05030", success: "#4A6645", accent: "#C9902A",
};
const f = { font: "'Jost', sans-serif", serif: "'Cormorant Garamond', serif" };

const TABS = [
  { key: "account",       label: "Account",       icon: User,        soon: false },
  { key: "password",      label: "Password",       icon: Lock,        soon: false },
  { key: "notifications", label: "Notifications",  icon: Bell,        soon: true  },
  { key: "billing",       label: "Billing",        icon: CreditCard,  soon: true  },
];

/* ── Coming Soon overlay wrapper ── */
const ComingSoon = ({ children }) => (
  <div style={{ position: "relative" }}>
    <div style={{ pointerEvents: "none", userSelect: "none", opacity: 0.35, filter: "blur(1.5px)" }}>
      {children}
    </div>
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 10,
    }}>
      <div style={{
        background: C.card, border: `0.5px solid ${C.border}`,
        borderRadius: 14, padding: "20px 36px", textAlign: "center",
        boxShadow: "0 8px 32px rgba(44,34,26,0.10)",
      }}>
        <div style={{ fontSize: 18, marginBottom: 6 }}>🔒</div>
        <div style={{ fontFamily: f.serif, fontSize: 22, fontWeight: 400, color: C.dark, marginBottom: 4 }}>
          Coming Soon
        </div>
        <div style={{ fontSize: 12, color: C.muted, fontWeight: 300, lineHeight: 1.6 }}>
          This feature is under development<br />and will be available shortly.
        </div>
      </div>
    </div>
  </div>
);

const Label = ({ children }) => (
  <label style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: C.muted, fontFamily: f.font, marginBottom: 6, display: "block" }}>
    {children}
  </label>
);

const inpSt = (focused) => ({
  width: "100%", padding: "10px 12px", borderRadius: 8,
  border: `0.5px solid ${focused ? C.stone : C.border}`,
  background: focused ? C.card : C.sec,
  fontSize: 12.5, color: C.dark, fontFamily: f.font,
  outline: "none", boxSizing: "border-box", transition: "all .15s",
  boxShadow: focused ? "0 0 0 3px rgba(140,123,107,0.08)" : "none",
});

const TextInput = ({ label, value, onChange, placeholder, type = "text", disabled }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      {label && <Label>{label}</Label>}
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} disabled={disabled}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ ...inpSt(focused), opacity: disabled ? 0.5 : 1, cursor: disabled ? "not-allowed" : "text" }}
      />
    </div>
  );
};

const PasswordInput = ({ label, value, onChange, placeholder }) => {
  const [focused, setFocused] = useState(false);
  const [show, setShow]       = useState(false);
  return (
    <div>
      {label && <Label>{label}</Label>}
      <div style={{ position: "relative" }}>
        <input
          type={show ? "text" : "password"} value={value}
          onChange={e => onChange(e.target.value)} placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ ...inpSt(focused), paddingRight: 40 }}
        />
        <button onClick={() => setShow(s => !s)}
          style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: C.muted, display: "flex", alignItems: "center" }}>
          {show ? <EyeOff size={14} strokeWidth={1.5} /> : <Eye size={14} strokeWidth={1.5} />}
        </button>
      </div>
    </div>
  );
};

const Toggle = ({ checked, onChange }) => (
  <button onClick={() => onChange(!checked)}
    style={{
      width: 40, height: 22, borderRadius: 11, border: "none", cursor: "pointer",
      background: checked ? C.dark : C.border, transition: "background .2s",
      position: "relative", flexShrink: 0,
    }}>
    <span style={{
      position: "absolute", top: 3, left: checked ? 20 : 3,
      width: 16, height: 16, borderRadius: "50%", background: C.card,
      transition: "left .2s",
    }} />
  </button>
);

const NotifRow = ({ label, desc, checked, onChange }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: `0.5px solid ${C.border}` }}>
    <div>
      <div style={{ fontSize: 13, color: C.dark, marginBottom: 3 }}>{label}</div>
      {desc && <div style={{ fontSize: 11, color: C.muted, fontWeight: 300 }}>{desc}</div>}
    </div>
    <Toggle checked={checked} onChange={onChange} />
  </div>
);

const SectionCard = ({ children }) => (
  <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 14, padding: "28px 32px" }}>
    {children}
  </div>
);

const SectionTitle = ({ children }) => (
  <div style={{ fontSize: 11, fontWeight: 500, color: C.stone, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20, paddingBottom: 12, borderBottom: `0.5px solid ${C.border}` }}>
    {children}
  </div>
);

const SaveBtn = ({ onClick, saving, saved }) => (
  <button onClick={onClick} disabled={saving}
    style={{
      padding: "10px 28px", border: "none", borderRadius: 8,
      background: saved ? C.success : C.dark,
      color: C.sand, fontSize: 11, fontWeight: 500,
      fontFamily: f.font, letterSpacing: ".12em", textTransform: "uppercase",
      cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1,
      transition: "all .2s", display: "flex", alignItems: "center", gap: 8,
    }}>
    {saved ? <><Check size={12} strokeWidth={2} /> Saved</> : saving ? "Saving..." : "Save Changes"}
  </button>
);

/* ── Toast ── */
const Toast = ({ msg, type }) => (
  <div style={{
    position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)",
    background: type === "error" ? C.error : C.dark,
    color: C.sand, padding: "12px 28px", borderRadius: 8,
    fontSize: 12, fontFamily: f.font, zIndex: 999, letterSpacing: "0.04em",
    display: "flex", alignItems: "center", gap: 8,
  }}>
    {type !== "error" && <Check size={13} strokeWidth={2} />}
    {msg}
  </div>
);

/* ══════════════════════════════════════════
   TABS
══════════════════════════════════════════ */

function AccountTab() {
  const provider = JSON.parse(localStorage.getItem("user") || "{}");
  const [form, setForm]   = useState({ name: provider.name || "", email: provider.email || "", phone: provider.phone || "", city: provider.city || "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [toast, setToast]   = useState(null);

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setSaved(false); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:5000/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify({ ...provider, ...form }));
        setSaved(true);
        setToast({ msg: "Account updated successfully", type: "success" });
        setTimeout(() => setToast(null), 3000);
      } else {
        setToast({ msg: data.message || "Failed to save", type: "error" });
        setTimeout(() => setToast(null), 3000);
      }
    } catch {
      setToast({ msg: "Network error", type: "error" });
      setTimeout(() => setToast(null), 3000);
    } finally { setSaving(false); }
  };

  return (
    <>
      <SectionCard>
        <SectionTitle>Personal Information</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <TextInput label="Full Name"  value={form.name}  onChange={v => set("name", v)}  placeholder="Your full name" />
            <TextInput label="City"       value={form.city}  onChange={v => set("city", v)}  placeholder="e.g. Riyadh" />
          </div>
          <TextInput label="Email Address" value={form.email} onChange={v => set("email", v)} placeholder="you@example.com" type="email" />
          <TextInput label="Phone Number"  value={form.phone} onChange={v => set("phone", v)} placeholder="+966 5X XXX XXXX" />
        </div>
        <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
          <SaveBtn onClick={handleSave} saving={saving} saved={saved} />
        </div>
      </SectionCard>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </>
  );
}

function PasswordTab() {
  const [form, setForm]   = useState({ current: "", newPass: "", confirm: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [error, setError]   = useState("");
  const [toast, setToast]   = useState(null);

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setError(""); setSaved(false); };

  const handleSave = async () => {
    if (!form.current)          { setError("Please enter your current password."); return; }
    if (form.newPass.length < 8) { setError("New password must be at least 8 characters."); return; }
    if (form.newPass !== form.confirm) { setError("Passwords don't match."); return; }
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:5000/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ current_password: form.current, new_password: form.newPass }),
      });
      const data = await res.json();
      if (res.ok) {
        setForm({ current: "", newPass: "", confirm: "" });
        setSaved(true);
        setToast({ msg: "Password changed successfully", type: "success" });
        setTimeout(() => setToast(null), 3000);
      } else {
        setError(data.message || "Failed to change password.");
      }
    } catch { setError("Network error."); }
    finally { setSaving(false); }
  };

  return (
    <>
      <SectionCard>
        <SectionTitle>Change Password</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 480 }}>
          <PasswordInput label="Current Password" value={form.current} onChange={v => set("current", v)} placeholder="Enter current password" />
          <PasswordInput label="New Password"     value={form.newPass} onChange={v => set("newPass", v)} placeholder="Min. 8 characters" />
          <PasswordInput label="Confirm Password" value={form.confirm} onChange={v => set("confirm", v)} placeholder="Repeat new password" />
          {error && (
            <div style={{ fontSize: 12, color: C.error, padding: "10px 14px", borderRadius: 8, background: "rgba(176,80,48,0.07)", border: "0.5px solid rgba(176,80,48,0.2)" }}>
              {error}
            </div>
          )}
        </div>
        <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
          <SaveBtn onClick={handleSave} saving={saving} saved={saved} />
        </div>
      </SectionCard>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </>
  );
}

function NotificationsTab() {
  const [notifs, setNotifs] = useState({
    new_offer:       true,
    offer_accepted:  true,
    offer_declined:  false,
    project_update:  true,
    payment_received:true,
    marketing:       false,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [toast, setToast]   = useState(null);

  const set = (k, v) => { setNotifs(p => ({ ...p, [k]: v })); setSaved(false); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:5000/provider/notifications/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(notifs),
      });
      if (res.ok) {
        setSaved(true);
        setToast({ msg: "Notification preferences saved", type: "success" });
        setTimeout(() => setToast(null), 3000);
      }
    } catch {}
    finally { setSaving(false); }
  };

  return (
    <>
      <SectionCard>
        <SectionTitle>Notification Preferences</SectionTitle>
        <NotifRow label="New Offer Available"    desc="Get notified when a designer posts a new offer"  checked={notifs.new_offer}        onChange={v => set("new_offer", v)} />
        <NotifRow label="Offer Accepted"         desc="When a client accepts your submitted offer"       checked={notifs.offer_accepted}   onChange={v => set("offer_accepted", v)} />
        <NotifRow label="Offer Declined"         desc="When a client declines your offer"               checked={notifs.offer_declined}   onChange={v => set("offer_declined", v)} />
        <NotifRow label="Project Updates"        desc="Activity and messages on active projects"        checked={notifs.project_update}   onChange={v => set("project_update", v)} />
        <NotifRow label="Payment Received"       desc="When a payment is released to your account"     checked={notifs.payment_received} onChange={v => set("payment_received", v)} />
        <NotifRow label="Marketing & Promotions" desc="Tips, offers, and platform news"                 checked={notifs.marketing}        onChange={v => set("marketing", v)} />
        <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
          <SaveBtn onClick={handleSave} saving={saving} saved={saved} />
        </div>
      </SectionCard>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </>
  );
}

function BillingTab() {
  const [invoices] = useState([
    { id: "INV-0041", date: "May 1, 2025",   amount: 1200, status: "paid" },
    { id: "INV-0038", date: "Apr 1, 2025",   amount: 980,  status: "paid" },
    { id: "INV-0031", date: "Mar 1, 2025",   amount: 1450, status: "paid" },
  ]);
  const [iban, setIban]   = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [toast, setToast]   = useState(null);

  const handleSave = async () => {
    if (!iban.trim()) return;
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:5000/provider/billing", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ iban }),
      });
      if (res.ok) {
        setSaved(true);
        setToast({ msg: "Bank details saved", type: "success" });
        setTimeout(() => setToast(null), 3000);
      }
    } catch {}
    finally { setSaving(false); }
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Bank account */}
        <SectionCard>
          <SectionTitle>Bank Account</SectionTitle>
          <div style={{ maxWidth: 480 }}>
            <TextInput label="IBAN" value={iban} onChange={v => { setIban(v); setSaved(false); }} placeholder="SA00 0000 0000 0000 0000 0000" />
            <div style={{ fontSize: 11, color: C.muted, marginTop: 8, lineHeight: 1.6 }}>
              Your IBAN is used to release payments after project completion.
            </div>
          </div>
          <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
            <SaveBtn onClick={handleSave} saving={saving} saved={saved} />
          </div>
        </SectionCard>

        {/* Invoices */}
        <SectionCard>
          <SectionTitle>Invoice History</SectionTitle>
          {invoices.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0", color: C.muted, fontSize: 13, fontWeight: 300 }}>No invoices yet.</div>
          ) : (
            <div>
              {/* Header */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 12, padding: "0 0 10px", borderBottom: `0.5px solid ${C.border}`, marginBottom: 4 }}>
                {["Invoice", "Date", "Amount", "Status"].map(h => (
                  <div key={h} style={{ fontSize: 9, color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase" }}>{h}</div>
                ))}
              </div>
              {invoices.map(inv => (
                <div key={inv.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 12, padding: "14px 0", borderBottom: `0.5px solid ${C.border}`, alignItems: "center" }}>
                  <div style={{ fontSize: 12, color: C.dark, fontWeight: 500 }}>{inv.id}</div>
                  <div style={{ fontSize: 12, color: C.stone }}>{inv.date}</div>
                  <div style={{ fontSize: 12, color: C.dark }}>{inv.amount.toLocaleString()} SAR</div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, fontSize: 10, background: "rgba(74,102,69,0.10)", color: C.success, whiteSpace: "nowrap" }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.success }} />
                    Paid
                  </span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </>
  );
}

/* ══════════════════════════════════════════
   MAIN
══════════════════════════════════════════ */
export default function ProviderSettings() {
  const navigate  = useNavigate();
  const [tab, setTab] = useState("account");
  const provider  = JSON.parse(localStorage.getItem("user") || "{}");
  const initials  = provider?.name?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?";

  const activeTab = TABS.find(t => t.key === tab);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } body { margin: 0; } ::placeholder { color: #C8BEB4; font-size: 12px; font-weight: 300; }`}</style>

      <div style={{ display: "flex", height: "100vh", fontFamily: f.font, background: C.bg }}>
        <ProviderSidebar variant="light" />

        <main style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }}>

          {/* Top bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
            <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.16em", color: C.muted, textTransform: "uppercase" }}>
              PROVIDER PORTAL
            </div>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: f.serif, fontSize: 14, fontWeight: 600, color: C.sand }}>
              {initials}
            </div>
          </div>

          {/* Header */}
          <h1 style={{ fontFamily: f.serif, fontSize: 36, fontWeight: 400, color: C.dark, marginBottom: 8, lineHeight: 1.15 }}>Settings</h1>
          <p style={{ fontSize: 13, color: C.muted, fontWeight: 300, marginBottom: 28, lineHeight: 1.75 }}>
            Manage your account, notifications, and billing preferences.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 20, alignItems: "start" }}>

            {/* ── Sidebar tabs ── */}
            <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 14, padding: "8px 0", position: "sticky", top: 0 }}>
              {TABS.map(t => {
                const active = tab === t.key;
                const Icon   = t.icon;
                return (
                  <button key={t.key} onClick={() => setTab(t.key)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "12px 18px", border: "none", cursor: "pointer", fontFamily: f.font,
                      background: active ? C.sec : "transparent",
                      borderLeft: `2px solid ${active ? C.dark : "transparent"}`,
                      color: active ? C.dark : t.soon ? C.muted : C.stone,
                      fontSize: 12, fontWeight: active ? 500 : 400,
                      transition: "all .15s", textAlign: "left",
                    }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Icon size={14} strokeWidth={1.5} />
                      {t.label}
                    </div>
                    {t.soon && (
                      <span style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: C.accent, background: "rgba(201,144,42,0.10)", padding: "2px 7px", borderRadius: 20 }}>
                        Soon
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* ── Tab content ── */}
            <div>
              {tab === "account"       && <AccountTab />}
              {tab === "password"      && <PasswordTab />}
              {tab === "notifications" && <ComingSoon><NotificationsTab /></ComingSoon>}
              {tab === "billing"       && <ComingSoon><BillingTab /></ComingSoon>}
            </div>

          </div>
        </main>
      </div>
    </>
  );
}