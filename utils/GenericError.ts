interface GenericErrorOptions extends ErrorOptions {
  type: string;
}

export class GenericError extends Error {
  options: GenericErrorOptions = { type: "Error" };

  constructor(message: string, options?: GenericErrorOptions) {
    super(message, options);
    this.name = options?.type ?? "Error";
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
