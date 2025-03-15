import API_CONFIG from "./apiPaths";
const { baseUrl, endpoints } = API_CONFIG.reviewReportManagement;

export async function getReviewReports() {
  const url = baseUrl + endpoints.reviewReports;
  const response = await fetch(url);
  return response.json();
}

export async function deleteReview(reviewId) {
  const url = baseUrl + endpoints.deleteReview(reviewId);
  const response = await fetch(url, { method: "DELETE" });
  return response.json();
}

export async function getReports() {
  const url = baseUrl + endpoints.listReports;
  const response = await fetch(url);
  return response.json();
}
