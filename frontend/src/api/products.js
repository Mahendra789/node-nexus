import { apiRequest } from "./apiRequest";

export const getAllProducts = ({ page = 1, limit = 10 } = {}) =>
  apiRequest(
    `/product/all?page=${encodeURIComponent(page)}&limit=${encodeURIComponent(
      limit
    )}`
  );

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

export const getAllSuppliers = ({ page = 1, limit = 10 } = {}) =>
  apiRequest(
    `/product/suppliers?page=${encodeURIComponent(page)}&limit=${encodeURIComponent(
      limit
    )}`
  );

export const getAllCategories = ({ page = 1, limit = 10 } = {}) =>
  apiRequest(
    `/product/categories?page=${encodeURIComponent(page)}&limit=${encodeURIComponent(
      limit
    )}`
  );
