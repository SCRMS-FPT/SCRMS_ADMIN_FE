import { API_CONFIG, BASE_URL } from "./apiPaths";
const { endpoints } = API_CONFIG.sportCenterManagement;

/**
 * Fetch a paginated list of sport centers with optional filters.
 * @param {number} [page] - Page number (1-based index).
 * @param {number} [limit] - Number of items per page.
 * @param {string} [city] - Filter by city.
 * @param {string} [name] - Filter by name.
 * @returns {Promise<Object>} - The API response as JSON.
 */
export const fetchSportCenters = async (page, limit, city, name) => {
  const url = `${BASE_URL}${endpoints.list(page, limit, city, name)}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw {
      status: response.status,
      message: error.message || response.statusText,
    };
  }
  return response.json();
};

/**
 * Fetch details of a specific sport center by ID.
 * @param {string} id - Sport center ID.
 * @returns {Promise<Object>} - The API response as JSON.
 */
export const getSportCenterDetails = async (id) => {
  const url = `${BASE_URL}${endpoints.detail(id)}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw {
      status: response.status,
      message: error.message || response.statusText,
    };
  }
  return response.json();
};

/**
 * Create a new sport center.
 * @param {Object} sportCenterData - Data for creating a sport center.
 * @returns {Promise<Object>} - The API response as JSON.
 */
export const createSportCenter = async (sportCenterData) => {
  const url = `${BASE_URL}${endpoints.create}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(sportCenterData),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw {
      status: response.status,
      message: error.message || response.statusText,
    };
  }
  return response.json();
};

/**
 * Update an existing sport center.
 * @param {string} id - Sport center ID.
 * @param {Object} updatedData - Updated data for the sport center.
 * @returns {Promise<Object>} - The API response as JSON.
 */
export const updateSportCenter = async (id, updatedData) => {
  const url = `${BASE_URL}${endpoints.edit(id)}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(updatedData),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw {
      status: response.status,
      message: error.message || response.statusText,
    };
  }
  return response.json();
};

/**
 * Fetch all courts of a specific sport center.
 * @param {string} centerId - Sport center ID.
 * @returns {Promise<Object>} - The API response as JSON.
 */
export const getSportCenterCourts = async (centerId) => {
  const url = `${BASE_URL}${endpoints.getPersonalCourts(centerId)}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw {
      status: response.status,
      message: error.message || response.statusText,
    };
  }
  return response.json();
};
