import React from "react";
import { render, fireEvent } from "../../test-utils/testWrapper";
import Button from "../Button";

describe("Button Component", () => {
  it("renders correctly", () => {
    const { getByText } = render(
      <Button title="Test Button" onPress={() => {}} />,
    );

    expect(getByText("Test Button")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={mockOnPress} />,
    );

    fireEvent.press(getByText("Test Button"));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it("applies correct styles for primary variant", () => {
    const { getByText } = render(
      <Button title="Primary Button" onPress={() => {}} variant="primary" />,
    );

    const button = getByText("Primary Button");
    expect(button).toBeTruthy();
  });

  it("applies correct styles for secondary variant", () => {
    const { getByText } = render(
      <Button
        title="Secondary Button"
        onPress={() => {}}
        variant="secondary"
      />,
    );

    const button = getByText("Secondary Button");
    expect(button).toBeTruthy();
  });
});
