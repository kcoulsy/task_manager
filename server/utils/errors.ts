import { HTTP_STATUS } from "~~/utils/constants";

export function notFoundError(message: string = "Resource not found") {
  return createError({
    statusCode: HTTP_STATUS.NOT_FOUND,
    statusMessage: message,
  });
}

export function badRequestError(message: string) {
  return createError({
    statusCode: HTTP_STATUS.BAD_REQUEST,
    statusMessage: message,
  });
}

export function unauthorizedError(message: string = "Unauthorized") {
  return createError({
    statusCode: HTTP_STATUS.UNAUTHORIZED,
    statusMessage: message,
  });
}

export function internalServerError(message: string = "Internal server error") {
  return createError({
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    statusMessage: message,
  });
}

export function handleServiceError(error: unknown): never {
  // Re-throw if it's already an H3 error (has statusCode)
  if (error && typeof error === "object" && "statusCode" in error) {
    throw error;
  }

  // Log the actual error for debugging (in production, use proper logging)
  console.error("Service error:", error);

  // Throw a generic internal server error
  throw internalServerError();
}
