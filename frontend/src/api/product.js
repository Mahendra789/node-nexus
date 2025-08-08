import { apiRequest } from "./apiRequest";

export const getAllProducts = () =>
  apiRequest("/product/all", { includeAuth: false });
