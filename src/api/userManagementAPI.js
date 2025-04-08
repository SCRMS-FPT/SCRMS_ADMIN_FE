import { API_CONFIG, BASE_URL } from "./apiPaths";
const { endpoints } = API_CONFIG.userManagement;
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
 * @param {string} [searchQuery] - The search term for filtering users.
 * @param {string} [role] - The role to filter users by.
 * @param {number} page - The page index for pagination.
 * @param {number} pageSize - The number of users per page.
 * @returns {Promise<Object[]>} A promise that resolves to an array of user objects.
 * @throws {Error} If the network request fails.
 */
export async function getUsers(searchQuery, role, page, pageSize) {
  const url = `${BASE_URL}${endpoints.list(searchQuery, role, page, pageSize)}`;
  const token = localStorage.getItem("authToken");

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
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
 * Fetches the list of users.
 * @param {string} id - The unique identifier of the user.
 * @returns {ProfileData} A object that contains information.
 * @throws {Error} If the network request fails.
 */
export async function getUser(id) {
  const url = BASE_URL + endpoints.getDetail(id);
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
    throw new Error("ID người dùng là bắt buộc.");
  }
  validateProfileData(profileData);
  // Convert to variable that postgresql accept
  profileData.BirthDate = new Date(
    profileData.BirthDate + "T00:00:00Z"
  ).toISOString();

  const token = localStorage.getItem("authToken");
  const url = BASE_URL + endpoints.updateProfile(userId);
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
  const url = BASE_URL + endpoints.assignRoles;
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
  if (response.status === 204) {
    return null;
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
  const url = BASE_URL + endpoints.deleteUser(userId);
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
  if (
    !profileData.FirstName ||
    typeof profileData.FirstName !== "string" ||
    !profileData.FirstName.trim()
  ) {
    throw new Error("Tên là bắt buộc và phải là một chuỗi hợp lệ.");
  }
  if (
    !profileData.LastName ||
    typeof profileData.LastName !== "string" ||
    !profileData.LastName.trim()
  ) {
    throw new Error("Họ là bắt buộc và phải là một chuỗi hợp lệ.");
  }
  if (
    !profileData.Phone ||
    typeof profileData.Phone !== "string" ||
    !/^\+?[0-9\s-]+$/.test(profileData.Phone)
  ) {
    throw new Error("Số điện thoại là bắt buộc và phải có định dạng hợp lệ.");
  }
  if (!profileData.BirthDate || isNaN(Date.parse(profileData.BirthDate))) {
    throw new Error(
      "Ngày sinh là bắt buộc và phải là một chuỗi ngày hợp lệ theo chuẩn ISO 8601."
    );
  }
  if (
    !profileData.Gender ||
    typeof profileData.Gender !== "string" ||
    !profileData.Gender.trim()
  ) {
    throw new Error("Giới tính là bắt buộc và phải là một chuỗi hợp lệ.");
  }
  if (
    profileData.SelfIntroduction !== null &&
    typeof profileData.SelfIntroduction !== "string"
  ) {
    throw new Error("Giới thiệu bản thân phải là một chuỗi nếu được cung cấp.");
  }
}
