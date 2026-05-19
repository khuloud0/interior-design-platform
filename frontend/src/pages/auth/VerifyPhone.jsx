import React, { useState, useRef, useEffect } from "react";
import { auth } from "../../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

export default function VerifyPhone() {
  const phone = localStorage.getItem("signupPhone") || "";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const inputsRef = useRef([]);

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

  useEffect(() => {
    if (phone) setTimeout(() => sendOTP(), 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );
    }
    return window.recaptchaVerifier;
  };

  const sendOTP = async () => {
    setMessage("");
    setIsError(false);
    if (!phone || !phone.startsWith("+9665")) {
      setMessage("Invalid phone number. Please go back and enter a valid Saudi number.");
      setIsError(true);
      return;
    }
    try {
      setLoading(true);
      const appVerifier = setupRecaptcha();
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);
      setCodeSent(true);
      setResendTimer(60);
      setMessage("Verification code sent to your phone.");
      setIsError(false);
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to send verification code.");
      setIsError(true);
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    setMessage("");
    const code = otp.join("");
    if (!confirmationResult) {
      setMessage("Please wait until the code is sent.");
      setIsError(true);
      return;
    }
    if (code.length < 6) {
      setMessage("Please enter the full 6-digit code.");
      setIsError(true);
      return;
    }
    try {
      setLoading(true);
      await confirmationResult.confirm(code);
      const pendingSignup = JSON.parse(localStorage.getItem("pendingSignup"));

if (!pendingSignup) {
  setMessage("Signup data not found. Please sign up again.");
  setIsError(true);
  return;
}

const registerResponse = await fetch("http://127.0.0.1:5000/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    ...pendingSignup,
    phone_verified: true,
  }),
});

const registerData = await registerResponse.json();

if (!registerResponse.ok) {
  setMessage(registerData.error || "Registration failed.");
  setIsError(true);
  return;
}

await fetch("http://127.0.0.1:5000/auth/verify-phone", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    phone: pendingSignup.phone,
    verified: true,
  }),
});

const loginResponse = await fetch("http://127.0.0.1:5000/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: pendingSignup.email,
    password: pendingSignup.password,
  }),
});

const loginData = await loginResponse.json();

if (!loginResponse.ok) {
  setMessage(loginData.error || "Login failed after verification.");
  setIsError(true);
  return;
}

localStorage.setItem("token", loginData.token);
localStorage.setItem("user", JSON.stringify(loginData.user));
localStorage.setItem("phoneVerified", "true");

