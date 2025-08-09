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

export const getSalesAndOrders = () =>
  apiRequest("/product/sales-and-orders", {
    includeAuth: false,
    autoRedirectOnError: false,
  });

export const getSuppliersAndCategories = () =>
  apiRequest("/product/suppliers-and-categories", {
    includeAuth: false,
    autoRedirectOnError: false,
  });

export const getAllSuppliers = () =>
  apiRequest("/product/suppliers", {
    includeAuth: false,
    autoRedirectOnError: false,
  });

export const getAllCategories = () =>
  apiRequest("/product/categories", {
    includeAuth: false,
    autoRedirectOnError: false,
  });
