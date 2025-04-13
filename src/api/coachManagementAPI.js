import { API_CONFIG, BASE_URL } from "./apiPaths";
const { endpoints } = API_CONFIG.coachManagement;

/**
 *
 * @param {*} name
 * @param {*} minPrice
 * @param {*} maxPrice
 * @param {*} sportId
 * @param {*} page
 * @param {*} limit
 * @returns the pagination result of coaches list
 */
export async function getCoaches(
  name,
  minPrice,
  maxPrice,
  sportId,
  page,
  limit
) {
  const token = localStorage.getItem("authToken");
  const url =
    BASE_URL + endpoints.list(name, sportId, minPrice, maxPrice, page, limit);
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

export async function deleteCoaches(coachId) {
  const token = localStorage.getItem("authToken");
  const url = BASE_URL + endpoints.delete(coachId);
  const response = await fetch(url, {
    method: "DELETE",
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

export async function updateCoach(coachId, data) {
  const token = localStorage.getItem("authToken");
  const url = BASE_URL + endpoints.update(coachId);
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: "bearer " + token,
    },
    body: data,
  });
  if (!response.ok) {
    throw {
      status: response.status,
      message: response.statusText,
    };
  }
  return response.json();
}
