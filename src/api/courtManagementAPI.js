import { API_CONFIG, BASE_URL } from "./apiPaths";
const { endpoints } = API_CONFIG.courtManagement;

export async function getCourts() {
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

export async function getCourtDetails(courtId) {
  const token = localStorage.getItem("authToken");
  const url = BASE_URL + endpoints.details(courtId);
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

export async function updateCourt(courtId, courtData) {
  const token = localStorage.getItem("authToken");
  const url = BASE_URL + endpoints.update(courtId);
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "bearer " + token,
    },
    body: JSON.stringify(courtData),
  });
  if (!response.ok) {
    throw {
      status: response.status,
      message: response.statusText,
    };
  }
  return response.json();
}

export async function deleteCourt(courtId) {
  const token = localStorage.getItem("authToken");
  const url = BASE_URL + endpoints.delete(courtId);
  const response = await fetch(url, {
    headers: {
      Authorization: "bearer " + token,
    },
    method: "DELETE",
  });
  if (!response.ok) {
    throw {
      status: response.status,
      message: response.statusText,
    };
  }
  return response.json();
}
