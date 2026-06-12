import { apiClient } from "../../lib/apiClient";

export function getProducts(category) {
  const params = category ? { category } : {};

  return apiClient.get("/products", { params });
}

export function getProductById(productId) {
  return apiClient.get(`/products/${productId}`);
}

export function getMyProducts() {
  return apiClient.get("/products/me");
}

export function createProduct(payload) {
  return apiClient.post("/products", payload);
}

export function updateProduct(productId, payload) {
  return apiClient.put(`/products/${productId}`, payload);
}

export function deleteProduct(productId) {
  return apiClient.delete(`/products/${productId}`);
}

export function uploadProductImage(productId, file) {
  const formData = new FormData();

  formData.append("file", file);

  return apiClient.post(`/products/${productId}/images`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}