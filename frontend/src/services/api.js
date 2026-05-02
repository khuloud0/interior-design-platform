const API_BASE_URL = "http://localhost:5000/api";

async function request(endpoint, options = {}) {
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

export function loginUser(userData) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export function signupUser(userData) {
  return request("/auth/signup", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export function submitDesignRequest(requestData) {
  return request("/design-requests", {
    method: "POST",
    body: JSON.stringify(requestData),
  });
}

export function verifyPhone(phone) {
  return fetch("http://127.0.0.1:8000/auth/verify-phone", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone,
      verified: true,
    }),
  }).then(async (response) => {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Phone verification failed");
    }

    return data;
  });
}
