import { useState } from "react";

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

      const response = await fetch("http://127.0.0.1:8000/auth/verify-phone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          verified: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Phone verification failed");
        return;
      }

      setMessage(data.message || "Phone verified successfully");
    } catch (error) {
      setMessage("Unable to verify phone right now");
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
        />

        <button type="button" onClick={handleSendOtp}>
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
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
