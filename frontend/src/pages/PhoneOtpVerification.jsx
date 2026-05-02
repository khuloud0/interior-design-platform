import { useState } from "react";

export default function PhoneOtpVerification() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp) {
      setMessage("❌ Please enter the OTP code");
      return;
    }

    if (otp.length < 6) {
      setMessage("❌ OTP must be 6 digits");
      return;
    }

    setMessage("✅ OTP submitted");
  };

  const handleResend = () => {
    setOtp("");
    setMessage("✅ OTP resent");
  };

  return (
    <div>
      <h1>Verify your phone</h1>

      <form onSubmit={handleVerify}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          maxLength={6}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            setOtp(value);
          }}
        />

        <button type="submit">Verify</button>
      </form>

      <button type="button" onClick={handleResend}>
        Resend OTP
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}
