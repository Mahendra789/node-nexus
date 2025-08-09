import { API_BASE_URL } from "../config";

// Global notifier for API-level snackbars/toasts
let apiNotifier = null;
export const setApiNotifier = (fn) => {
  apiNotifier = typeof fn === "function" ? fn : null;
};

const notify = (message, { color = "success", timeoutMs = 3000 } = {}) => {
  try {
    if (apiNotifier) apiNotifier({ message, color, timeoutMs });
  } catch (_) {
    /* noop */
  }
};

// Global confirmer for API-level confirmation modals
let apiConfirmer = null;
export const setApiConfirmer = (fn) => {
  apiConfirmer = typeof fn === "function" ? fn : null;
};

const confirmViaUI = async ({
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
} = {}) => {
  if (!apiConfirmer) return true;
  try {
    const result = await apiConfirmer({ message, confirmText, cancelText });
    return !!result;
  } catch (_) {
    return false;
  }
};

const getAuthToken = () => {
  try {
    return window.localStorage.getItem("authToken");
  } catch (_) {
    return null;
  }
};

export const apiRequest = async (
  path,
  {
    method = "GET",
    body,
    includeAuth = true,
    headers = {},
    autoRedirectOnError = true,
    // Snackbar options
    successToastMessage,
    successToastColor = "success",
    errorToast = true,
    // Confirmation dialog options
    confirmDialog,
    treatCancelAsError = false,
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

  // If a confirmation is requested, resolve it first
  if (confirmDialog) {
    const allowed = await confirmViaUI(confirmDialog);
    if (!allowed) {
      const cancelError = new Error("Request cancelled by user");
      // mark as cancelled; callers can ignore
      cancelError.__cancelled = true;
      if (treatCancelAsError && errorToast)
        notify("Action cancelled", { color: "warning" });
      throw cancelError;
    }
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
    if (errorToast) notify(message, { color: "danger" });
    throw new Error(message);
  }

  try {
    const data = await response.json();
    if (successToastMessage) {
      notify(successToastMessage, { color: successToastColor });
    }
    return data;
  } catch (_) {
    if (successToastMessage) {
      notify(successToastMessage, { color: successToastColor });
    }
    return {};
  }
};
