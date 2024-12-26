import CustomError from "../error/customeError.js";

/**
 * Global error handler middleware.
 * Handles errors and sends appropriate responses based on error type.
 * 
 * @param {Object} err - The error object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */

const globalErrorHandler = (err, req, res, next) => {
    // Log the error for debugging purposes
    console.log("globalErrorHandler : ", err);

    // Handle custom errors
    if (err instanceof CustomError) {
        res?.status(err?.errorCode).send({ errors: err.serializeError() });
        return;
    }

    // Handle Neo4j database errors
    if (err?.constructor?.name === "Neo4jError") {
        res?.status(500)?.send({
            errors: [{
                errorCode: 500,
                errorType: "Neo4j_DB_ERROR!",
                neo4jDBErrorCode: err?.code,
                message: err
            }]
        });
        return;
    } 
    
    // Handle Payload Too Large errors
    if (err?.code === 413) {
        res?.status(413)?.send({
            errors: [{
                errorCode: 413,
                errorType: "PAYLOAD_TOO_LARGE_ERROR!",
                message: err
            }]
        });
        return;
    }
    
    // Handle all other errors as internal server errors
    res?.status(500)?.send({
        errors: [{
            errorCode: 500,
            errorType: "INTERNAL_SERVER_ERROR!",
            message: "Something unexpected happend!"
        }]
    });
    
}

export default globalErrorHandler;