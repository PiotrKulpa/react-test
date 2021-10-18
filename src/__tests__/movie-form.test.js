import React from "react";
import { render , fireEvent } from "@testing-library/react";
import MovieForm from "../components/movie-form";


const empty_movie = {
  title: "",
  description: "",
};

describe("Movie form component", () => {
  test("should have form elements", () => {
    // wybieranie elementów po label i roli
    const { getByLabelText, getByRole } = render(<MovieForm movie={empty_movie} />);
    expect(getByLabelText(/title/i)).toBeTruthy();
    expect(getByLabelText(/description/i)).toBeTruthy();
    expect(getByRole("button", {name: /create/i})).toBeTruthy();
  });
});
