import React from "react";
import { describe, it, expect } from "@jest/globals";
import { render, fireEvent } from "@testing-library/react";
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
});
