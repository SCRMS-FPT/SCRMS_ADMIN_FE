import API_CONFIG from "./apiPaths";
const { baseUrl, endpoints } = API_CONFIG.reviewReportManagement;
const token = localStorage.getItem("authToken");

/**
 * Fetches the list of review reports from the API.
 * @returns {Promise<Object>} A promise that resolves to the JSON response containing review reports.
 * @throws {Error} If the network request fails or the response is not OK.
 */
export async function getReviewReports() {
  const url = baseUrl + endpoints.reviewReports;
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
 * Deletes a specific review.
 * @param {string} reviewId - The unique identifier of the review to be deleted.
 * @returns {Promise<Object>} A promise that resolves to the JSON response confirming deletion.
 * @throws {Error} If the network request fails, the response is not OK, or the reviewId is missing.
 */
export async function deleteReview(reviewId) {
  if (!reviewId) {
    throw new Error("Review ID is required to delete a review.");
  }

  const url = baseUrl + endpoints.deleteReview(reviewId);
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
 * Fetches the list of reports from the API.
 * @returns {Promise<Object>} A promise that resolves to the JSON response containing reports.
 * @throws {Error} If the network request fails or the response is not OK.
 */
export async function getReports() {
  const url = baseUrl + endpoints.listReports;
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
