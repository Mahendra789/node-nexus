import { API_BASE_URL } from "../config";

const getAuthToken = () => {
  try {
    return window.localStorage.getItem("authToken");
  } catch (_) {
    return null;
  }
};

const apiRequest = async (
  path,
  {
    method = "GET",
    body,
    includeAuth = true,
    headers = {},
    autoRedirectOnError = true,
  } = {}
) => {
  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured.");
  }

  const finalHeaders = { ...headers };
  if (body !== undefined && !(body instanceof FormData)) {
    finalHeaders["Content-Type"] =
      finalHeaders["Content-Type"] || "application/json";
  }
  if (includeAuth) {
    const token = getAuthToken();
    if (token) finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body:
      body instanceof FormData
        ? body
        : body !== undefined
        ? JSON.stringify(body)
        : undefined,
  });

  if (!response.ok) {
    // Redirect by status code
    if (autoRedirectOnError) {
      if (response.status === 401 || response.status === 403) {
        try {
          window.location.replace("/error/not-allowed");
        } catch (_) {}
      } else if (response.status === 404) {
        try {
          window.location.replace("/error/not-found");
        } catch (_) {}
      }
    }

    let message = `Request failed with status ${response.status}`;
    try {
      const data = await response.json();
      if (data && data.message) message = data.message;
    } catch (_) {
      try {
        const text = await response.text();
        if (text && !text.trim().startsWith("<")) message = text;
      } catch (_) {
        /* ignore */
      }
    }
    throw new Error(message);
  }

  // Try to parse JSON; fall back to empty object
  try {
    return await response.json();
  } catch (_) {
    return {};
  }
};

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
