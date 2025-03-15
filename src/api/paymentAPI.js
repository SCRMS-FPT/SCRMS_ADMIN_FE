import API_CONFIG from "./apiPaths";
const { baseUrl, endpoints } = API_CONFIG.paymentManagement;

export async function getTransactions() {
  const url = baseUrl + endpoints.transactions;
  const response = await fetch(url);
  return response.json();
}

export async function getTransactionDetails(transactionId) {
  const url = baseUrl + endpoints.transactionDetails(transactionId);
  const response = await fetch(url);
  return response.json();
}

export async function refundPayment(refundData) {
  const url = baseUrl + endpoints.refund;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(refundData),
  });
  return response.json();
}
