/**
 * Vietnam Provinces API Example in ReactJS
 *
 * This file provides a set of API functions for interacting with the Vietnam Provinces API.
 * It includes fetching provinces, districts, and wards, as well as searching functionalities.
 */

const BASE_URL = "https://provinces.open-api.vn";

/**
 * Fetch data from a given URL and return JSON response.
 * @param {string} url - The API endpoint URL.
 * @returns {Promise<Object>} - The fetched JSON data.
 */
async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Show all divisions with an optional depth.
 * @param {number} depth - The depth of administrative levels (1, 2, or 3).
 * @returns {Promise<Object>} - The fetched divisions data.
 */
export async function showAllDivisions(depth = 1) {
  return fetchData(`${BASE_URL}/api/?depth=${depth}`);
}

/**
 * List all provinces.
 * @returns {Promise<Object>} - The fetched provinces data.
 */
export async function listProvinces() {
  return fetchData(`${BASE_URL}/api/p/`);
}

/**
 * Search provinces by query.
 * @param {string} query - The search term.
 * @returns {Promise<Object>} - The fetched search results.
 */
export async function searchProvinces(query) {
  return fetchData(`${BASE_URL}/api/p/search/?q=${encodeURIComponent(query)}`);
}

/**
 * Get province details by code.
 * @param {string} code - The province code.
 * @param {number} depth - The depth of administrative levels (1, 2, or 3).
 * @returns {Promise<Object>} - The fetched province data.
 */
export async function getProvince(code, depth = 1) {
  return fetchData(`${BASE_URL}/api/p/${code}?depth=${depth}`);
}

/**
 * List all districts.
 * @returns {Promise<Object>} - The fetched districts data.
 */
export async function listDistricts() {
  return fetchData(`${BASE_URL}/api/d/`);
}

/**
 * Search districts by query.
 * @param {string} query - The search term.
 * @param {string} [provinceCode] - Optional province code for filtering.
 * @returns {Promise<Object>} - The fetched search results.
 */
export async function searchDistricts(query, provinceCode = null) {
  let url = `${BASE_URL}/api/d/search/?q=${encodeURIComponent(query)}`;
  if (provinceCode) {
    url += `&p=${provinceCode}`;
  }
  return fetchData(url);
}

/**
 * Get district details by code.
 * @param {string} code - The district code.
 * @param {number} depth - The depth of administrative levels (1 or 2).
 * @returns {Promise<Object>} - The fetched district data.
 */
export async function getDistrict(code, depth = 1) {
  return fetchData(`${BASE_URL}/api/d/${code}?depth=${depth}`);
}

/**
 * List all wards.
 * @returns {Promise<Object>} - The fetched wards data.
 */
export async function listWards() {
  return fetchData(`${BASE_URL}/api/w/`);
}

/**
 * Search wards by query.
 * @param {string} query - The search term.
 * @param {string} [districtCode] - Optional district code for filtering.
 * @param {string} [provinceCode] - Optional province code if district code isn’t provided.
 * @returns {Promise<Object>} - The fetched search results.
 */
export async function searchWards(
  query,
  districtCode = null,
  provinceCode = null
) {
  let url = `${BASE_URL}/api/w/search/?q=${encodeURIComponent(query)}`;
  if (districtCode) {
    url += `&d=${districtCode}`;
  } else if (provinceCode) {
    url += `&p=${provinceCode}`;
  }
  return fetchData(url);
}

/**
 * Get ward details by code.
 * @param {string} code - The ward code.
 * @returns {Promise<Object>} - The fetched ward data.
 */
export async function getWard(code) {
  return fetchData(`${BASE_URL}/api/w/${code}`);
}

/**
 * Get API version information.
 * @returns {Promise<Object>} - The fetched API version data.
 */
export async function getVersion() {
  return fetchData(`${BASE_URL}/api/version`);
}
