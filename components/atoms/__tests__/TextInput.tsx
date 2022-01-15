import React from "react";
import { jest, describe, it, expect } from "@jest/globals";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { TextInput } from "../TextInput";

describe("TextInput", () => {
  it("should render", () => {
    const label = "Text input";
    const { getByLabelText } = render(
      <TextInput aria-label={label} value={""} />
    );
    const input = getByLabelText(label);
    expect(input).toBeTruthy();
    expect(input).toHaveProperty("value", "");
    expect(input).toMatchSnapshot();
  });

  it("should render with initial text", () => {
    const label = "Text input";
    const value = "Initial text";
    const { getByLabelText } = render(
      <TextInput aria-label={label} value={value} />
    );
    const input = getByLabelText(label);
    expect(input).toBeTruthy();
    expect(input).toHaveProperty("value", value);
    expect(input).toMatchSnapshot();
  });

  it("should accept text input", () => {
    const label = "Text input";
    const value = "Initial text";
    const { getByLabelText } = render(
      <TextInput aria-label={label} value={value} />
    );
    const input = getByLabelText(label);
    expect(input).toBeTruthy();
    expect(input).toHaveProperty("value", value);
    expect(input).toMatchSnapshot();
    fireEvent.change(input, { target: { value: "New text" } });
    expect(input).toHaveProperty("value", "New text");
    expect(input).toMatchSnapshot();
  });

  it("should call validation", async () => {
    const label = "Text input";
    const value = "Initial text";
    const validate = jest.fn((v) => true);
    const onValidate = jest.fn((v) => {});
    const { getByLabelText } = render(
      <TextInput
        aria-label={label}
        value={value}
        validate={validate}
        onValidate={onValidate}
      />
    );

    const input = getByLabelText(label);
    fireEvent.change(input, { target: { value: "New text" } });
    await waitFor(() => {
      expect(validate).toHaveBeenCalled();
    });
    expect(validate).toHaveBeenLastCalledWith("New text");
    expect(onValidate).toHaveBeenLastCalledWith(true);
  });
});
