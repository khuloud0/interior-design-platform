import React, { useState } from "react";
import loginImg from "../../assets/images/LoginSideImage.svg";
import logo from "../../assets/images/Logo130_27.svg";
import { Mail, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [message, setMessage]           = useState("");
  const [isError, setIsError]           = useState(false);
  const [loading, setLoading]           = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors]             = useState({});

  const c = {
    bg: "#F7F3EE", card: "#FFFFFF", sand: "#D4C4B0",
    stone: "#8C7B6B", dark: "#3D3128", border: "#E0D5C8",
    inputBg: "#FAF7F4", muted: "#A39080", error: "#B05030", success: "#5C7057",
  };

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

  const validate = () => {
    const e = {};
    if (!email)    e.email    = "Email is required";
    if (!password) e.password = "Password is required";
    return e;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setLoading(true); setMessage("");
    try {
      const res = await fetch("http://127.0.0.1:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setMessage(data.error || "Login failed"); setIsError(true); return; }
      localStorage.setItem("token", data.token || data.access_token);
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
      setMessage("Login successful — welcome back."); setIsError(false);
      setTimeout(() => {
        const role = data.user?.role;
        window.location.href = role === "designer" ? "/designer/requests"
          : role === "client" ? "/dashboard" : "/";
      }, 1200);
    } catch {
      setMessage("Something went wrong"); setIsError(true);
    } finally { setLoading(false); }
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { margin: 0; padding: 0; }
        input::placeholder { color: #CFC0B0; font-size: 12px; font-weight: 300; }
        input:focus { border-color: #8C7B6B !important; box-shadow: 0 0 0 3px rgba(140,123,107,0.1); background: #fff !important; }
        .login-btn:not(:disabled):hover { background: #5C4A3A !important; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(61,49,40,0.25) !important; }
        .login-btn:not(:disabled):active { transform: translateY(0); box-shadow: none !important; }
        .login-btn { transition: background 0.2s, transform 0.15s, box-shadow 0.15s; }
      `}</style>

      <div style={{ height: "100vh", overflow: "hidden", display: "grid", gridTemplateColumns: "1fr 1fr", fontFamily: "'Jost', sans-serif" }}>

        {/* LEFT — Image */}
        <div style={{ overflow: "hidden", height: "100vh" }}>
          <img src={loginImg} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>

        {/* RIGHT — Form */}
        <div style={{
          position: "relative",
          background: c.card, display: "flex", flexDirection: "column",
          justifyContent: "center", padding: "40px 64px",
          borderLeft: `1px solid ${c.border}`, overflowY: "auto",
        }}>
          <div>
            {/* Logo */}
            <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: "9px", textDecoration: "none", marginBottom: "48px" }}>
              <img src={logo} alt="Swagne" style={{ height: "27px" }} />
            </a>

            {/* Title */}
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: "40px",
              fontWeight: 400, color: c.dark, marginBottom: "28px", lineHeight: 1.15,
            }}>Welcome back</h1>

            <form onSubmit={handleLogin}>
              {/* Email */}
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "9px", fontWeight: 500, color: c.stone, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "5px" }}>Email</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <input type="email" placeholder="Enter your email address" value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors({ ...errors, email: "" }); }}
                    style={inputStyle(!!errors.email)} />
                  <span style={iconStyle}><Mail size={14} strokeWidth={1.5} /></span>
                </div>
                {errors.email && <div style={{ fontSize: "10px", color: c.error, marginTop: "4px" }}>{errors.email}</div>}
              </div>

              {/* Password */}
              <div style={{ marginBottom: "6px" }}>
                <label style={{ display: "block", fontSize: "9px", fontWeight: 500, color: c.stone, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "5px" }}>Password</label>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <input type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors({ ...errors, password: "" }); }}
                    style={{ ...inputStyle(!!errors.password), paddingRight: "36px" }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: "11px", background: "none", border: "none", cursor: "pointer", color: c.muted, display: "flex", alignItems: "center", padding: 0 }}>
                    {showPassword ? <EyeOff size={14} strokeWidth={1.5} /> : <Eye size={14} strokeWidth={1.5} />}
                  </button>
                </div>
                {errors.password && <div style={{ fontSize: "10px", color: c.error, marginTop: "4px" }}>{errors.password}</div>}
              </div>

              {/* Forgot */}
              <div style={{ textAlign: "right", marginBottom: "20px" }}>
                <a href="/forgot-password" style={{ fontSize: "10px", color: c.stone, textDecoration: "none", letterSpacing: "0.04em" }}>Forgot password?</a>
              </div>

              {/* Submit */}
              <button type="submit" className="login-btn" disabled={loading}
                style={{
                  width: "100%", padding: "12px", border: "none", borderRadius: "8px",
                  background: c.dark, color: c.sand, fontSize: "11px", fontWeight: 500,
                  fontFamily: "'Jost', sans-serif", letterSpacing: "0.16em", textTransform: "uppercase",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.5 : 1, transition: "background 0.2s, opacity 0.2s",
                }}>
                {loading ? "Signing in..." : "Sign In"}
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

            <p style={{ marginTop: "16px", textAlign: "center", fontSize: "12px", color: c.muted, fontWeight: 300 }}>
              Don't have an account?{" "}
              <a href="/signup" style={{ color: c.stone, fontWeight: 500, textDecoration: "none" }}>Sign up</a>
            </p>
          </div>

          {/* Footer */}
          <p style={{ position: "absolute", bottom: "28px", left: 0, right: 0, textAlign: "center", fontSize: "11px", color: c.muted, fontWeight: 300 }}>
            © 2026 Swagne. All rights reserved.
          </p>
        </div>

      </div>
    </>
  );
}