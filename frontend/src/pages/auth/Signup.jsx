import React, { useState } from "react";
import axios from "axios";
import signupImg from "../../assets/images/SignupSideImage.svg";
import logo from "../../assets/images/Logo130_27.svg";
import { User, Mail, Phone, Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "" });
  const [message, setMessage]           = useState("");
  const [isError, setIsError]           = useState(false);
  const [loading, setLoading]           = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors]             = useState({});
  const [selectedRole, setSelectedRole] = useState("");

  const c = {
    bg: "#F7F3EE", card: "#FFFFFF", sand: "#D4C4B0",
    stone: "#8C7B6B", dark: "#3D3128", border: "#E0D5C8",
    inputBg: "#FAF7F4", muted: "#A39080", error: "#B05030", success: "#5C7057",
  };

  const inputWrap = { position: "relative", display: "flex", alignItems: "center" };
  const inputStyle = (hasError) => ({
    width: "100%", background: c.inputBg,
    border: `1px solid ${hasError ? c.error : c.border}`,
    borderRadius: "8px", padding: "10px 36px 10px 12px",
    fontSize: "12px", fontFamily: "'Jost', sans-serif",
    fontWeight: 300, color: c.dark, outline: "none", boxSizing: "border-box",
  });
  const iconStyle = {
    position: "absolute", right: "11px", color: c.muted,
    display: "flex", alignItems: "center", pointerEvents: "none",
  };

  const roles = ["client", "designer", "provider"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const e = {};
    if (!formData.name) e.name = "Name is required";
    if (!formData.email) e.email = "Email is required";
    if (!formData.phone) e.phone = "Phone is required";
    if (!formData.password) {
      e.password = "Password is required";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(formData.password)) {
      e.password = "Must include uppercase, lowercase, number & special character";
    }
    return e;
  };

  const getPasswordStrength = () => {
    const p = formData.password;
    if (!p) return null;
    const score = [/[A-Z]/.test(p), /[a-z]/.test(p), /\d/.test(p),
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p), p.length >= 8].filter(Boolean).length;
    if (score <= 2) return { label: "Weak",   color: "#B05030" };
    if (score <= 3) return { label: "Moderate", color: "#C97D4E" };
    return              { label: "Strong", color: "#5C7057" };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.removeItem("user"); localStorage.removeItem("token");
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    if (!selectedRole) { setErrors({ role: "Please select a role" }); return; }
    setLoading(true); setMessage(""); setIsError(false);
    try {
      const res = await axios.post("http://127.0.0.1:5000/auth/register", { ...formData, role: selectedRole });
      const user = res.data?.user; const token = res.data?.token;
      if (!user) { setMessage("Signup failed. Please try again."); setIsError(true); return; }
      const userWithRole = { ...user, role: selectedRole };
      localStorage.setItem("user", JSON.stringify(userWithRole));
      if (token) localStorage.setItem("token", token);
      setMessage("Account created successfully."); setIsError(false);
      setTimeout(() => {
        window.location.href = userWithRole.role === "designer" ? "/designer/requests"
          : userWithRole.role === "client" ? "/dashboard" : "/";
      }, 1500);
    } catch (err) {
      localStorage.removeItem("user"); localStorage.removeItem("token");
      setMessage(err.response?.data?.error || err.response?.data?.message || "This email or phone is already registered.");
      setIsError(true);
    } finally { setLoading(false); }
  };

  const strength = getPasswordStrength();
  const isSubmitDisabled = !selectedRole || loading;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { margin: 0; padding: 0; }
        input::placeholder { color: #CFC0B0; font-size: 12px; font-weight: 300; }
        input:focus { border-color: #8C7B6B !important; box-shadow: 0 0 0 3px rgba(140,123,107,0.1); background: #fff !important; }
        .role-btn:hover { border-color: #8C7B6B !important; color: #8C7B6B !important; }
        .submit-btn:not(:disabled):hover { background: #8C7B6B !important; }
        .submit-btn { transition: background 0.2s; }
        .signin-link:hover { color: #3D3128 !important; }
      `}</style>

      <div style={{ height: "100vh", overflow: "hidden", display: "grid", gridTemplateColumns: "1fr 1fr", fontFamily: "'Jost', sans-serif" }}>

        {/* LEFT — Image */}
        <div style={{ overflow: "hidden" }}>
          <img src={signupImg} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>

        {/* RIGHT — Form */}
        <div style={{
          background: c.card, display: "flex", flexDirection: "column",
          justifyContent: "space-between", padding: "40px 64px 28px",
          borderLeft: `1px solid ${c.border}`, overflowY: "auto",
        }}>
          <div>
            {/* Logo + Sign in link */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "40px" }}>
              <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: "9px", textDecoration: "none" }}>
                <img src={logo} alt="Swagne" style={{ height: "27px" }} />
              </a>
              <p style={{ fontSize: "12px", color: c.muted, fontWeight: 300, margin: 0 }}>
                Already have an account?{" "}
                <a href="/login" className="signin-link" style={{ color: c.stone, fontWeight: 500, textDecoration: "none" }}>Sign in</a>
              </p>
            </div>

            {/* Title */}
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: "40px",
              fontWeight: 400, color: c.dark, marginBottom: "28px", lineHeight: 1.15,
            }}>Create your account</h1>

            <form onSubmit={handleSubmit}>
              {/* Full Name */}
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "9px", fontWeight: 500, color: c.stone, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "5px" }}>Full Name</label>
                <div style={inputWrap}>
                  <input name="name" type="text" placeholder="Enter your full name" onChange={handleChange} style={inputStyle(!!errors.name)} />
                  <span style={iconStyle}><User size={14} strokeWidth={1.5} /></span>
                </div>
                {errors.name && <div style={{ fontSize: "10px", color: c.error, marginTop: "4px" }}>{errors.name}</div>}
              </div>

              {/* Email */}
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "9px", fontWeight: 500, color: c.stone, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "5px" }}>Email</label>
                <div style={inputWrap}>
                  <input name="email" type="email" placeholder="Enter your email address" onChange={handleChange} style={inputStyle(!!errors.email)} />
                  <span style={iconStyle}><Mail size={14} strokeWidth={1.5} /></span>
                </div>
                {errors.email && <div style={{ fontSize: "10px", color: c.error, marginTop: "4px" }}>{errors.email}</div>}
              </div>

              {/* Phone */}
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "9px", fontWeight: 500, color: c.stone, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "5px" }}>Phone</label>
                <div style={inputWrap}>
                  <span style={{
                    position: "absolute", left: "12px", fontSize: "12px", fontWeight: 400,
                    color: c.dark, pointerEvents: "none", zIndex: 1, userSelect: "none",
                    borderRight: `1px solid ${c.border}`, paddingRight: "10px",
                  }}>+966</span>
                  <input name="phone" type="tel" placeholder="Enter your phone number" onChange={handleChange}
                    style={{ ...inputStyle(!!errors.phone), paddingLeft: "58px", paddingRight: "36px" }} />
                  <span style={iconStyle}><Phone size={14} strokeWidth={1.5} /></span>
                </div>
                {errors.phone && <div style={{ fontSize: "10px", color: c.error, marginTop: "4px" }}>{errors.phone}</div>}
              </div>

              {/* Password */}
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "9px", fontWeight: 500, color: c.stone, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "5px" }}>Password</label>
                <div style={inputWrap}>
                  <input name="password" type={showPassword ? "text" : "password"}
                    placeholder="Create a password" onChange={handleChange}
                    style={{ ...inputStyle(!!errors.password), paddingRight: "36px" }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: "11px", background: "none", border: "none", cursor: "pointer", color: c.muted, display: "flex", alignItems: "center", padding: 0 }}>
                    {showPassword ? <EyeOff size={14} strokeWidth={1.5} /> : <Eye size={14} strokeWidth={1.5} />}
                  </button>
                </div>
                {strength && (
                  <div style={{ display: "flex", gap: "3px", marginTop: "6px", alignItems: "center" }}>
                    {[1, 2, 3].map(i => (
                      <div key={i} style={{
                        height: "2px", flex: 1, borderRadius: "1px",
                        background: i === 1 ? strength.color
                          : i === 2 && strength.label !== "Weak" ? strength.color
                          : i === 3 && strength.label === "Strong" ? strength.color : c.border,
                        transition: "background 0.3s",
                      }} />
                    ))}
                    <span style={{ fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: strength.color, marginLeft: "6px", whiteSpace: "nowrap" }}>
                      Password strength: {strength.label}
                    </span>
                  </div>
                )}
                {errors.password && <div style={{ fontSize: "10px", color: c.error, marginTop: "4px" }}>{errors.password}</div>}
              </div>

              {/* Role */}
              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "9px", fontWeight: 500, color: c.stone, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "5px" }}>I am a</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px" }}>
                  {roles.map(r => (
                    <button key={r} type="button" className="role-btn"
                      onClick={() => setSelectedRole(r)}
                      style={{
                        background: selectedRole === r ? c.dark : c.inputBg,
                        border: `1px solid ${selectedRole === r ? c.dark : c.border}`,
                        borderRadius: "8px", padding: "10px 4px",
                        fontSize: "12px", fontFamily: "'Jost', sans-serif",
                        fontWeight: 400, color: selectedRole === r ? c.sand : c.muted,
                        cursor: "pointer", textAlign: "center", letterSpacing: "0.04em",
                        transition: "all 0.2s",
                      }}>
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </button>
                  ))}
                </div>
                {errors.role && <div style={{ fontSize: "10px", color: c.error, marginTop: "4px" }}>{errors.role}</div>}
              </div>

              {/* Submit */}
              <button type="submit" className="submit-btn" disabled={isSubmitDisabled}
                style={{
                  width: "100%", padding: "12px", border: "none", borderRadius: "8px",
                  background: c.dark, color: c.sand, fontSize: "11px", fontWeight: 500,
                  fontFamily: "'Jost', sans-serif", letterSpacing: "0.16em", textTransform: "uppercase",
                  cursor: isSubmitDisabled ? "not-allowed" : "pointer",
                  opacity: isSubmitDisabled ? 0.38 : 1, transition: "background 0.2s, opacity 0.2s",
                }}>
                {loading ? "Creating..." : "Create Account"}
              </button>
            </form>

            {message && (
              <div style={{
                marginTop: "12px", padding: "10px 12px", borderRadius: "8px",
                fontSize: "12px", textAlign: "center", fontWeight: 400,
                background: isError ? "rgba(176,80,48,0.07)" : "rgba(92,112,87,0.08)",
                color: isError ? c.error : c.success,
                border: `1px solid ${isError ? "rgba(176,80,48,0.18)" : "rgba(92,112,87,0.2)"}`,
              }}>{message}</div>
            )}
          </div>

          {/* Footer */}
          <p style={{ textAlign: "center", fontSize: "11px", color: c.muted, fontWeight: 300, marginTop: "24px" }}>
            © 2026 Swagne. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}