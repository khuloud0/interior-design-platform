import React, { useState } from "react";
import axios from "axios";

export default function VerifyEmail() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Email is required");
      setIsError(true);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await axios.post("http://127.0.0.1:5000/auth/verify-email", {
        email,
        verified: true,
      });

      setMessage("Email verified successfully ✅");
      setIsError(false);

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.error || "Email verification failed ❌");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f5f5f5",
      fontFamily: "'Inter', sans-serif",
    },
    card: {
      backgroundColor: "#fff",
      padding: "40px",
      borderRadius: "16px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      width: "100%",
      maxWidth: "420px",
    },
    title: {
      fontSize: "24px",
      fontWeight: "700",
      marginBottom: "8px",
      textAlign: "center",
      color: "#1a1a1a",
    },
    subtitle: {
      fontSize: "14px",
      textAlign: "center",
      color: "#888",
      marginBottom: "24px",
      lineHeight: "1.6",
    },
    fieldWrapper: {
      marginBottom: "16px",
    },
    label: {
      display: "block",
      marginBottom: "6px",
      fontSize: "14px",
      fontWeight: "600",
      color: "#333",
    },
    input: {
      width: "100%",
      padding: "10px 14px",
      borderRadius: "8px",
      border: "1px solid #ddd",
      fontSize: "14px",
      outline: "none",
      boxSizing: "border-box",
    },
    button: {
      width: "100%",
      padding: "12px",
      borderRadius: "8px",
      border: "none",
      backgroundColor: "#4f46e5",
      color: "#fff",
      fontSize: "16px",
      fontWeight: "600",
      cursor: loading ? "not-allowed" : "pointer",
      opacity: loading ? 0.7 : 1,
      marginTop: "8px",
    },
    message: {
      marginTop: "16px",
      padding: "12px",
      borderRadius: "8px",
      textAlign: "center",
      fontSize: "14px",
      fontWeight: "500",
      backgroundColor: isError ? "#fdecea" : "#eafaf1",
      color: isError ? "#e74c3c" : "#2ecc71",
    },
    footer: {
      marginTop: "16px",
      textAlign: "center",
      fontSize: "13px",
      color: "#666",
    },
    link: {
      color: "#4f46e5",
      fontWeight: "600",
      textDecoration: "none",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Verify Email</h2>
        <p style={styles.subtitle}>
          Enter your email to complete the verification step.
        </p>

        <form onSubmit={handleVerify}>
          <div style={styles.fieldWrapper}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="e.g. user@test.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        {message && <div style={styles.message}>{message}</div>}

        <p style={styles.footer}>
          Already verified?{" "}
          <a href="/login" style={styles.link}>
            Login
          </a>
        </p>
      </div>
    </div>
  );
}