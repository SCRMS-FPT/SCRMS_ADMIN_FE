import API_CONFIG from "./apiPaths";
const { baseUrl, endpoints } = API_CONFIG.servicePackageManagement;

export async function getServicePackages() {
  const url = baseUrl + endpoints.list;
  const response = await fetch(url);
  return response.json();
}

export async function getServicePackageDetails(packageId) {
  const url = baseUrl + endpoints.details(packageId);
  const response = await fetch(url);
  return response.json();
}

export async function createServicePackage(packageData) {
  const url = baseUrl + endpoints.create;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(packageData),
  });
  return response.json();
}

export async function updateServicePackage(packageId, packageData) {
  const url = baseUrl + endpoints.update(packageId);
  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(packageData),
  });
  return response.json();
}

export async function deleteServicePackage(packageId) {
  const url = baseUrl + endpoints.delete(packageId);
  const response = await fetch(url, { method: "DELETE" });
  return response.json();
}
