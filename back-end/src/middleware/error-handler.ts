import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../Errors';

const ErrorHandler = (err:ApiError, req:Request, res:Response, next:NextFunction) => {
    const errStatus = err.statusCode || 500;
    const errMsg = err.message || 'Something went wrong';
    res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMsg,
        stack: process.env.NODE_ENV === 'development' ? err.stack : {}
    })
}

export default ErrorHandler