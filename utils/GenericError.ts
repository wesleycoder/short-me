type GenericErrorOptions = {
  name?: string;
  message?: string;
  type?: string;
}

const DEFAULT_ERROR_NAME = "GenericError"

export class GenericError extends Error {
  options: GenericErrorOptions = { type: DEFAULT_ERROR_NAME };

  constructor(message: string, options: GenericErrorOptions = {}) {
    super(message);
    this.name = options?.type ?? DEFAULT_ERROR_NAME;
    this.options = {
      ...this.options,
      ...options,
    };
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      ...(process.env.NODE_ENV === "development" && { ...this.options, stack: this.stack }),
    };
  }
}
