import { useState } from "react";
import { signupUser } from "../../services/api";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "client",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.role
    ) {
      setError("All fields are required");
      setMessage("");
      return;
    }

    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const data = await signupUser(formData);

      console.log("Signup success:", data);
      setMessage(data.message || "Account created successfully ✅");
    } catch (error) {
      console.error("Signup error:", error);
      setError(error.message || "Signup failed");
      setMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <br />

        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <br />

        <div>
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            placeholder="Enter your phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <br />

        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <br />

        <div>
          <label>Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            disabled={isLoading}
          >
            <option value="client">Client</option>
            <option value="designer">Designer</option>
          </select>
        </div>

        <br />

        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}

export default Signup;
