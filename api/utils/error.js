// Custom Error function to get the status and error message

export const errorHandler = (statusCode, message) => {
    const error = new Error();
    error.statusCode = statusCode;
    error.message = message
    return error;
}