
class CustomError extends Error {

    constructor(message = "Something went wrong", statusCode, errors = [], stack = "") {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.success = false;
        this.errors = errors;
        this.data = null;

        // Only attach stack trace if one is provided
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
    serializeErrors() {
        return {
            message: this.message,
            errors: this.errors,
            statusCode: this.statusCode,
            success: this.success,
            data: this.data
        }
    };
}

export default CustomError;
