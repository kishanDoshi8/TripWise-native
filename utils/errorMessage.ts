export const getErrorMessage = (error: unknown) => {
    error = error as Error;
    let errorMessage = "An unknown error occurred.";

    // If error is an instance of Error
    if (typeof error === "object" && error !== null && "response" in error) {
        const apiError = error as { response?: { data?: { message?: string, error?: string} } };
        errorMessage = apiError.response?.data?.error ?? apiError.response?.data?.message ?? errorMessage;
    }

    return errorMessage;
}