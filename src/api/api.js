const BASE_URL = "";

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.error || "Request failed";
    throw new Error(message);
  }
  return data;
}

export function registerCitizen(payload) {
  return request("/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function fetchStatus(citizenId) {
  return request(`/status/${citizenId}`);
}

export function adminLogin(payload) {
  return request("/admin/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function fetchCitizens() {
  return request("/admin/citizens");
}

export function approveCitizen(citizenId) {
  return request(`/admin/approve/${citizenId}`, { method: "PUT" });
}

export function rejectCitizen(citizenId) {
  return request(`/admin/reject/${citizenId}`, { method: "PUT" });
}

export function scheduleTour(payload) {
  return request("/tour/schedule", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function fetchTours(citizenId) {
  return request(`/tour/${citizenId}`);
}
