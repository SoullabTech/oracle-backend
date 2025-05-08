// src/utils/errors.ts
export class AppError extends Error {
    message;
    statusCode;
    code;
    constructor(message, statusCode = 500, code) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.code = code;
        this.name = "AppError";
        Error.captureStackTrace(this, this.constructor);
    }
}
export class ValidationError extends AppError {
    constructor(message) {
        super(message, 400, "VALIDATION_ERROR");
        this.name = "ValidationError";
    }
}
export class AuthenticationError extends AppError {
    constructor(message = "Authentication required") {
        super(message, 401, "AUTHENTICATION_ERROR");
        this.name = "AuthenticationError";
    }
}
export class AuthorizationError extends AppError {
    constructor(message = "Access denied") {
        super(message, 403, "AUTHORIZATION_ERROR");
        this.name = "AuthorizationError";
    }
}
export class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, 404, "NOT_FOUND");
        this.name = "NotFoundError";
    }
}
