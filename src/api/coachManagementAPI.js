import API_CONFIG from "./apiPaths";
const { baseUrl, endpoints } = API_CONFIG.coachManagement;

export async function getCoaches() {
  const url = baseUrl + endpoints.list;
  const response = await fetch(url);
  return response.json();
}

export async function getCoachDetails(coachId) {
  const url = baseUrl + endpoints.details(coachId);
  const response = await fetch(url);
  return response.json();
}
