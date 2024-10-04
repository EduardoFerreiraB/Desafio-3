// src/shared/errors/AppError.ts
class AppError extends Error {
    public readonly message: string;
    public readonly statusCode: number;

    constructor(message: string, statusCode = 400) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;

        // Manter o stack trace
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default AppError;