localStorage.removeItem("pendingSignup");
localStorage.removeItem("signupEmail");
localStorage.removeItem("signupPassword");
        setMessage("Phone verified successfully!");
        setIsError(false);
        setTimeout(() => {
      window.location.href = "/";
    }, 1500);
    } catch (err) {
      console.error(err);
      setMessage("Invalid code. Please try again.");
      setIsError(true);
      setOtp(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
    if (value && index === 5 && newOtp.every((d) => d !== "")) {
      setTimeout(() => verifyOTP(), 100);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputsRef.current[5]?.focus();
    }
  };

  const maskedPhone = phone
    ? phone.replace(/(\+\d{3})\d{4}(\d{4})/, "$1****$2")
    : "";

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Jost:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />
      <style>{`
        .otp-input {
          width: 44px;
          height: 52px;
          text-align: center;
          font-size: 20px;
          font-weight: 500;
          font-family: 'Jost', sans-serif;
          color: #3D3128;
          background: #FAF7F4;
          border: 1.5px solid #E0D5C8;
          border-radius: 10px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          caret-color: #8C7B6B;
        }
        .otp-input:focus {
          border-color: #8C7B6B !important;
          box-shadow: 0 0 0 3px rgba(140,123,107,0.12);
          background: #fff !important;
        }
        .otp-input.filled { border-color: #D4C4B0; background: #fff; }
        .otp-input:disabled { opacity: 0.4; cursor: not-allowed; }
        .submit-btn:not(:disabled):hover { background: #8C7B6B !important; }
        .resend-btn:not(:disabled):hover { text-decoration: underline; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeIn 0.4s ease; }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%     { transform: translateX(-6px); }
          60%     { transform: translateX(6px); }
        }
        .shake { animation: shake 0.35s ease; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: c.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Jost', sans-serif",
          padding: "24px",
        }}
      >
        <div
          className="fade-in"
          style={{
            background: c.card,
            border: `1px solid ${c.border}`,
            borderRadius: "14px",
            padding: "40px 36px 32px",
            width: "100%",
            maxWidth: "400px",
            boxShadow: "0 2px 28px rgba(61,49,40,0.08)",
          }}
        >
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "26px",
              fontWeight: 300,
              color: c.dark,
              marginBottom: "4px",
              letterSpacing: "0.01em",
            }}
          >
            Verify Your Phone
          </h2>
          <p
            style={{
              fontSize: "12px",
              color: c.muted,
              fontWeight: 300,
              lineHeight: 1.8,
              marginBottom: "6px",
            }}
          >
            {codeSent ? (
              <>
                A verification code was sent to{" "}
                <span
                  style={{
                    color: c.stone,
                    fontWeight: 500,
                    direction: "ltr",
                    display: "inline-block",
                  }}
                >
                  {maskedPhone}
                </span>
              </>
            ) : (
              "Sending a verification code to your phone..."
            )}
          </p>

          <div
            style={{
              width: "28px",
              height: "1px",
              background: c.sand,
              marginBottom: "28px",
            }}
          />

          {/* OTP Inputs */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              marginBottom: "28px",
              direction: "ltr",
            }}
            onPaste={handlePaste}
          >
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`otp-input${digit ? " filled" : ""}${isError ? " shake" : ""}`}
                disabled={loading || !codeSent}
                autoFocus={i === 0 && codeSent}
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            type="button"
            className="submit-btn"
            onClick={verifyOTP}
            disabled={loading || !codeSent || otp.join("").length < 6}
            style={{
              width: "100%",
              padding: "12px",
              border: "none",
              borderRadius: "9px",
              background: c.dark,
              color: c.sand,
              fontSize: "11px",
              fontWeight: 500,
              fontFamily: "'Jost', sans-serif",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              cursor:
                loading || !codeSent || otp.join("").length < 6
                  ? "not-allowed"
                  : "pointer",
              opacity:
                loading || !codeSent || otp.join("").length < 6 ? 0.45 : 1,
              transition: "background 0.2s, opacity 0.2s",
            }}
          >
            {loading ? "Verifying..." : "Confirm"}
          </button>

          {/* Message */}
          {message && (
            <div
              className="fade-in"
              style={{
                marginTop: "14px",
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

          {/* Resend */}
          <p
            style={{
              marginTop: "18px",
              textAlign: "center",
              fontSize: "12px",
              color: c.muted,
              fontWeight: 300,
            }}
          >
            {resendTimer > 0 ? (
              <>
                Resend code in{" "}
                <span style={{ color: c.stone, fontWeight: 500 }}>
                  {resendTimer}s
                </span>
              </>
            ) : (
              <>
                Didn't receive the code?{" "}
                <button
                  className="resend-btn"
                  onClick={sendOTP}
                  disabled={loading}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    color: c.stone,
                    fontWeight: 500,
                    fontSize: "12px",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontFamily: "'Jost', sans-serif",
                  }}
                >
                  Resend
                </button>
              </>
            )}
          </p>

          {/* Sign in link */}
          <p
            style={{
              marginTop: "10px",
              textAlign: "center",
              fontSize: "12px",
              color: c.muted,
              fontWeight: 300,
            }}
          >
            Already have an account?{" "}
            <a
              href="/login"
              style={{
                color: c.stone,
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              Sign in
            </a>
          </p>

          <div id="recaptcha-container" />
        </div>
      </div>
    </>
  );
}
