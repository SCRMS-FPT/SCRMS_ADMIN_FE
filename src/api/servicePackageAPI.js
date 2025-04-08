import { API_CONFIG, BASE_URL } from "./apiPaths";
const { endpoints } = API_CONFIG.servicePackageManagement;

/**
 * @typedef {Object} ServicePackage
 * @property {string} Id - The unique identifier of the service package (UUID format).
 * @property {string} Name - The name of the service package.
 * @property {string} Description - A brief description of the service package.
 * @property {number} Price - The cost of the package (must be a positive decimal).
 * @property {number} DurationDays - The validity period of the package in days (must be a positive integer).
 * @property {string} AssociatedRole - The role associated with this package.
 * @property {string} CreatedAt - The timestamp when the package was created (ISO 8601 format).
 * @property {string} Status - The status of the package (e.g., "Active", "Inactive").
 */

/**
 * Fetches the list of service packages.
 * @returns {Promise<ServicePackage[]>} A promise that resolves to an array of service packages.
 * @throws {Error} If the network request fails.
 */
export async function getServicePackages() {
  const url = BASE_URL + endpoints.list;
  const token = localStorage.getItem("authToken");
  const response = await fetch(url, {
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
 * Fetches details of a specific service package.
 * @param {string} packageId - The unique identifier of the service package.
 * @returns {Promise<ServicePackage>} A promise that resolves to the service package details.
 * @throws {Error} If the packageId is missing or the network request fails.
 */
export async function getServicePackageDetails(packageId) {
  if (!packageId) {
    throw new Error("Package ID is required to fetch service package details.");
  }

  const url = BASE_URL + endpoints.details(packageId);
  const token = localStorage.getItem("authToken");
  const response = await fetch(url, {
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
 * Creates a new service package.
 * @param {Omit<ServicePackage, "Id" | "CreatedAt">} packageData - The service package data to be created (without ID and CreatedAt).
 * @returns {Promise<ServicePackage>} A promise that resolves to the created service package.
 * @throws {Error} If the packageData is invalid or the network request fails.
 */
export async function createServicePackage(packageData) {
  validateServicePackage(packageData, true);

  const url = BASE_URL + endpoints.create;
  const token = localStorage.getItem("authToken");
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "bearer " + token,
    },
    body: JSON.stringify(packageData),
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
 * Updates an existing service package.
 * @param {string} packageId - The unique identifier of the service package.
 * @param {Omit<ServicePackage, "CreatedAt">} packageData - The updated service package data.
 * @returns {Promise<ServicePackage>} A promise that resolves to the updated service package.
 * @throws {Error} If the packageId is missing, packageData is invalid, or the network request fails.
 */
export async function updateServicePackage(packageId, packageData) {
  if (!packageId) {
    throw new Error("Package ID is required to update service package.");
  }
  validateServicePackage(packageData);

  const url = BASE_URL + endpoints.update(packageId);
  const token = localStorage.getItem("authToken");
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "bearer " + token,
    },
    body: JSON.stringify(packageData),
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
 * Deletes a service package.
 * @param {string} packageId - The unique identifier of the service package.
 * @returns {Promise<Object>} A promise that resolves to a confirmation response.
 * @throws {Error} If the packageId is missing or the network request fails.
 */
export async function deleteServicePackage(packageId) {
  if (!packageId) {
    throw new Error("Package ID is required to delete service package.");
  }

  const url = BASE_URL + endpoints.delete(packageId);
  const token = localStorage.getItem("authToken");
  const response = await fetch(url, {
    method: "DELETE",
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
 * Validates service package data.
 * @param {Partial<ServicePackage>} packageData - The service package data to validate.
 * @param {boolean} [isCreating=false] - Whether the package is being created (ID not required).
 * @throws {Error} If required fields are missing or invalid.
 */
function validateServicePackage(packageData, isCreating = false) {
  if (!isCreating && !packageData.Id) {
    throw new Error("Package ID is required for update operations.");
  }
  if (
    !packageData.Name ||
    typeof packageData.Name !== "string" ||
    packageData.Name.trim() === ""
  ) {
    throw new Error("Package Name is required and must be a non-empty string.");
  }
  if (
    !packageData.Description ||
    typeof packageData.Description !== "string" ||
    packageData.Description.trim() === ""
  ) {
    throw new Error(
      "Package Description is required and must be a non-empty string."
    );
  }
  if (
    packageData.Price == null ||
    typeof packageData.Price !== "number" ||
    packageData.Price < 0
  ) {
    throw new Error(
      "Package Price must be a valid number greater than or equal to 0."
    );
  }
  if (
    !Number.isInteger(packageData.DurationDays) ||
    packageData.DurationDays <= 0
  ) {
    throw new Error("Package DurationDays must be a positive integer.");
  }
  if (
    !packageData.AssociatedRole ||
    typeof packageData.AssociatedRole !== "string" ||
    packageData.AssociatedRole.trim() === ""
  ) {
    throw new Error("Package AssociatedRole is required and must be a string.");
  }
  if (
    !packageData.Status ||
    typeof packageData.Status !== "string" ||
    packageData.Status.trim() === ""
  ) {
    throw new Error("Package Status is required and must be a string.");
  }
}
