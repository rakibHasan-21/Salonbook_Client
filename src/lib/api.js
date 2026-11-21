const STATUS_MESSAGES = {
  400: "The request could not be processed. Please check your input.",
  401: "Your session has expired. Please sign in again.",
  403: "You do not have permission to perform this action.",
  404: "The requested resource was not found.",
  409: "This action conflicts with an existing record.",
  422: "Please check the form and try again.",
  429: "Too many requests. Please wait a moment and try again.",
  500: "The server encountered an error. Please try again.",
  502: "The server is temporarily unavailable. Please try again.",
  503: "The service is temporarily unavailable. Please try again.",
  504: "The server took too long to respond. Please try again.",
};

export class ApiError extends Error {
  constructor(message, options = {}) {
    super(message || "Something went wrong. Please try again.");
    this.name = "ApiError";
    this.status = options.status ?? 0;
    this.code = options.code ?? "";
    this.details = options.details ?? null;
  }
}

export const getStatusMessage = (status) =>
  STATUS_MESSAGES[status] || `Request failed with status ${status}.`;

export const getErrorMessage = (
  error,
  fallback = "Something went wrong. Please try again."
) => {
  if (!error) return fallback;
  if (typeof error === "string") return error;
  return error.message || fallback;
};

export const isUnauthorizedError = (error) => error?.status === 401;
export const isForbiddenError = (error) => error?.status === 403;
export const isConflictError = (error) => error?.status === 409;
export const isBlockedError = (error) =>
  error?.status === 403 && /blocked/i.test(error?.message || "");

export const readResponseBody = async (response) => {
  const text = await response.text();

  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export const apiFetch = async (url, options = {}) => {
  if (!url) {
    throw new ApiError("API is not configured.", { code: "CONFIG" });
  }

  const { timeout = 15000, ...fetchOptions } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: fetchOptions.signal ?? controller.signal,
    });

    const body = await readResponseBody(response);

    if (!response.ok) {
      const bodyMessage =
        body && typeof body === "object"
          ? body.message || body.error || ""
          : "";

      throw new ApiError(bodyMessage || getStatusMessage(response.status), {
        status: response.status,
        code: body && typeof body === "object" ? body.code || "" : "",
        details: body,
      });
    }

    return body;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error?.name === "AbortError") {
      throw new ApiError("The request timed out. Please try again.", {
        code: "TIMEOUT",
      });
    }

    throw new ApiError(
      "Unable to reach the server. Please check your connection and try again.",
      { code: "NETWORK" }
    );
  } finally {
    clearTimeout(timer);
  }
};
