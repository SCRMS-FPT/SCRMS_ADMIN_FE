import { API_CONFIG, BASE_URL } from "./apiPaths";

const { endpoints } = API_CONFIG.sportManagement;

/**
 * Fetches the list of sports from the API.
 * @async
 * @function fetchSports
 * @returns {Promise<Object>} A promise that resolves to the list of sports.
 * @throws {Object} Throws an error object containing the status and message if the request fails.
 */
export const fetchSports = async () => {
  const url = `${BASE_URL}${endpoints.list}`;

  try {
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
  } catch (error) {
    console.error("Error fetching sports:", error);
    throw error;
  }
};

/**
 * Fetches a specific sport by ID.
 * @async
 * @function fetchSportById
 * @param {string} sportId - The ID of the sport to retrieve.
 * @returns {Promise<Object>} A promise that resolves to the sport details.
 * @throws {Object} Throws an error object if the request fails.
 */
export const fetchSportById = async (sportId) => {
  const url = `${BASE_URL}${endpoints.detail(sportId)}`;

  try {
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
  } catch (error) {
    console.error("Error fetching sport by ID:", error);
    throw error;
  }
};

/**
 * Creates a new sport.
 * @async
 * @function createSport
 * @param {Object} sportData - The data for the new sport.
 * @returns {Promise<Object>} A promise that resolves to the created sport.
 * @throws {Object} Throws an error object if the request fails.
 */
export const createSport = async (sportData) => {
  const url = `${BASE_URL}${endpoints.create()}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(sportData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message: error.message || response.statusText,
      };
    }

    return response.json();
  } catch (error) {
    console.error("Error creating sport:", error);
    throw error;
  }
};

/**
 * Updates an existing sport.
 * @async
 * @function updateSport
 * @param {Object} sportData - The updated sport data.
 * @returns {Promise<Object>} A promise that resolves to the updated sport.
 * @throws {Object} Throws an error object if the request fails.
 */
export const updateSport = async (sportData) => {
  const url = `${BASE_URL}${endpoints.update()}`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(sportData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message: error.message || response.statusText,
      };
    }

    return response.json();
  } catch (error) {
    console.error("Error updating sport:", error);
    throw error;
  }
};

/**
 * Deletes a sport by ID.
 * @async
 * @function deleteSport
 * @param {string} sportId - The ID of the sport to delete.
 * @returns {Promise<Object>} A promise that resolves to the delete response.
 * @throws {Object} Throws an error object if the request fails.
 */
export const deleteSport = async (sportId) => {
  const url = `${BASE_URL}${endpoints.delete(sportId)}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
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
  } catch (error) {
    console.error("Error deleting sport:", error);
    throw error;
  }
};
