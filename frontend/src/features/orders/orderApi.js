import { apiClient } from "../../lib/apiClient";

export function placeOrder(payload) {
  return apiClient.post("/orders", payload);
}

export function getOrders() {
  return apiClient.get("/orders");
}

export function getOrder(orderId) {
  return apiClient.get(`/orders/${orderId}`);
}

export function cancelOrder(orderId) {
  return apiClient.post(`/orders/${orderId}/cancel`);
}