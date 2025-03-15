import API_CONFIG from "./apiPaths";

const { baseUrl, endpoints } = API_CONFIG.dashboard;

export async function getDashboardStats() {
  const response = await fetch(baseUrl + endpoints.stats);
  return response.json();
}

export async function getRevenueReport() {
  const response = await fetch(baseUrl + endpoints.revenue);
  return response.json();
}

export async function getRecentTransactions() {
  const response = await fetch(baseUrl + endpoints.transactions);
  return response.json();
}
