export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(401, message);
    this.name = 'AuthenticationError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed') {
    super(400, message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(404, message);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists') {
    super(409, message);
    this.name = 'ConflictError';
  }
}
