import { apiRequest } from "./apiRequest";

export const getAllProducts = () =>
  apiRequest("/product/all", { includeAuth: false });

export const deleteProductById = (productId, options = {}) =>
  apiRequest(`/product/${productId}`, {
    method: "DELETE",
    includeAuth: false,
    autoRedirectOnError: false,
    successToastMessage: "Product deleted successfully!",
    ...options,
  });

export const getProductStats = () =>
  apiRequest("/product/stats", { includeAuth: false });
