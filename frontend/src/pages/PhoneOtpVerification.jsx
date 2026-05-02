import { useState } from "react";

export default function PhoneOtpVerification() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp) {
      setMessage("Please enter the OTP code");
      return;
    }

    setMessage("OTP submitted");
  };

  return (
    <div>
      <h1>Verify your phone</h1>

      <form onSubmit={handleVerify}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button type="submit">Verify</button>
      </form>

      <button type="button">Resend OTP</button>

      {message && <p>{message}</p>}
    </div>
  );
}
