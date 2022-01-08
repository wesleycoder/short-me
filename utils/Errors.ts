type GenericErrorOptions = {
  name?: string;
  message?: string;
  type?: string;
};

export enum ErrorTypes {
  GenericError = "GenericError",
  RequestError = "RequestError",
}

export class GenericError extends Error {
  name: ErrorTypes | string = ErrorTypes.GenericError;
  type: ErrorTypes = ErrorTypes.GenericError;
  options: GenericErrorOptions = {};

  constructor(message: string, options: GenericErrorOptions = {}) {
    super(message);
    this.name = options?.type ?? ErrorTypes.GenericError;
    this.options = {
      ...this.options,
      ...options,
    };
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      ...(process.env.NODE_ENV === "development" && {
        ...this.options,
        stack: this.stack,
      }),
    };
  }
}

export class RequestError extends GenericError {
  type: ErrorTypes = ErrorTypes.RequestError;
  constructor(message: string, options: GenericErrorOptions = {}) {
    super(message, options);
  }
}
