import API_CONFIG from "./apiPaths";
const { baseUrl, endpoints } = API_CONFIG.courtManagement;

export async function getCourts() {
  const url = baseUrl + endpoints.list;
  const response = await fetch(url);
  return response.json();
}

export async function getCourtDetails(courtId) {
  const url = baseUrl + endpoints.details(courtId);
  const response = await fetch(url);
  return response.json();
}

export async function updateCourt(courtId, courtData) {
  const url = baseUrl + endpoints.update(courtId);
  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(courtData),
  });
  return response.json();
}

export async function deleteCourt(courtId) {
  const url = baseUrl + endpoints.delete(courtId);
  const response = await fetch(url, { method: "DELETE" });
  return response.json();
}
