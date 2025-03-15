import API_CONFIG from "./apiPaths";

const { baseUrl, endpoints } = API_CONFIG.login;

/**
 * Sends a login request.
 * @param {Object} loginData - Object with attribute like { Email, Password }
 * @returns {Promise<Object>} - The JSON response from the API.
 */
export async function login(loginData) {
  const response = await fetch(`${baseUrl}${endpoints.login}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Login failed");
  }

  return response.json();
}
