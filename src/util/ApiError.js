class ApiError extends Error {
    constructor(statusCode, error = [], stack = "", message = "Something Went Wrong.") {
        super(message);
        this.statusCode = statusCode;
        this.error = error;
        this.message = message;
        this.data = null;

        // generally in production environment Stack trace is not available
        if(stack) this.stack = stack;
        else Error.captureStackTrace(this, this.constructor);
    }
}


export { ApiError };
