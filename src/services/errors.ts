export const createValidationError = (message: string): Error => {
  const error = new Error(message);
  error.name = "ValidationError";
  return error;
};

export const handleError = (
  error: Error
): { statusCode: number; message: string } => {
  if (error.name === "AppError" && (error as any).statusCode) {
    return {
      statusCode: (error as any).statusCode,
      message: error.message,
    };
  }

  if (error.name === "ValidationError") {
    return {
      statusCode: 400,
      message: error.message,
    };
  }

  console.error("Unexpected error:", error);

  return {
    statusCode: 500,
    message: "An unexpected error occurred. Please try again later.",
  };
};
