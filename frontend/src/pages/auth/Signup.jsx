import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import signupImg from "../../assets/images/SignupSideImage.svg";
import logo from "../../assets/images/Logo130_27.svg";
import { User, Mail, Phone, Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const location = useLocation();
  const roleFromUrl = new URLSearchParams(location.search).get("role") || "";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedRole, setSelectedRole] = useState(roleFromUrl);

  const c = {
    bg: "#F7F3EE",
    card: "#FFFFFF",
    sand: "#D4C4B0",
    stone: "#8C7B6B",
    dark: "#3D3128",
    border: "#E0D5C8",
    inputBg: "#FAF7F4",
    muted: "#A39080",
    error: "#B05030",
    success: "#5C7057",
  };

  const inputWrap = {
    position: "relative",
    display: "flex",
    alignItems: "center",
  };

<<<<<<< HEAD
  const inputWrap = { position: "relative", display: "flex", alignItems: "center" };

=======
>>>>>>> fix:last
  const inputStyle = (hasError) => ({
    width: "100%",
    background: c.inputBg,
    border: `1px solid ${hasError ? c.error : c.border}`,
    borderRadius: "8px",
    padding: "10px 36px 10px 12px",
    fontSize: "12px",
    fontFamily: "'Jost', sans-serif",
    fontWeight: 300,
    color: c.dark,
    outline: "none",
    boxSizing: "border-box",
  });

  const iconStyle = {
    position: "absolute",
    right: "11px",
    color: c.muted,
    display: "flex",
    alignItems: "center",
    pointerEvents: "none",
  };

  const roles = ["client", "designer", "provider"];

<<<<<<< HEAD
  const emailRegex    = /^[A-Za-z0-9._%+-]+@(gmail|hotmail|yahoo|microsoft)\.com$/;
  // ✅ الجوال: أرقام إنجليزية فقط، 9 أرقام، يبدأ بـ 5
  const phoneRegex    = /^5[0-9]{8}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

  // ✅ الاسم: حروف عربية أو إنجليزية فقط — يمنع الأرقام العربية والإنجليزية والرموز
  // \u0600-\u0605 و \u060B-\u065F و \u0670-\u06EF هي الحروف العربية بدون الأرقام
  const nameRegex = /^[A-Za-z\u0621-\u064A\u0660-\u0669\u066E\u066F\u0671-\u06D3\u06D5\s]+$/;
  // الأبسط: نمنع أي رقم (عربي أو إنجليزي) ونمنع الرموز
  const isValidName = (val) => /^[^\d\u0660-\u0669!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+$/.test(val);
=======
  const roleLabel = {
    client: "Client",
    designer: "Designer",
    provider: "Provider",
  };
>>>>>>> fix:last

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "name") {
      if (!value) {
        setErrors({ ...errors, name: "Name is required" });
      } else if (!isValidName(value)) {
        setErrors({ ...errors, name: "Name must contain letters only, no numbers or symbols" });
      } else {
        setErrors({ ...errors, name: "" });
      }
      return;
    }

    if (name === "email") {
      if (!value) {
        setErrors({ ...errors, email: "Email is required" });
      } else if (!emailRegex.test(value)) {
        setErrors({
          ...errors,
          email: "Email must be English only and use gmail.com, hotmail.com, yahoo.com, or microsoft.com",
        });
      } else {
        setErrors({ ...errors, email: "" });
      }
      return;
    }

    if (name === "phone") {
      if (!value) {
        setErrors({ ...errors, phone: "Phone is required" });
      } else if (!/^[0-9]+$/.test(value)) {
        setErrors({ ...errors, phone: "Phone must contain English numbers only" });
      } else if (!phoneRegex.test(value)) {
        setErrors({ ...errors, phone: "Phone must start with 5 and be 9 digits (e.g. 501234567)" });
      } else {
        setErrors({ ...errors, phone: "" });
      }
      return;
    }

    if (name === "password") {
      if (!value) {
        setErrors({ ...errors, password: "Password is required" });
      } else if (!passwordRegex.test(value)) {
        setErrors({
          ...errors,
          password: "Password must be at least 8 characters and include uppercase, lowercase, number & special character",
        });
      } else {
        setErrors({ ...errors, password: "" });
      }
      return;
    }

    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const e = {};

