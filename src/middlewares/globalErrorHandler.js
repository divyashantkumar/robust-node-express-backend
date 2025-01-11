import CustomError from "../errors/custome.error.js";
import { Error as MongooseError } from "mongoose";

// Handle specific MongoDB errors
export const handleMongoError = (err) => {
    if (err.name === 'CastError') {
        return new CustomError(`Invalid ${err.path}: ${err.value}`, 400);
    }
    if (err.code === 11000) {
        const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
        return new CustomError(`Duplicate field value: ${value}. Please use another value!`, 400);
    }
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(el => el.message);
        return new CustomError(`Invalid input data. ${errors.join('. ')}`, 400);
    }
    return err;
};

export const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const errorMessage = err.message || 'Something went wrong!';

    if (err instanceof CustomError) {
        return res
            .status(statusCode)
            .json(
                new CustomError(errorMessage, statusCode, err.errors)
            );
    } else if (err instanceof MongooseError) {
        return res
            .status(statusCode)
            .json(
                handleMongoError(err)
            );
    }

    return res.status(500).json({ status: 'error', message: 'Something went wrong! Internal Server Error' });
};



// Handle JWT errors
export const handleJWTError = () =>
    new CustomError('Invalid token. Please log in again!', 401);

export const handleJWTExpiredError = () =>
    new CustomError('Your token has expired! Please log in again.', 401);

