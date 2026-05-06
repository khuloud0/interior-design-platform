import React, { useState } from "react";
import axios from "axios";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", password: "",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedRole, setSelectedRole] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone) newErrors.phone = "Phone is required";
    if (!formData.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const getPasswordStrength = () => {
    const p = formData.password;
    if (!p) return null;
    if (p.length < 6) return { label: "Weak", color: "#B05030" };
    if (p.length < 10) return { label: "Medium", color: "#C97D4E" };
    return { label: "Strong", color: "#5C7057" };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setMessage("");
    try {
        const pendingSignup = {
            ...formData,
            role: selectedRole,
        };
        localStorage.setItem("pendingSignup", JSON.stringify(pendingSignup));
        localStorage.setItem("signupPhone", formData.phone);
        setMessage("Phone verification required.");
        setIsError(false);
        setTimeout(() => {
            window.location.href = "/verify-phone";
        }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.error || "Signup failed");
      setIsError(true);
    } finally {
      setLoading(false);
    }
    }

  const strength = getPasswordStrength();
  const isSubmitDisabled = !selectedRole || loading;

  const EyeIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );

  const EyeOffIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 3l18 18M10.5 10.5A3 3 0 0013.5 13.5M2 12s4-6 10-6c1.5 0 3 .3 4.3.8M22 12s-4 6-10 6a11 11 0 01-4.3-.8"/>
    </svg>
  );

  const c = {
    bg: "#F7F3EE", card: "#FFFFFF", sand: "#D4C4B0",
    stone: "#8C7B6B", dark: "#3D3128", border: "#E0D5C8",
    inputBg: "#FAF7F4", muted: "#A39080", error: "#B05030", success: "#5C7057",
  };

  const inputStyle = (hasError) => ({
    width: "100%",
    background: c.inputBg,
    border: `1px solid ${hasError ? c.error : c.border}`,
    borderRadius: "8px",
    padding: "9px 12px",
    fontSize: "11px",
    fontFamily: "'Jost', sans-serif",
    fontWeight: 300,
    color: c.dark,
    outline: "none",
    boxSizing: "border-box",
  });

  const roles = ["client", "designer", "provider"];

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Jost:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />
      <style>{`
        input::placeholder { color: #CFC0B0; font-size: 11px; font-weight: 300; }
        input:focus { border-color: #8C7B6B !important; box-shadow: 0 0 0 3px rgba(140,123,107,0.1); background: #fff !important; }
        .role-btn:hover { border-color: #8C7B6B; color: #8C7B6B; }
        .submit-btn:not(:disabled):hover { background: #8C7B6B; }
      `}</style>

      <div style={{
        minHeight: "100vh", background: c.bg, display: "flex",
        alignItems: "center", justifyContent: "center",
        fontFamily: "'Jost', sans-serif", padding: "24px",
      }}>
        <div style={{
          background: c.card, border: `1px solid ${c.border}`,
          borderRadius: "12px", padding: "36px 36px 28px",
          width: "100%", maxWidth: "400px",
          boxShadow: "0 2px 24px rgba(61,49,40,0.07)",
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "20px" }}>
            <div style={{
              width: "28px", height: "28px", border: `1.5px solid ${c.sand}`,
              borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="2" width="5" height="5" stroke="#8C7B6B" strokeWidth="1" rx="1"/>
                <rect x="9" y="2" width="5" height="5" fill="#D4C4B0" rx="1"/>
                <rect x="2" y="9" width="5" height="5" fill="#D4C4B0" rx="1"/>
                <rect x="9" y="9" width="5" height="5" stroke="#8C7B6B" strokeWidth="1" rx="1"/>
              </svg>
            </div>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: "16px",
              fontWeight: 600, letterSpacing: "0.12em", color: c.dark, textTransform: "uppercase",
            }}>Swagne</span>
          </div>

          {/* Header */}
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: "24px",
            fontWeight: 300, color: c.dark, marginBottom: "3px",
          }}>Create an Account</h2>
          <p style={{ fontSize: "12px", color: c.muted, fontWeight: 300, marginBottom: "16px" }}>
            Begin your design journey with us.
          </p>
          <div style={{ width: "28px", height: "1px", background: c.sand, marginBottom: "18px" }}/>

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontSize: "9px", fontWeight: 500, color: c.stone, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "5px" }}>
                Full Name
              </label>
              <input
                name="name" type="text"
                placeholder="Your name"
                onChange={handleChange}
                style={inputStyle(!!errors.name)}
              />
              {errors.name && <div style={{ fontSize: "10px", color: c.error, marginTop: "4px" }}>{errors.name}</div>}
            </div>

            {/* Email */}
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontSize: "9px", fontWeight: 500, color: c.stone, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "5px" }}>
                Email
              </label>
              <input
                name="email" type="email"
                placeholder="you@example.com"
                onChange={handleChange}
                style={inputStyle(!!errors.email)}
              />
              {errors.email && <div style={{ fontSize: "10px", color: c.error, marginTop: "4px" }}>{errors.email}</div>}
            </div>

            {/* Phone */}
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontSize: "9px", fontWeight: 500, color: c.stone, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "5px" }}>
                Phone
              </label>
              <input
                name="phone" type="tel"
                placeholder="+966 5xx xxx xxxx"
                onChange={handleChange}
                style={inputStyle(!!errors.phone)}
              />
              {errors.phone && <div style={{ fontSize: "10px", color: c.error, marginTop: "4px" }}>{errors.phone}</div>}
            </div>

            {/* Password */}
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontSize: "9px", fontWeight: 500, color: c.stone, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "5px" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  onChange={handleChange}
                  style={{ ...inputStyle(!!errors.password), paddingRight: "38px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute", right: "10px", top: "50%",
                    transform: "translateY(-50%)", background: "none",
                    border: "none", cursor: "pointer", color: c.muted,
                    display: "flex", alignItems: "center",
                  }}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {strength && (
                <>
                  <div style={{ display: "flex", gap: "3px", marginTop: "6px" }}>
                    {[1, 2, 3].map((i) => (
                      <div key={i} style={{
                        height: "2px", flex: 1, borderRadius: "1px",
                        background: (
                          i === 1 ? strength.color :
                          i === 2 && strength.label !== "Weak" ? strength.color :
                          i === 3 && strength.label === "Strong" ? strength.color :
                          c.border
                        ),
                        transition: "background 0.3s",
                      }}/>
                    ))}
                  </div>
                  <div style={{ fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase", color: strength.color, marginTop: "4px" }}>
                    {strength.label}
                  </div>
                </>
              )}
              {errors.password && <div style={{ fontSize: "10px", color: c.error, marginTop: "4px" }}>{errors.password}</div>}
            </div>

            {/* Role */}
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontSize: "9px", fontWeight: 500, color: c.stone, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "5px" }}>
                Role
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "6px" }}>
                {roles.map((r) => (
                  <button
                    key={r} type="button"
                    className="role-btn"
                    onClick={() => setSelectedRole(r)}
                    style={{
                      background: selectedRole === r ? c.dark : c.inputBg,
                      border: `1px solid ${selectedRole === r ? c.dark : c.border}`,
                      borderRadius: "8px", padding: "9px 4px",
                      fontSize: "11px", fontFamily: "'Jost', sans-serif",
                      fontWeight: 400, color: selectedRole === r ? c.sand : c.muted,
                      cursor: "pointer", textAlign: "center", letterSpacing: "0.04em",
                      transition: "all 0.2s",
                    }}
                  >
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitDisabled}
              style={{
                width: "100%", padding: "11px", border: "none",
                borderRadius: "8px", background: c.dark, color: c.sand,
                fontSize: "11px", fontWeight: 500, fontFamily: "'Jost', sans-serif",
                letterSpacing: "0.16em", textTransform: "uppercase",
                cursor: isSubmitDisabled ? "not-allowed" : "pointer",
                marginTop: "6px", opacity: isSubmitDisabled ? 0.38 : 1,
                transition: "background 0.2s, opacity 0.2s",
              }}
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          {/* Message */}
          {message && (
            <div style={{
              marginTop: "12px", padding: "10px 12px", borderRadius: "8px",
              fontSize: "12px", textAlign: "center", fontWeight: 400,
              background: isError ? "rgba(176,80,48,0.07)" : "rgba(92,112,87,0.08)",
              color: isError ? c.error : c.success,
              border: `1px solid ${isError ? "rgba(176,80,48,0.18)" : "rgba(92,112,87,0.2)"}`,
            }}>
              {message}
            </div>
          )}

          {/* Footer */}
          <p style={{ marginTop: "16px", textAlign: "center", fontSize: "12px", color: c.muted, fontWeight: 300 }}>
            Already have an account?{" "}
            <a href="/" style={{ color: c.stone, fontWeight: 500, textDecoration: "none" }}>Sign in</a>
          </p>
        </div>
      </div>
    </>
  );
}