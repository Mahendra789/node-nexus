import { API_BASE_URL } from "../config";

const ensureBaseUrl = () => {
  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured.");
  }
};

export const login = async (payload) => {
  ensureBaseUrl();
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    // Friendly defaults
    let errorMessage =
      response.status === 401
        ? "Invalid email or password."
        : response.status === 422
        ? "Email and password are required."
        : `Request failed with status ${response.status}`;
    // Try to extract a server-provided message
    try {
      const body = await response.json();
      if (body && body.message) errorMessage = body.message;
    } catch (e) {
      try {
        const text = await response.text();
        // Avoid bubbling raw HTML to users
        if (text && !text.trim().startsWith("<")) errorMessage = text;
      } catch (_) {
        /* ignore */
      }
    }
    throw new Error(errorMessage);
  }
  return response.json();
};

export const createUser = async (payload) => {
  ensureBaseUrl();
  const response = await fetch(`${API_BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }
  return response.json();
};

export const getUsers = async () => {
  ensureBaseUrl();
  const response = await fetch(`${API_BASE_URL}/user`);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }
  return response.json();
};

export const getFirstUser = async () => {
  const data = await getUsers();
  return Array.isArray(data) ? data[0] : data;
};

export const updateUser = async (userId, payload) => {
  ensureBaseUrl();
  const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }
  return response.json();
};
