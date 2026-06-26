import { apiClient } from "../../lib/apiClient";

export function getCart() {
  return apiClient.get("/cart");
}

export function addCartItem(payload) {
  return apiClient.post("/cart/items", payload);
}

export function updateCartItem(itemId, payload) {
  return apiClient.put(`/cart/items/${itemId}`, payload);
}

export function removeCartItem(itemId) {
  return apiClient.delete(`/cart/items/${itemId}`);
}