import API_CONFIG from "./apiPaths";
const { baseUrl, endpoints } = API_CONFIG.systemSettings;

//TODO: I don't know what should be done in here

export async function getSystemSettings() {
  const url = baseUrl + endpoints.view;
  const response = await fetch(url);
  return response.json();
}

export async function updateSystemSettings(settingsData) {
  const url = baseUrl + endpoints.update;
  const response = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settingsData),
  });
  return response.json();
}
