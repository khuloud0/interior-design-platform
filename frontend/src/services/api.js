const API_BASE_URL = "http://localhost:5000/api";

// Generic request handler
async function request(endpoint, options) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
}

// Login
export async function loginUser(userData) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

// Signup
export async function signupUser(userData) {
  return request("/auth/signup", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

// Submit Design Request
export async function submitDesignRequest(requestData) {
  return request("/design-requests", {
    method: "POST",
    body: JSON.stringify(requestData),
  });
}
