// eslint-disable-next-line max-classes-per-file
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}
class CastError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CastError';
    this.statusCode = 400;
  }
}
class DocumentNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DocumentNotFoundError';
    this.statusCode = 404;
  }
}
class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = 401;
  }
}
class CreateUserError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CreateUserError';
    this.statusCode = 409;
  }
}

module.exports = {
  ValidationError, CastError, DocumentNotFoundError, AuthError, CreateUserError,
};
