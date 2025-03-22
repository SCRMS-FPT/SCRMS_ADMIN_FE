import { API_CONFIG, BASE_URL } from "./apiPaths";

const { endpoints } = API_CONFIG.dashboard;
/**
 * Fetches dashboard statistics from the API.
 * @returns {Promise<Object>} A promise that resolves to the JSON response containing dashboard statistics.
 * @throws {Error} If the network request fails or the response is not OK.
 */
export async function getDashboardStats() {
  const token = localStorage.getItem("authToken");
  const response = await fetch(BASE_URL + endpoints.stats, {
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
 * Fetches the revenue report from the API.
 * @returns {Promise<Object>} A promise that resolves to the JSON response containing revenue data.
 * @throws {Error} If the network request fails or the response is not OK.
 */
export async function getRevenueReport() {
  const token = localStorage.getItem("authToken");
  const response = await fetch(BASE_URL + endpoints.revenue, {
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
 * Fetches the recent transactions from the API.
 * @returns {Promise<Object>} A promise that resolves to the JSON response containing recent transaction details.
 * @throws {Error} If the network request fails or the response is not OK.
 */
export async function getRecentTransactions() {
  const token = localStorage.getItem("authToken");
  const response = await fetch(BASE_URL + endpoints.transactions, {
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
