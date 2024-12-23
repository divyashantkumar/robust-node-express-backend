import CustomError from "./customeError.js";


class AuthorizationError extends CustomError {
    constructor(message) {
        this.errorCode = 401;
        this.errorType = 'UNAUTHORIZED';
        super(message);
    }

    serializeError() {
        return [
            {
                errorCode: this.errorCode,
                errorType: this.errorType,
                message: this.message
            }
        ];
    }
}

export default AuthorizationError;