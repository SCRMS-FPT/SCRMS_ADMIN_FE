import { API_CONFIG, BASE_URL } from "./apiPaths";
const { endpoints } = API_CONFIG.courtManagement;

/**
 * Fetches a paginated list of courts.
 * @param {string} sportCenterId - The sport center ID.
 * @param {string} sportId - The sport ID.
 * @param {string} courtType - The type of the court.
 * @returns {Promise<Object>} - The list of courts.
 */
export async function getCourts(sportCenterId, sportId, courtType) {
  const token = localStorage.getItem("authToken");
  const url = BASE_URL + endpoints.list(sportCenterId, sportId, courtType);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
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
 * Fetches court details.
 * @param {string} courtId - The court ID.
 * @returns {Promise<Object>} - The court details.
 */
export async function getCourtDetails(courtId) {
  const token = localStorage.getItem("authToken");
  const url = BASE_URL + endpoints.detail(courtId);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
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
 * Creates a new court.
 * @param {Object} courtData - The data for the new court.
 * @returns {Promise<Object>} - The created court response.
 */
export async function createCourt(courtData) {
  const token = localStorage.getItem("authToken");
  const url = BASE_URL + endpoints.create;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ court: courtData }),
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
 * Updates an existing court.
 * @param {string} courtId - The ID of the court to update.
 * @param {Object} courtData - The updated court data.
 * @returns {Promise<Object>} - The update response.
 */
export async function updateCourt(courtId, courtData) {
  const token = localStorage.getItem("authToken");
  const url = BASE_URL + endpoints.update(courtId);
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ court: courtData }),
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
 * Deletes a court.
 * @param {string} courtId - The ID of the court to delete.
 * @returns {Promise<Object>} - The delete response.
 */
export async function deleteCourt(courtId) {
  const token = localStorage.getItem("authToken");
  const url = BASE_URL + endpoints.delete(courtId);
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
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
 * Fetches court availability.
 * @param {string} courtId - The court ID.
 * @param {Date} startDate - The start date.
 * @param {Date} endDate - The end date.
 * @returns {Promise<Object>} - The availability response.
 */
export async function getCourtAvailability(courtId, startDate, endDate) {
  const token = localStorage.getItem("authToken");
  const url = BASE_URL + endpoints.getAvailable(courtId, startDate, endDate);
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
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
