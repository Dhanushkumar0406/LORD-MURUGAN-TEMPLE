const BASE_URL = "https://aarupadi-ticket-booking-backend.onrender.com";

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
  const url = `${BASE_URL}${path}`;
  const method = options.method || "GET";
  console.debug(`[API] ${method} ${url}`);

  const { headers: optionHeaders, ...restOptions } = options;
  const response = await fetch(url, {
    ...restOptions,
    headers: withAuthHeaders({ "Content-Type": "application/json", ...optionHeaders }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.error || "Request failed";
    console.error(`[API] ${method} ${url} → ${response.status}`, data);
    throw new Error(message);
  }
  console.debug(`[API] ${method} ${url} → ${response.status}`, data);
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

export function fetchMyRegistrations() {
  return request("/my-registrations");
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

export function loginAdmin(payload) {
  return request("/api/admin/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function fetchMyTicket() {
  return request("/api/user/ticket");
}

export function fetchPendingUsers() {
  return request("/api/admin/pending-users").then((data) => data.users);
}

export function approveUser(userId) {
  return request(`/api/admin/approve/${userId}`, { method: "POST" });
}

export function rejectUser(userId) {
  return request(`/api/admin/reject/${userId}`, { method: "POST" });
}

export function createTicket(userId, payload) {
  return request(`/api/admin/ticket/${userId}`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function downloadTicketPdf(pdfUrl) {
  const response = await fetch(pdfUrl, {
    headers: withAuthHeaders()
  });
  if (!response.ok) throw new Error("Failed to download ticket PDF");
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "ticket.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
