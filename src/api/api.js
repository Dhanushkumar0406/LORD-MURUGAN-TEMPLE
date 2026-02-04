const API_BASE = import.meta.env.VITE_API_URL || "";

function getAuthHeaders() {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const message =
      data?.error || data?.message || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}

export async function signupUser(payload) {
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginAdmin(payload) {
  return request("/api/admin/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function logoutUser() {
  return request("/api/auth/logout", { method: "POST" });
}

export async function fetchPendingUsers() {
  const data = await request("/api/admin/pending-users", {
    headers: getAuthHeaders(),
  });
  return data.users || [];
}

export async function approveUser(userId) {
  return request(`/api/admin/approve/${userId}`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
}

export async function rejectUser(userId) {
  return request(`/api/admin/reject/${userId}`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
}

export async function createTicket(userId, payload) {
  return request(`/api/admin/ticket/${userId}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
}

export async function fetchProfile() {
  return request("/api/user/profile", {
    headers: getAuthHeaders(),
  });
}

export async function fetchMyTicket() {
  return request("/api/user/ticket", {
    headers: getAuthHeaders(),
  });
}
