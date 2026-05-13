import React, { useState } from "react";

const RequestDetails = () => {
  const [formData, setFormData] = useState({
    space_type: "",
    style: "",
    budget: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const payload = {
      client_id: 5,
      designer_id: 2,
      space_type: formData.space_type,
      style: formData.style,
      budget: Number(formData.budget),
      description: formData.description,
    };

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/design-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid data provided");
        console.error("Error response:", data);
        return;
      }

      setMessage(data.message || "Design request created successfully");
      console.log("Success response:", data);

      setFormData({
        space_type: "",
        style: "",
        budget: "",
        description: "",
      });
    } catch (error) {
      setError("Something went wrong. Make sure the backend is running.");
      console.error("Network error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F1EA] px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-12 text-center">
          <h1
            className="mb-3 text-5xl font-light text-[#2C221A]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Create Design Request
          </h1>

          <p
            className="text-sm text-[#8C7B68]"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            Submit a new design request for a specific designer.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[#E2D8CE] bg-[#FFFDF9] p-8"
        >
          <div className="mb-6">
            <label
              htmlFor="space_type"
              className="mb-2 block text-xs uppercase tracking-wider text-[#2C221A]"
            >
              Space Type
            </label>

            <select
              id="space_type"
              name="space_type"
              value={formData.space_type}
              onChange={handleInputChange}
              required
              className="w-full rounded-lg border border-[#E2D8CE] bg-white px-4 py-3 text-[#2C221A] outline-none focus:border-[#2C221A]"
            >
              <option value="">Select Space Type</option>
              <option value="Majlis">Majlis</option>
              <option value="Villa">Villa</option>
              <option value="Apartment">Apartment</option>
              <option value="Office">Office</option>
            </select>
          </div>

          <div className="mb-6">
            <label
              htmlFor="style"
              className="mb-2 block text-xs uppercase tracking-wider text-[#2C221A]"
            >
              Style
            </label>

            <select
              id="style"
              name="style"
              value={formData.style}
              onChange={handleInputChange}
              required
              className="w-full rounded-lg border border-[#E2D8CE] bg-white px-4 py-3 text-[#2C221A] outline-none focus:border-[#2C221A]"
            >
              <option value="">Select Style</option>
              <option value="Luxury">Luxury</option>
              <option value="Modern">Modern</option>
              <option value="Minimalist">Minimalist</option>
              <option value="Classic">Classic</option>
            </select>
          </div>

          <div className="mb-6">
            <label
              htmlFor="budget"
              className="mb-2 block text-xs uppercase tracking-wider text-[#2C221A]"
            >
              Budget
            </label>

            <input
              id="budget"
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              required
              min="1"
              placeholder="25000"
              className="w-full rounded-lg border border-[#E2D8CE] bg-white px-4 py-3 text-[#2C221A] outline-none focus:border-[#2C221A]"
            />
          </div>

          <div className="mb-8">
            <label
              htmlFor="description"
              className="mb-2 block text-xs uppercase tracking-wider text-[#2C221A]"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="5"
              placeholder="Modern luxury majlis with warm tones"
              className="w-full rounded-lg border border-[#E2D8CE] bg-white px-4 py-3 text-[#2C221A] outline-none focus:border-[#2C221A]"
            />
          </div>

          {message && (
            <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#2C221A] px-6 py-3 text-sm uppercase tracking-wider text-white transition hover:bg-[#3D3128] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Design Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestDetails;