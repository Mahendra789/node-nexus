import { apiRequest } from "./apiRequest";

export const getAllProducts = () => apiRequest("/product/all");

export const deleteProductById = (productId, options = {}) =>
  apiRequest(`/product/${productId}`, {
    method: "DELETE",
    successToastMessage: "Product deleted successfully!",
    ...options,
  });

export const getProductStats = () => apiRequest("/product/stats");

export const getSalesAndOrders = () => apiRequest("/product/sales-and-orders");

export const getSuppliersAndCategories = () =>
  apiRequest("/product/suppliers-and-categories");

export const getAllSuppliers = () => apiRequest("/product/suppliers");

export const getAllCategories = () => apiRequest("/product/categories");
