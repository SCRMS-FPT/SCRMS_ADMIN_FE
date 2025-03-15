import API_CONFIG from "./apiPaths";

const { baseUrl, endpoints } = API_CONFIG.dashboard;
/**
 * Fetches dashboard statistics from the API.
 * @returns {Promise<Object>} A promise that resolves to the JSON response containing dashboard statistics.
 * @throws {Error} If the network request fails or the response is not OK.
 */
export async function getDashboardStats() {
  const response = await fetch(baseUrl + endpoints.stats);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Failed to fetch dashboard statistics."
    );
  }

  return response.json();
}

/**
 * Fetches the revenue report from the API.
 * @returns {Promise<Object>} A promise that resolves to the JSON response containing revenue data.
 * @throws {Error} If the network request fails or the response is not OK.
 */
export async function getRevenueReport() {
  const response = await fetch(baseUrl + endpoints.revenue);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch revenue report.");
  }

  return response.json();
}

/**
 * Fetches the recent transactions from the API.
 * @returns {Promise<Object>} A promise that resolves to the JSON response containing recent transaction details.
 * @throws {Error} If the network request fails or the response is not OK.
 */
export async function getRecentTransactions() {
  const response = await fetch(baseUrl + endpoints.transactions);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Failed to fetch recent transactions."
    );
  }

  return response.json();
}
