import { useState } from "react";
import { verifyPhone } from "../services/api";

export default function PhoneOtpVerification() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!phone) {
      setMessage("Please enter your phone number");
      return;
    }

    // TODO: Integrate Firebase to send OTP
    setMessage("OTP sent to your phone");
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!phone || !otp) {
      setMessage("Please enter phone number and OTP");
      return;
    }

    if (otp.length < 6) {
      setMessage("OTP must be 6 digits");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      // TODO: Replace with actual Firebase OTP verification result
      const otpVerifiedByFirebase = true;

      if (!otpVerifiedByFirebase) {
        setMessage("Invalid OTP");
        return;
      }

      const data = await verifyPhone(phone);

      setMessage(data.message || "Phone verified successfully");
    } catch (error) {
      setMessage(error.message || "Unable to verify phone right now");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Phone Verification</h1>

      <div>
        <input
          type="tel"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={isLoading}
        />

        <button type="button" onClick={handleSendOtp} disabled={isLoading}>
          Send OTP
        </button>
      </div>

      <form onSubmit={handleVerify}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          maxLength={6}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          disabled={isLoading}
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
