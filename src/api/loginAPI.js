import { API_CONFIG, BASE_URL } from "./apiPaths";

const { endpoints } = API_CONFIG.login;

/**
 * Sends a login request.
 * @param {Object} loginData - The credentials for login.
 * @param {string} loginData.Email - User's email address.
 * @param {string} loginData.Password - User's password.
 * @returns {Promise<Object>} - The JSON response from the API.
 * @throws {Error} If the network request fails or the response is not OK.
 */
export async function login(loginData) {
  const response = await fetch(`${BASE_URL}${endpoints.login}`, {
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
