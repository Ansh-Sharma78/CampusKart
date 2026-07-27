import { apiClient } from "../../lib/apiClient";

export function getAddresses() {
  return apiClient.get("/addresses");
}

export function createAddress(payload) {
  return apiClient.post("/addresses", payload);
}

export function updateAddress(addressId, payload) {
  return apiClient.put(`/addresses/${addressId}`, payload);
}

export function deleteAddress(addressId) {
  return apiClient.delete(`/addresses/${addressId}`);
}

export function setDefaultAddress(addressId) {
  return apiClient.post(`/addresses/${addressId}/default`);
}