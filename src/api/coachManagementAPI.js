import { API_CONFIG, BASE_URL } from "./apiPaths";
const { endpoints } = API_CONFIG.coachManagement;

/**
 * Get the list of coach
 * @returns the list of coach
 */
export async function getCoaches() {
  const token = localStorage.getItem("authToken");
  const url = BASE_URL + endpoints.list;
  const response = await fetch(url, {
    headers: {
      Authorization: "bearer " + token,
    },
  });
  if (!response.ok) {
    throw {
      status: response.status,
      message: response.statusText,
    };
  }
  return response.json();
}

/**
 * Get the detail of coach by their's id
 * @param {String} coachId
 * @returns object coach
 */
export async function getCoachDetails(coachId) {
  const token = localStorage.getItem("authToken");
  const url = BASE_URL + endpoints.details(coachId);
  const response = await fetch(url, {
    headers: {
      Authorization: "bearer " + token,
    },
  });
  if (!response.ok) {
    throw {
      status: response.status,
      message: response.statusText,
    };
  }
  return response.json();
}
