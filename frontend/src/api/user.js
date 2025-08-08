import { apiRequest } from "./apiRequest";

export const login = (payload) =>
  apiRequest("/auth/login", {
    method: "POST",
    body: payload,
    includeAuth: false,
    autoRedirectOnError: false,
  });

export const createUser = (payload) =>
  apiRequest("/auth/signup", { method: "POST", body: payload });

export const getUsers = () => apiRequest("/auth/user");

export const updateUser = (userId, payload) =>
  apiRequest(`/auth/user/${userId}`, { method: "PUT", body: payload });

export const getFirstUser = async () => {
  const data = await getUsers();
  return Array.isArray(data) ? data[0] : data;
};
