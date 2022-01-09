import React from "react";
import { describe, it, expect } from "@jest/globals";
import { render, fireEvent } from "@testing-library/react";
import { TextInput } from "../TextInput";

describe("TextInput", () => {
  it("should render", () => {
    const { getByLabelText } = render(
      <TextInput aria-label="Text input" value={""} />
    );
    expect(getByLabelText("Text input")).toBeTruthy();
  });
});
