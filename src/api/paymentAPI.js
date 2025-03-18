import API_CONFIG from "./apiPaths";
const { baseUrl, endpoints } = API_CONFIG.paymentManagement;
const token = localStorage.getItem("authToken");

/**
 * Fetches the list of transactions from the API.
 * @returns {Promise<Object>} A promise that resolves to the JSON response containing the list of transactions.
 * @throws {Error} If the network request fails or the response is not OK.
 */
export async function getTransactions() {
  const url = baseUrl + endpoints.transactions;
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
 * Fetches the details of a specific transaction.
 * @param {string} transactionId - The unique identifier of the transaction.
 * @returns {Promise<Object>} A promise that resolves to the JSON response containing transaction details.
 * @throws {Error} If the network request fails, the response is not OK, or the transactionId is missing.
 */
export async function getTransactionDetails(transactionId) {
  if (!transactionId) {
    throw new Error("Transaction ID is required to fetch transaction details.");
  }

  const url = baseUrl + endpoints.transactionDetails(transactionId);
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

// TODO: Didn't exist
// export async function refundPayment(refundData) {
//   const url = baseUrl + endpoints.refund;
//   const response = await fetch(url, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(refundData),
//   });
//   return response.json();
// }
