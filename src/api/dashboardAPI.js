import { API_CONFIG, BASE_URL } from "@/api/apiPaths";

const { endpoints } = API_CONFIG.dashboard;

/**
 * Fetches user statistics
 *
 * @returns {Promise<Object>} - A promise resolving to the user statistics data.
 * @throws {Object} - An error object containing the HTTP status and message if the request fails.
 **/
export async function getIdentityStats() {
  const url = BASE_URL + endpoints.identityStats;
  const token = localStorage.getItem("authToken");
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: "bearer " + token,
      Accept: "application/json",
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
 * Fetches coach statistics for a given date range and grouping parameter.
 *
 * @param {Date} startDate - The start date for the statistics.
 * @param {Date} endDate - The end date for the statistics.
 * @param {string} groupBy - The grouping parameter (e.g., daily, weekly, monthly).
 * @returns {Promise<Object>} - A promise resolving to the coach statistics data.
 * @throws {Object} - An error object containing the HTTP status and message if the request fails.
 */
export async function getCoachStats(startDate, endDate, groupBy) {
  const url = BASE_URL + endpoints.coachStats(startDate, endDate, groupBy);
  const token = localStorage.getItem("authToken");

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
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
 * Fetches court statistics for a given date range.
 *
 * @param {Date} startDate - The start date for the statistics.
 * @param {Date} endDate - The end date for the statistics.
 * @returns {Promise<Object>} - A promise resolving to the court statistics data.
 * @throws {Object} - An error object containing the HTTP status and message if the request fails.
 */
export async function getCourtStats(startDate, endDate) {
  const url = BASE_URL + endpoints.courtStats(startDate, endDate);
  const token = localStorage.getItem("authToken");

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
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

export async function getPaymentStats(startDate, endDate) {
  const url = BASE_URL + endpoints.paymentStats(startDate, endDate);
  const token = localStorage.getItem("authToken");

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
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