<<<<<<< HEAD
    if (!formData.name) {
      e.name = "Name is required";
    } else if (!isValidName(formData.name)) {
      e.name = "Name must contain letters only, no numbers or symbols";
    }

    if (!formData.email) {
      e.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      e.email = "Email must be English only and use gmail.com, hotmail.com, yahoo.com, or microsoft.com";
    }

    if (!formData.phone) {
      e.phone = "Phone is required";
    } else if (!/^[0-9]+$/.test(formData.phone)) {
      e.phone = "Phone must contain English numbers only";
    } else if (!phoneRegex.test(formData.phone)) {
      e.phone = "Phone must start with 5 and be 9 digits (e.g. 501234567)";
    }

    if (!formData.password) {
      e.password = "Password is required";
    } else if (!passwordRegex.test(formData.password)) {
      e.password = "Must include uppercase, lowercase, number & special character";
=======
    if (!formData.name) e.name = "Name is required";
    if (!formData.email) e.email = "Email is required";
    if (!formData.phone) e.phone = "Phone is required";

    if (!formData.password) {
      e.password = "Password is required";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(
        formData.password
      )
    ) {
      e.password =
        "Must include uppercase, lowercase, number & special character";
>>>>>>> fix:last
    }

    return e;
  };

  const getPasswordStrength = () => {
    const p = formData.password;
    if (!p) return null;
<<<<<<< HEAD
    const score = [
      /[A-Z]/.test(p), /[a-z]/.test(p), /\d/.test(p),
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p),
      p.length >= 8,
    ].filter(Boolean).length;
    if (score <= 2) return { label: "Weak",     color: "#B05030" };
    if (score <= 3) return { label: "Moderate", color: "#C97D4E" };
    return              { label: "Strong",   color: "#5C7057" };
=======

    const score = [
      /[A-Z]/.test(p),
      /[a-z]/.test(p),
      /\d/.test(p),
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p),
      p.length >= 8,
    ].filter(Boolean).length;

    if (score <= 2) return { label: "Weak", color: "#B05030" };
    if (score <= 3) return { label: "Moderate", color: "#C97D4E" };
    return { label: "Strong", color: "#5C7057" };
>>>>>>> fix:last
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
<<<<<<< HEAD
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    if (!selectedRole) {
      setErrors({ role: "Please select a role" });
      return;
    }

    const validationErrors = validate();
=======

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    const validationErrors = validate();

>>>>>>> fix:last
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

<<<<<<< HEAD
=======
    if (!selectedRole) {
      setErrors({ role: "Please select a role" });
      return;
    }

>>>>>>> fix:last
    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const res = await axios.post("http://127.0.0.1:5000/auth/register", {
        ...formData,
<<<<<<< HEAD
        // ✅ نضيف +966 قبل الإرسال للباك
        phone: "+966" + formData.phone,
        role: selectedRole,
      });

      const user  = res.data?.user;
=======
        role: selectedRole,
      });

      const user = res.data?.user;
>>>>>>> fix:last
      const token = res.data?.token;

      if (!user) {
        setMessage("Signup failed. Please try again.");
        setIsError(true);
        return;
      }

      const userWithRole = { ...user, role: selectedRole };

      localStorage.setItem("user", JSON.stringify(userWithRole));
      if (token) localStorage.setItem("token", token);

      setMessage("Account created successfully.");
      setIsError(false);

      setTimeout(() => {
        window.location.href =
<<<<<<< HEAD
          userWithRole.role === "designer" ? "/designer/requests"
          : userWithRole.role === "client"   ? "/dashboard"
          : "/";
=======
          userWithRole.role === "designer"
            ? "/designer/requests"
            : userWithRole.role === "client"
            ? "/dashboard"
            : "/provider/offers";
>>>>>>> fix:last
      }, 1500);
    } catch (err) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
