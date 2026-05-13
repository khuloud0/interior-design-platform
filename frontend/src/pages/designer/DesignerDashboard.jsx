import React, { useEffect, useState } from "react";

const DesignerRequestsDashboard = () => {
  const [requests, setRequests] = useState([
    {
      id: 15,
      client_name: "Ahmed",
      space_type: "Villa",
      style: "Modern",
      budget: 40000,
      status: "pending",
    },
  ]);

  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:5000/designer/available-requests";

  useEffect(() => {
    const fetchAvailableRequests = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Failed to load available requests");
          return;
        }

        if (Array.isArray(data)) {
          setRequests(data);
        }
      } catch (error) {
        setError("Unable to connect to backend. Showing sample request.");
        console.error("Network error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableRequests();
  }, []);

  const filteredRequests =
    selectedStatus === "all"
      ? requests
      : requests.filter((request) => request.status === selectedStatus);

  const getStatusLabel = (status) => {
    if (!status) return "Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getStatusClasses = (status) => {
    if (status === "pending") {
      return "bg-orange-50 text-orange-700 border-orange-200";
    }

    if (status === "accepted") {
      return "bg-green-50 text-green-700 border-green-200";
    }

    if (status === "completed") {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }

    if (status === "rejected") {
      return "bg-red-50 text-red-700 border-red-200";
    }

    return "bg-gray-50 text-gray-700 border-gray-200";
  };

  const formatBudget = (budget) => {
    if (budget === undefined || budget === null || budget === "") {
      return "N/A";
    }

    return `${Number(budget).toLocaleString()} SAR`;
  };

  return (
    <div className="min-h-screen bg-[#F6F1EA] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="mb-2 text-xs uppercase tracking-[0.25em] text-[#8C7B68]">
            Designer Dashboard
          </p>

          <h1
            className="text-4xl font-light text-[#2C221A] md:text-5xl"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Available Requests
          </h1>

          <p
            className="mt-3 max-w-2xl text-sm leading-6 text-[#8C7B68]"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            View available client design requests and review request details.
          </p>
        </div>

        <div className="mb-8 rounded-2xl border border-[#E2D8CE] bg-[#FFFDF9] p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#2C221A]">
                Filter by Status
              </h2>
              <p className="mt-1 text-sm text-[#8C7B68]">
                Showing {filteredRequests.length} request
                {filteredRequests.length === 1 ? "" : "s"}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {["all", "pending", "accepted", "completed", "rejected"].map(
                (status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setSelectedStatus(status)}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                      selectedStatus === status
                        ? "border-[#2C221A] bg-[#2C221A] text-white"
                        : "border-[#E2D8CE] bg-white text-[#2C221A] hover:border-[#2C221A]"
                    }`}
                  >
                    {status === "all" ? "All" : getStatusLabel(status)}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {loading && (
          <div className="mb-6 rounded-lg border border-[#E2D8CE] bg-white px-4 py-3 text-sm text-[#8C7B68]">
            Loading available requests...
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
            {error}
          </div>
        )}

        <div className="hidden overflow-hidden rounded-2xl border border-[#E2D8CE] bg-[#FFFDF9] md:block">
          <table className="w-full border-collapse">
            <thead className="bg-[#EFE7DE]">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#2C221A]">
                  Request
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#2C221A]">
                  Client
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#2C221A]">
                  Space Type
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#2C221A]">
                  Style
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#2C221A]">
                  Budget
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#2C221A]">
                  Status
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#2C221A]">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request.id} className="border-t border-[#E2D8CE]">
                  <td className="px-5 py-4 text-sm font-semibold text-[#2C221A]">
                    Request #{request.id}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#3D3128]">
                    {request.client_name}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#3D3128]">
                    {request.space_type}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#3D3128]">
                    {request.style}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#3D3128]">
                    {formatBudget(request.budget)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${getStatusClasses(
                        request.status
                      )}`}
                    >
                      {getStatusLabel(request.status)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => setSelectedRequest(request)}
                      className="rounded-lg bg-[#2C221A] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#3D3128]"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid gap-4 md:hidden">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className="rounded-2xl border border-[#E2D8CE] bg-[#FFFDF9] p-5"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#8C7B68]">
                    Request #{request.id}
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-[#2C221A]">
                    Request #{request.id}
                  </h3>
                </div>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${getStatusClasses(
                    request.status
                  )}`}
                >
                  {getStatusLabel(request.status)}
                </span>
              </div>

              <div className="grid gap-3 text-sm text-[#3D3128]">
                <p>
                  <span className="font-semibold text-[#2C221A]">Client:</span>{" "}
                  {request.client_name}
                </p>
                <p>
                  <span className="font-semibold text-[#2C221A]">
                    Space Type:
                  </span>{" "}
                  {request.space_type}
                </p>
                <p>
                  <span className="font-semibold text-[#2C221A]">Style:</span>{" "}
                  {request.style}
                </p>
                <p>
                  <span className="font-semibold text-[#2C221A]">Budget:</span>{" "}
                  {formatBudget(request.budget)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRequest(request)}
                className="mt-5 w-full rounded-lg bg-[#2C221A] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#3D3128]"
              >
                View Details
              </button>
            </div>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <div className="rounded-2xl border border-[#E2D8CE] bg-[#FFFDF9] px-6 py-12 text-center text-sm text-[#8C7B68]">
            No available requests found.
          </div>
        )}

        {selectedRequest && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5"
            onClick={() => setSelectedRequest(null)}
          >
            <div
              className="w-full max-w-md rounded-2xl bg-[#FFFDF9] p-6 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#8C7B68]">
                    Request Details
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold text-[#2C221A]">
                    Request #{selectedRequest.id}
                  </h2>
                </div>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${getStatusClasses(
                    selectedRequest.status
                  )}`}
                >
                  {getStatusLabel(selectedRequest.status)}
                </span>
              </div>

              <div className="space-y-3 text-sm text-[#3D3128]">
                <p>
                  <span className="font-semibold text-[#2C221A]">Client:</span>{" "}
                  {selectedRequest.client_name}
                </p>
                <p>
                  <span className="font-semibold text-[#2C221A]">
                    Space Type:
                  </span>{" "}
                  {selectedRequest.space_type}
                </p>
                <p>
                  <span className="font-semibold text-[#2C221A]">Style:</span>{" "}
                  {selectedRequest.style}
                </p>
                <p>
                  <span className="font-semibold text-[#2C221A]">Budget:</span>{" "}
                  {formatBudget(selectedRequest.budget)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="mt-6 w-full rounded-lg bg-[#2C221A] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#3D3128]"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesignerRequestsDashboard;
