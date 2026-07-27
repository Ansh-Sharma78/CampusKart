import { apiClient } from "../../lib/apiClient";

export function initiatePayment(payload) {
  return apiClient.post("/payments/initiate", payload);
}

export function getPaymentStatus(paymentId) {
  return apiClient.get(`/payments/${paymentId}/status`);
}

export function confirmPayment(payload) {
  return apiClient.post("/payments/confirm", payload);
}