<<<<<<< HEAD
      setMessage(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "This email or phone is already registered."
=======

      setMessage(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "This email or phone is already registered."
>>>>>>> fix:last
      );
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength();

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Jost:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { margin: 0; padding: 0; }
        input::placeholder { color: #CFC0B0; font-size: 12px; font-weight: 300; }

<<<<<<< HEAD
      <div style={{
        height: "100vh", overflow: "hidden",
        display: "grid", gridTemplateColumns: "1fr 1fr",
        fontFamily: "'Jost', sans-serif",
      }}>
=======
        input:focus {
          border-color: #8C7B6B !important;
          box-shadow: 0 0 0 3px rgba(140,123,107,0.1);
          background: #fff !important;
        }

        .role-btn:hover {
          border-color: #8C7B6B !important;
          color: #8C7B6B !important;
        }

        .submit-btn:not(:disabled):hover {
          background: #8C7B6B !important;
        }

        .submit-btn {
          transition: background 0.2s;
        }

        .signin-link:hover {
          color: #3D3128 !important;
        }
>>>>>>> fix:last

        @media (max-width: 900px) {
          .signup-layout {
            grid-template-columns: 1fr !important;
            height: auto !important;
            min-height: 100vh;
          }

          .signup-image {
            display: none;
          }

          .signup-form-panel {
            padding: 32px 22px 24px !important;
          }
        }
      `}</style>

      <div
        className="signup-layout"
        style={{
          height: "100vh",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          fontFamily: "'Jost', sans-serif",
        }}
      >
        <div className="signup-image" style={{ overflow: "hidden" }}>
          <img
            src={signupImg}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        <div
          className="signup-form-panel"
          style={{
            background: c.card,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "40px 64px 28px",
            borderLeft: `1px solid ${c.border}`,
            overflowY: "auto",
          }}
        >
          <div>
<<<<<<< HEAD

            {/* Logo + Sign in */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "40px" }}>
              <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: "9px", textDecoration: "none" }}>
=======
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "40px",
              }}
            >
              <a
                href="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "9px",
                  textDecoration: "none",
                }}
              >
>>>>>>> fix:last
                <img src={logo} alt="Swagne" style={{ height: "27px" }} />
              </a>

              <p
                style={{
                  fontSize: "12px",
                  color: c.muted,
                  fontWeight: 300,
                  margin: 0,
                }}
              >
                Already have an account?{" "}
                <a
                  href="/login"
                  className="signin-link"
                  style={{
                    color: c.stone,
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  Sign in
                </a>
              </p>
            </div>

            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "40px",
                fontWeight: 400,
                color: c.dark,
                marginBottom: "28px",
                lineHeight: 1.15,
              }}
            >
              Create your account
            </h1>

            <form onSubmit={handleSubmit}>
<<<<<<< HEAD

              {/* Full Name */}
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "9px", fontWeight: 500, color: c.stone, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "5px" }}>
                  Full Name <span style={{ color: c.error }}>*</span>
                </label>
                <div style={inputWrap}>
                  <input name="name" type="text" placeholder="Enter your full name"
                    onChange={handleChange} style={inputStyle(!!errors.name)} />
                  <span style={iconStyle}><User size={14} strokeWidth={1.5} /></span>
=======
              <div style={{ marginBottom: "14px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "9px",
                    fontWeight: 500,
                    color: c.stone,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    marginBottom: "5px",
                  }}
                >
                  Full Name
                </label>

                <div style={inputWrap}>
                  <input
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    onChange={handleChange}
                    style={inputStyle(!!errors.name)}
                  />
                  <span style={iconStyle}>
                    <User size={14} strokeWidth={1.5} />
                  </span>
>>>>>>> fix:last
                </div>

                {errors.name && (
                  <div
                    style={{
                      fontSize: "10px",
                      color: c.error,
                      marginTop: "4px",
                    }}
                  >
                    {errors.name}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: "14px" }}>
<<<<<<< HEAD
                <label style={{ display: "block", fontSize: "9px", fontWeight: 500, color: c.stone, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "5px" }}>
                  Email <span style={{ color: c.error }}>*</span>
                </label>
                <div style={inputWrap}>
                  <input name="email" type="email" placeholder="Enter your email address"
                    onChange={handleChange} style={inputStyle(!!errors.email)} />
                  <span style={iconStyle}><Mail size={14} strokeWidth={1.5} /></span>
=======
                <label
                  style={{
                    display: "block",
                    fontSize: "9px",
                    fontWeight: 500,
                    color: c.stone,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    marginBottom: "5px",
                  }}
                >
                  Email
                </label>

                <div style={inputWrap}>
                  <input
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    onChange={handleChange}
                    style={inputStyle(!!errors.email)}
                  />
                  <span style={iconStyle}>
                    <Mail size={14} strokeWidth={1.5} />
                  </span>
>>>>>>> fix:last
                </div>

                {errors.email && (
                  <div
                    style={{
                      fontSize: "10px",
                      color: c.error,
                      marginTop: "4px",
                    }}
                  >
                    {errors.email}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: "14px" }}>
<<<<<<< HEAD
                <label style={{ display: "block", fontSize: "9px", fontWeight: 500, color: c.stone, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "5px" }}>
                  Phone <span style={{ color: c.error }}>*</span>
                </label>
                <div style={inputWrap}>
                  <span style={{
                    position: "absolute", left: "12px", fontSize: "12px", fontWeight: 400,
                    color: c.dark, pointerEvents: "none", zIndex: 1, userSelect: "none",
                    borderRight: `1px solid ${c.border}`, paddingRight: "10px",
                  }}>+966</span>
                  <input name="phone" type="tel" placeholder="5XXXXXXXX"
                    onChange={handleChange}
                    style={{ ...inputStyle(!!errors.phone), paddingLeft: "58px", paddingRight: "36px" }} />
                  <span style={iconStyle}><Phone size={14} strokeWidth={1.5} /></span>
=======
                <label
                  style={{
                    display: "block",
                    fontSize: "9px",
                    fontWeight: 500,
                    color: c.stone,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    marginBottom: "5px",
                  }}
                >
                  Phone
                </label>

                <div style={inputWrap}>
                  <span
                    style={{
                      position: "absolute",
                      left: "12px",
                      fontSize: "12px",
                      fontWeight: 400,
                      color: c.dark,
                      pointerEvents: "none",
                      zIndex: 1,
                      userSelect: "none",
                      borderRight: `1px solid ${c.border}`,
                      paddingRight: "10px",
                    }}
                  >
                    +966
                  </span>

                  <input
                    name="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    onChange={handleChange}
                    style={{
                      ...inputStyle(!!errors.phone),
                      paddingLeft: "58px",
                      paddingRight: "36px",
                    }}
                  />

                  <span style={iconStyle}>
                    <Phone size={14} strokeWidth={1.5} />
                  </span>
>>>>>>> fix:last
                </div>

                {errors.phone && (
                  <div
                    style={{
                      fontSize: "10px",
                      color: c.error,
                      marginTop: "4px",
                    }}
                  >
                    {errors.phone}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: "14px" }}>
<<<<<<< HEAD
                <label style={{ display: "block", fontSize: "9px", fontWeight: 500, color: c.stone, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "5px" }}>
                  Password <span style={{ color: c.error }}>*</span>
                </label>
=======
                <label
                  style={{
                    display: "block",
                    fontSize: "9px",
                    fontWeight: 500,
                    color: c.stone,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    marginBottom: "5px",
                  }}
                >
                  Password
                </label>

>>>>>>> fix:last
                <div style={inputWrap}>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    onChange={handleChange}
                    style={{
                      ...inputStyle(!!errors.password),
                      paddingRight: "36px",
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "11px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: c.muted,
                      display: "flex",
                      alignItems: "center",
                      padding: 0,
                    }}
                  >
                    {showPassword ? (
                      <EyeOff size={14} strokeWidth={1.5} />
                    ) : (
                      <Eye size={14} strokeWidth={1.5} />
                    )}
                  </button>
                </div>

                {strength && (
<<<<<<< HEAD
                  <div style={{ display: "flex", gap: "3px", marginTop: "6px", alignItems: "center" }}>
                    {[1, 2, 3].map(i => (
                      <div key={i} style={{
                        height: "2px", flex: 1, borderRadius: "1px",
                        background: i === 1 ? strength.color
                          : i === 2 && strength.label !== "Weak" ? strength.color
                          : i === 3 && strength.label === "Strong" ? strength.color
                          : c.border,
                        transition: "background 0.3s",
                      }} />
=======
                  <div
                    style={{
                      display: "flex",
                      gap: "3px",
                      marginTop: "6px",
                      alignItems: "center",
                    }}
                  >
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        style={{
                          height: "2px",
                          flex: 1,
                          borderRadius: "1px",
                          background:
                            i === 1
                              ? strength.color
                              : i === 2 && strength.label !== "Weak"
                              ? strength.color
                              : i === 3 && strength.label === "Strong"
                              ? strength.color
                              : c.border,
                          transition: "background 0.3s",
                        }}
                      />
>>>>>>> fix:last
                    ))}

                    <span
                      style={{
                        fontSize: "9px",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: strength.color,
                        marginLeft: "6px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Password strength: {strength.label}
                    </span>
                  </div>
                )}

                {errors.password && (
                  <div
                    style={{
                      fontSize: "10px",
                      color: c.error,
                      marginTop: "4px",
                    }}
                  >
                    {errors.password}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: "18px" }}>
<<<<<<< HEAD
                <label style={{ display: "block", fontSize: "9px", fontWeight: 500, color: c.stone, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "5px" }}>
                  I am a <span style={{ color: c.error }}>*</span>
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px" }}>
                  {roles.map(r => (
                    <button key={r} type="button" className="role-btn"
                      onClick={() => { setSelectedRole(r); setErrors({ ...errors, role: "" }); }}
=======
                <label
                  style={{
                    display: "block",
                    fontSize: "9px",
                    fontWeight: 500,
                    color: c.stone,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    marginBottom: "5px",
                  }}
                >
                  I am a
                </label>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3,1fr)",
                    gap: "8px",
                  }}
                >
                  {roles.map((r) => (
                    <button
                      key={r}
                      type="button"
                      className="role-btn"
                      onClick={() => setSelectedRole(r)}
>>>>>>> fix:last
                      style={{
                        background: selectedRole === r ? c.dark : c.inputBg,
                        border: `1px solid ${
                          selectedRole === r ? c.dark : c.border
                        }`,
                        borderRadius: "8px",
                        padding: "10px 4px",
                        fontSize: "12px",
                        fontFamily: "'Jost', sans-serif",
                        fontWeight: 400,
                        color: selectedRole === r ? c.sand : c.muted,
                        cursor: "pointer",
                        textAlign: "center",
                        letterSpacing: "0.04em",
                        transition: "all 0.2s",
                      }}
                    >
                      {roleLabel[r]}
                    </button>
                  ))}
                </div>

                {errors.role && (
                  <div
                    style={{
                      fontSize: "10px",
                      color: c.error,
                      marginTop: "4px",
                    }}
                  >
                    {errors.role}
                  </div>
                )}
              </div>

<<<<<<< HEAD
              {/* Submit */}
              <button type="submit" className="submit-btn" disabled={loading}
                style={{
                  width: "100%", padding: "12px", border: "none", borderRadius: "8px",
                  background: c.dark, color: c.sand, fontSize: "11px", fontWeight: 500,
                  fontFamily: "'Jost', sans-serif", letterSpacing: "0.16em", textTransform: "uppercase",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.5 : 1, transition: "background 0.2s, opacity 0.2s",
                }}>
=======
              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitDisabled}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "none",
                  borderRadius: "8px",
                  background: c.dark,
                  color: c.sand,
                  fontSize: "11px",
                  fontWeight: 500,
                  fontFamily: "'Jost', sans-serif",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  cursor: isSubmitDisabled ? "not-allowed" : "pointer",
                  opacity: isSubmitDisabled ? 0.38 : 1,
                  transition: "background 0.2s, opacity 0.2s",
                }}
              >
>>>>>>> fix:last
                {loading ? "Creating..." : "Create Account"}
              </button>
            </form>

            {message && (
              <div
                style={{
                  marginTop: "12px",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  textAlign: "center",
                  fontWeight: 400,
                  background: isError
                    ? "rgba(176,80,48,0.07)"
                    : "rgba(92,112,87,0.08)",
                  color: isError ? c.error : c.success,
                  border: `1px solid ${
                    isError
                      ? "rgba(176,80,48,0.18)"
                      : "rgba(92,112,87,0.2)"
                  }`,
                }}
              >
                {message}
              </div>
            )}
          </div>

<<<<<<< HEAD
          {/* Footer */}
          <p style={{ textAlign: "center", fontSize: "11px", color: c.muted, fontWeight: 300, marginTop: "24px" }}>
            ©️ 2026 Swagne. All rights reserved.
=======
          <p
            style={{
              textAlign: "center",
              fontSize: "11px",
              color: c.muted,
              fontWeight: 300,
              marginTop: "24px",
            }}
          >
            © 2026 Swagne. All rights reserved.
>>>>>>> fix:last
          </p>
        </div>
      </div>
    </>
  );
}