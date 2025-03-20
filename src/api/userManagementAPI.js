import API_CONFIG from "./apiPaths";
const { baseUrl, endpoints } = API_CONFIG.userManagement;
/**
 * @typedef {Object} ProfileData
 * @property {string} UserId - The unique identifier of the user (UUID format).
 * @property {string} FirstName - The first name of the user.
 * @property {string} LastName - The last name of the user.
 * @property {string} Phone - The phone number of the user.
 * @property {string} BirthDate - The birth date of the user (ISO 8601 format).
 * @property {string} Gender - The gender of the user (e.g., "Male", "Female", "Other").
 * @property {string} [SelfIntroduction] - A short introduction about the user (optional).
 */

/**
 * Fetches the list of users.
 * @returns {Promise<Object[]>} A promise that resolves to an array of user objects.
 * @throws {Error} If the network request fails.
 */
export async function getUsers() {
  const url = baseUrl + endpoints.list;
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
 * Updates a user's profile information.
 * @param {string} userId - The unique identifier of the user.
 * @param {ProfileData} profileData - The updated profile data.
 * @returns {Promise<Object>} A promise that resolves to the updated user object.
 * @throws {Error} If userId is missing, profileData is invalid, or the network request fails.
 */
export async function updateUser(userId, profileData) {
  if (!userId) {
    throw new Error("User ID is required to update user profile.");
  }
  validateProfileData(profileData);

  const token = localStorage.getItem("authToken");
  const url = baseUrl + endpoints.updateStatus(userId);
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "bearer " + token,
    },
    body: JSON.stringify(profileData),
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
 * Assigns roles to a user.
 * @param {string} userId - The unique identifier of the user.
 * @param {string[]} roleData - An array of role names to assign.
 * @returns {Promise<Object>} A promise that resolves to the updated user object with assigned roles.
 * @throws {Error} If userId is missing, roleData is invalid, or the network request fails.
 */
export async function assignUserRoles(userId, roleData) {
  if (!userId) {
    throw new Error("User ID is required to assign roles.");
  }
  if (
    !Array.isArray(roleData) ||
    roleData.length === 0 ||
    roleData.some((role) => typeof role !== "string" || !role.trim())
  ) {
    throw new Error(
      "Role data must be a non-empty array of valid role strings."
    );
  }

  const token = localStorage.getItem("authToken");
  const url = baseUrl + endpoints.assignRoles;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "bearer " + token,
    },
    body: JSON.stringify({ userId, roles: roleData }),
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
 * Deletes a user.
 * @param {string} userId - The unique identifier of the user.
 * @returns {Promise<Object>} A promise that resolves to a confirmation response.
 * @throws {Error} If the userId is missing or the network request fails.
 */
export async function deleteUser(userId) {
  if (!userId) {
    throw new Error("User ID is required to delete user.");
  }

  const token = localStorage.getItem("authToken");
  const url = baseUrl + endpoints.deleteUser(userId);
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
 * Validates profile data before updating.
 * @param {ProfileData} profileData - The profile data to validate.
 * @throws {Error} If any required field is missing or invalid.
 */
function validateProfileData(profileData) {
  if (!profileData.UserId) {
    throw new Error("User ID is required.");
  }
  if (
    !profileData.FirstName ||
    typeof profileData.FirstName !== "string" ||
    !profileData.FirstName.trim()
  ) {
    throw new Error("First name is required and must be a valid string.");
  }
  if (
    !profileData.LastName ||
    typeof profileData.LastName !== "string" ||
    !profileData.LastName.trim()
  ) {
    throw new Error("Last name is required and must be a valid string.");
  }
  if (
    !profileData.Phone ||
    typeof profileData.Phone !== "string" ||
    !/^\+?[0-9\s-]+$/.test(profileData.Phone)
  ) {
    throw new Error("Phone number is required and must be a valid format.");
  }
  if (!profileData.BirthDate || isNaN(Date.parse(profileData.BirthDate))) {
    throw new Error(
      "Birth date is required and must be a valid ISO 8601 date string."
    );
  }
  if (
    !profileData.Gender ||
    typeof profileData.Gender !== "string" ||
    !profileData.Gender.trim()
  ) {
    throw new Error("Gender is required and must be a valid string.");
  }
  if (
    profileData.SelfIntroduction !== null &&
    typeof profileData.SelfIntroduction !== "string"
  ) {
    throw new Error("Self Introduction must be a string if provided.");
  }
}
