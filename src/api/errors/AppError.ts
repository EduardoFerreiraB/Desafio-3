// src/shared/errors/AppError.ts
class AppError extends Error {
    public readonly message: string;
    public readonly statusCode: number;

    constructor(message: string, statusCode = 400) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

class ValidationError extends AppError {
    public details: { field: string; message: string }[];

    constructor(message: string, details: { field: string; message: string }[]) {
        super(message, 400);
        this.details = details;
    }
}

class BusinessError extends AppError {
    public code: number;
    public status: string;

    constructor(message: string) {
        super(message, 400);
        this.code = 400;
        this.status = 'Bad Request';
    }
}

class IdError extends AppError {
    public code: number;
    public status: string;

    constructor(message: string) {
        super(message, 404);
        this.code = 404;
        this.status = 'Bad Request';
    }
}

class UnauthorizedError extends AppError {
    public code: number;
    public status: string;

    constructor(message: string) {
        super(message, 403);
        this.code = 403;
        this.status = 'Unauthorized';
    }
}

export { AppError, ValidationError, BusinessError, IdError, UnauthorizedError};
