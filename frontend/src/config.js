// Centralized frontend configuration
// API base URL resolution with sensible fallback in development

export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  (process.env.NODE_ENV !== "production" ? "http://localhost:8080" : "");

export const isApiConfigured = Boolean(API_BASE_URL);
