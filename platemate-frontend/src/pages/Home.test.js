import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "./Home";
import { BrowserRouter as Router } from "react-router-dom";
import { message } from "antd";

// Mocking the 'message' functionality of Ant Design
jest.mock("antd", () => ({
  ...jest.requireActual("antd"),
  message: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

test("handles image file upload successfully", async () => {
  // Render the Home component
  render(
    <Router>
      <Home />
    </Router>
  );

  // Select the file input using its ID or add a data-testid if necessary
  const fileInput = screen.getByTestId("upload-input");

  // Create a mock image file
  const file = new File(["dummy content"], "test-image.jpg", { type: "image/jpeg" });

  // Simulate a file change event
  fireEvent.change(fileInput, { target: { files: [file] } });

  // Wait for the success message to be triggered
  await waitFor(() => {
    expect(message.success).toHaveBeenCalledWith("1 file(s) selected.");
  });
});

test('displays error message when "Suggest Workouts" is clicked without selecting images', async () => {
  // Render the Home component
  render(
    <Router>
      <Home />
    </Router>
  );

  // Find and click the "Suggest Workouts" button
  const suggestWorkoutsButton = screen.getByRole("button", { name: /suggest workouts/i });
  fireEvent.click(suggestWorkoutsButton);

  // Wait for the error message to be called
  await waitFor(() => {
    expect(message.error).toHaveBeenCalledWith("No images selected. Please upload at least one image.");
  });
});