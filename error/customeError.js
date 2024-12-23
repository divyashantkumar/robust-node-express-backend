class CustomError extends Error {
    errorCode; //number
    errorType; //string
    constructor(message) {
        super(message);
    }

    serializeError() {
        return [
            {
                errorCode: 500,
                errorType: 'INTERNAL_SERVER_ERROR',
                message: 'Internal Server Error',
                property: null
            }
        ]; // message:string, property:string
    }
}

export default CustomError