import { API_CONFIG, BASE_URL } from "./apiPaths";
const { endpoints } = API_CONFIG.reviewReportManagement;

/**
 * Fetches the list of review reports from the API with optional filters.
 * @param {number} page - The page number for pagination.
 * @param {number|null} [limit=null] - The number of items per page. If null, the default server value is used.
 * @param {string|null} [subjectType=null] - The type of the subject to filter reviews. If null, all types are included.
 * @param {string|null} [subjectId=null] - The ID of the subject to filter reviews. If null, all subjects are included.
 * @returns {Promise<Object>} A promise that resolves to the JSON response containing review reports.
 * @throws {Error} If the network request fails or the response is not OK.
 */
export async function getReviews(
  page,
  limit = null,
  subjectType = null,
  subjectId = null
) {
  const url = new URL(BASE_URL + endpoints.listReviews);
  const token = localStorage.getItem("authToken");

  url.searchParams.append("page", page);
  url.searchParams.append("limit", limit);
  url.searchParams.append("subjectType", subjectType);
  url.searchParams.append("subjectId", subjectId);
  console.log(url);

  const response = await fetch(url.toString(), {
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

  const token = localStorage.getItem("authToken");
  const url = BASE_URL + endpoints.deleteReview(reviewId);
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
