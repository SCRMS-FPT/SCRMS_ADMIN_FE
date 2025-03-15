import API_CONFIG from "./apiPaths";
const { baseUrl, endpoints } = API_CONFIG.userManagement;

export async function getUsersByRole(role) {
  const url = baseUrl + endpoints.list(role);
  const response = await fetch(url);
  return response.json();
}

export async function updateUserStatus(userId, statusData) {
  const url = baseUrl + endpoints.updateStatus(userId);
  const response = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(statusData),
  });
  return response.json();
}

export async function assignUserRoles(roleData) {
  const url = baseUrl + endpoints.assignRoles;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(roleData),
  });
  return response.json();
}

export async function deleteUser(userId) {
  const url = baseUrl + endpoints.deleteUser(userId);
  const response = await fetch(url, { method: "DELETE" });
  return response.json();
}
