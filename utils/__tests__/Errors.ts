import { describe, it, expect } from "@jest/globals";
import {
  GenericError,
  ErrorTypesEnum,
  RequestError,
  ErrorResponse,
} from "../Errors";

describe("GenericError", () => {
  it("should instantiate GenericError without options", () => {
    const errorProps = {
      message: "GenericError test message",
    };
    const error = new GenericError(errorProps.message);
    expect(error.name).toBe(ErrorTypesEnum.GenericError);
    expect(error.message).toBe(errorProps.message);
    expect(error.options).toEqual({});
  });

  it("should instantiate GenericError with Error as message", () => {
    const errorProps = {
      message: new Error("Test message"),
    };
    const error = new GenericError(errorProps.message);
    expect(error.name).toBe(ErrorTypesEnum.GenericError);
    expect(error.message).toBe(errorProps.message.message);
    expect(error.options).toEqual({});
  });

  it("should instantiate GenericError with custom name", () => {
    const errorProps = {
      message: "Test message",
      options: {
        name: ErrorTypesEnum.RequestError,
      },
    };
    const error = new GenericError(errorProps.message, errorProps.options);
    expect(error.name).toBe(errorProps.options.name);
    expect(error.message).toBe(errorProps.message);
    expect(error.options).toEqual(errorProps.options);
  });
});

describe("RequestError", () => {
  it("should instantiate RequestError", () => {
    const errorProps = {
      message: "Test message",
    };
    const error = new RequestError(errorProps.message);
    expect(error.name).toBe(ErrorTypesEnum.RequestError);
    expect(error.message).toBe(errorProps.message);
    expect(error.options).toEqual({});
  });
});

describe("ErrorResponse", () => {
  it("should instantiate ErrorResponse without options", () => {
    const errorProps = {
      error: new GenericError("Test message"),
    };
    const errorResponse = new ErrorResponse(errorProps.error);
    expect(errorResponse.ok).toBe(false);
    expect(errorResponse.error).toBe(errorProps.error);
    expect(errorResponse.status).toBe(0);
    expect(errorResponse.statusText).toBe("");
  });

  it("should instantiate ErrorResponse with options", () => {
    const errorProps = {
      error: new GenericError("Test message"),
      options: {
        status: 500,
        statusText: "Internal Server Error",
      },
    };
    const errorResponse = new ErrorResponse(
      errorProps.error,
      errorProps.options
    );
    expect(errorResponse.ok).toBe(false);
    expect(errorResponse.error).toBe(errorProps.error);
    expect(errorResponse.status).toBe(errorProps.options.status);
    expect(errorResponse.statusText).toBe(errorProps.options.statusText);
  });
});
