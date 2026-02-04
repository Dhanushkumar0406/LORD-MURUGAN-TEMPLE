const BASE_URL = "";

function getToken() {
  return localStorage.getItem("authToken");
}

function withAuthHeaders(headers = {}) {
  const token = getToken();
  if (token) {
    return { ...headers, Authorization: `Bearer ${token}` };
  }
  return headers;
}

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: withAuthHeaders({ "Content-Type": "application/json" }),
    ...options
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.error || "Request failed";
    throw new Error(message);
  }
  return data;
}

export function loginUser(payload) {
  return request("/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function signupUser(payload) {
  return request("/signup", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function logoutUser() {
  return request("/logout", {
    method: "POST"
  });
}

export function fetchCitizen(citizenId) {
  return request(`/citizen/${citizenId}`);
}

export function createRegistration(payload) {
  return request("/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function fetchRegistrations(query = "") {
  const path = query ? `/registrations?${query}` : "/registrations";
  return request(path);
}

export function approveRegistration(payload) {
  return request("/approve", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function rejectRegistration(payload) {
  return request("/reject", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function updateRegistration(id, payload) {
  return request(`/registration/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

export function cancelRegistration(id) {
  return request(`/registration/${id}`, {
    method: "DELETE"
  });
}

export function fetchStats() {
  return request("/stats");
}

export function fetchAuditLogs(query = "") {
  const path = query ? `/audit-logs?${query}` : "/audit-logs";
  return request(path);
}
