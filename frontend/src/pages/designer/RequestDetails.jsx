import React, { useEffect, useState } from "react";

const RequestDetailsPage = () => {
  const [request, setRequest] = useState({
    id: 15,
    client_name: "Ahmed",
    space_type: "Villa",
    style: "Modern",
    budget: 40000,
    description: "Luxury modern villa",
    status: "pending",
    attachments: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const requestId = window.location.pathname.split("/").filter(Boolean).pop() || 15;
  const API_URL = `http://localhost:5000/design-requests/${requestId}`;

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Design request not found");
          return;
        }

        setRequest(data);
      } catch (error) {
        setError("Unable to connect to backend. Showing sample request.");
        console.error("Network error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestDetails();
  }, [API_URL]);

  const pageStyle = {
    minHeight: "100vh",
    backgroundColor: "#F6F1EA",
    padding: "48px 24px",
    fontFamily: "Arial, sans-serif",
  };

  const containerStyle = {
    maxWidth: "900px",
    margin: "0 auto",
  };

  const cardStyle = {
    backgroundColor: "#FFFDF9",
    border: "1px solid #E2D8CE",
    borderRadius: "18px",
    padding: "28px",
    marginBottom: "24px",
  };

  const labelStyle = {
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "1px",
    color: "#8C7B68",
    marginBottom: "8px",
    fontWeight: "600",
  };

  const valueStyle = {
    color: "#2C221A",
    fontSize: "16px",
    fontWeight: "600",
    margin: 0,
  };

  const statusStyle = {
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: "10px",
    backgroundColor: "#FFF3E0",
    color: "#E65100",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
  };

  const formatBudget = (budget) => {
    if (budget === undefined || budget === null || budget === "") {
      return "N/A";
    }

    return `${Number(budget).toLocaleString()} SAR`;
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <button
          type="button"
          onClick={() => window.history.back()}
          style={{
            marginBottom: "24px",
            border: "1px solid #E2D8CE",
            backgroundColor: "transparent",
            color: "#2C221A",
            borderRadius: "8px",
            padding: "10px 16px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          ← Back to Dashboard
        </button>

        <div style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "20px",
              alignItems: "flex-start",
            }}
          >
            <div>
              <p style={labelStyle}>Request Details</p>
              <h1
                style={{
                  color: "#2C221A",
                  fontSize: "42px",
                  fontWeight: "400",
                  margin: "0 0 10px 0",
                }}
              >
                Request #{request.id}
              </h1>
              <p style={{ color: "#8C7B68", margin: 0 }}>
                Detailed information for a specific design request.
              </p>
            </div>

            <span style={statusStyle}>{request.status}</span>
          </div>
        </div>

        {loading && (
          <div style={cardStyle}>
            <p style={{ color: "#8C7B68", margin: 0 }}>
              Loading request details...
            </p>
          </div>
        )}

        {error && (
          <div
            style={{
              border: "1px solid #F5D48B",
              backgroundColor: "#FFF8E1",
              color: "#8A5A00",
              borderRadius: "10px",
              padding: "14px 16px",
              marginBottom: "24px",
            }}
          >
            {error}
          </div>
        )}

        <div style={cardStyle}>
          <p style={labelStyle}>Client Name</p>
          <p style={valueStyle}>{request.client_name}</p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            marginBottom: "24px",
          }}
        >
          <div style={cardStyle}>
            <p style={labelStyle}>Space Type</p>
            <p style={valueStyle}>{request.space_type}</p>
          </div>

          <div style={cardStyle}>
            <p style={labelStyle}>Design Style</p>
            <p style={valueStyle}>{request.style}</p>
          </div>

          <div style={cardStyle}>
            <p style={labelStyle}>Budget</p>
            <p style={valueStyle}>{formatBudget(request.budget)}</p>
          </div>
        </div>

        <div style={cardStyle}>
          <p style={labelStyle}>Project Description</p>
          <p
            style={{
              color: "#3D3128",
              lineHeight: "1.7",
              margin: 0,
            }}
          >
            {request.description}
          </p>
        </div>

        <div style={cardStyle}>
          <p style={labelStyle}>Attachments</p>

          {request.attachments && request.attachments.length > 0 ? (
            <div>
              {request.attachments.map((attachment, index) => (
                <a
                  key={attachment.id || index}
                  href={attachment.url || "#"}
                  style={{
                    display: "block",
                    color: "#2C221A",
                    textDecoration: "none",
                    border: "1px solid #E2D8CE",
                    borderRadius: "10px",
                    padding: "12px 14px",
                    marginBottom: "10px",
                    backgroundColor: "#F6F1EA",
                  }}
                >
                  {attachment.name || `Attachment ${index + 1}`}
                </a>
              ))}
            </div>
          ) : (
            <p style={{ color: "#8C7B68", margin: 0 }}>
              No attachments available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsPage;