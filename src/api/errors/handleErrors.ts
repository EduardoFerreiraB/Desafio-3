import { Request, Response, NextFunction } from "express";
import { isCelebrateError } from "celebrate";
import { AppError, ValidationError } from "./AppError";

export function handleErrors(err: Error, req: Request, res: Response, next: NextFunction): Response {
    if (isCelebrateError(err)) {
        const validationErrors: any = {};
        err.details.forEach((detail, key) => {
            validationErrors[key] = detail.message;
        });
        return res.status(400).json({
            code: 400,
            status: "Bad Request",
            message: "Validation error",
            details: validationErrors
        });
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            code: err.statusCode,
            status: err.statusCode === 500 ? "Internal Server Error" : "Bad Request",
            message: err.message,
            details: err instanceof ValidationError ? err.details : undefined,
        });
    }

    return res.status(500).json({
        code: 500,
        status: "Internal Server Error",
        message: "Ocorreu um erro inesperado."
    });
}
