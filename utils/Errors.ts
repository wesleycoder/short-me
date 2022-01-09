type GenericErrorOptions = {
  name?: string;
  code?: number;
  message?: string;
  type?: string;
};

export enum ErrorTypesEnum {
  GenericError = "GenericError",
  RequestError = "RequestError",
}

type ErrorType = ErrorTypesEnum | string;

export class GenericError extends Error {
  name: ErrorType = ErrorTypesEnum.GenericError;
  options: GenericErrorOptions = {};
  code?: number = 0;

  constructor(
    message: Error | string,
    { name, code, ...options }: GenericErrorOptions = {}
  ) {
    super(message instanceof Error ? message.message : message);

    this.name = name ?? this.name;
    this.code = code ?? this.code;

    this.options = {
      ...this.options,
      name,
      code,
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
  name: ErrorType = ErrorTypesEnum.RequestError;
}

export class ErrorResponse {
  ok: boolean = false;
  error: GenericError | null;
  status?: number = 0;
  statusText?: string = "";

  constructor(
    error: GenericError | string | null,
    { status, statusText }: { status?: number; statusText?: string } = {}
  ) {
    this.error = typeof error === "string" ? new GenericError(error) : error;
    this.status = status ?? this.status;
    this.statusText = statusText ?? this.statusText;
  }
}
